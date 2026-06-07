import cors from "cors";
import express from "express";
import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import Redis from "ioredis";

const PORT = Number(process.env.PORT ?? 4000);
const RATE_LIMIT = Number(process.env.RATE_LIMIT_PER_HOUR ?? 5);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "*";

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.AWS_REGION ?? "ap-south-1",
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "local",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "local",
    },
  })
);

const redis = new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");

const CONTACT_TABLE = process.env.CONTACT_TABLE!;
const ANALYTICS_TABLE = process.env.ANALYTICS_TABLE!;

const ALLOWED_EVENTS = new Set([
  "page_view",
  "section_view",
  "contact_open",
  "assistant_open",
]);

type ContactPayload = {
  name: string;
  company: string;
  role: string;
  location?: string;
  availability?: string;
  message?: string;
};

function parseContactBody(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const clean = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  const name = clean(data.name, 120);
  const company = clean(data.company, 120);
  const role = clean(data.role, 120);
  if (!name || !company || !role) return null;

  return {
    name,
    company,
    role,
    location: clean(data.location, 120) || undefined,
    availability: clean(data.availability, 120) || undefined,
    message: clean(data.message, 2000) || undefined,
  };
}

async function ensureTables() {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION ?? "ap-south-1",
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "local",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "local",
    },
  });

  const { CreateTableCommand, ListTablesCommand } = await import(
    "@aws-sdk/client-dynamodb"
  );

  const existing = await client.send(new ListTablesCommand({}));
  const names = new Set(existing.TableNames ?? []);

  const tables = [
    {
      TableName: CONTACT_TABLE,
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    },
    {
      TableName: ANALYTICS_TABLE,
      KeySchema: [
        { AttributeName: "pk", KeyType: "HASH" },
        { AttributeName: "sk", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "pk", AttributeType: "S" },
        { AttributeName: "sk", AttributeType: "S" },
      ],
    },
    {
      TableName: process.env.RATE_LIMIT_TABLE ?? "sajal-portfolio-rate-limits",
      KeySchema: [{ AttributeName: "pk", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "pk", AttributeType: "S" }],
    },
  ];

  for (const table of tables) {
    if (!names.has(table.TableName)) {
      await client.send(
        new CreateTableCommand({
          ...table,
          BillingMode: "PAY_PER_REQUEST",
        })
      );
      console.log(`Created table ${table.TableName}`);
    }
  }
}

async function isRateLimited(ip: string) {
  const key = `rate:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 3600);
  return count > RATE_LIMIT;
}

function mockSesEmail(payload: ContactPayload & { id: string }) {
  console.log("--- SES MOCK EMAIL ---");
  console.log(`To: ${process.env.OWNER_EMAIL}`);
  console.log(`Subject: Job Opportunity — ${payload.role} at ${payload.company}`);
  console.log(JSON.stringify(payload, null, 2));
  console.log("----------------------");
}

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    stack: ["Express", "Redis", "DynamoDB Local", "SES mock"],
  });
});

app.post("/contact", async (req, res) => {
  const payload = parseContactBody(req.body);
  if (!payload) {
    res.status(400).json({ error: "Invalid contact payload" });
    return;
  }

  const sourceIp = req.ip ?? "unknown";
  if (await isRateLimited(sourceIp)) {
    res.status(429).json({
      error: "Too many submissions. Please try again in an hour.",
    });
    return;
  }

  const record = {
    ...payload,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "queued",
    sourceIp,
  };

  await ddb.send(new PutCommand({ TableName: CONTACT_TABLE, Item: record }));

  // Local dev: process "SQS" inline
  mockSesEmail(record);
  await ddb.send(
    new UpdateCommand({
      TableName: CONTACT_TABLE,
      Key: { id: record.id },
      UpdateExpression: "SET #status = :sent",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":sent": "sent" },
    })
  );

  res.status(202).json({
    ok: true,
    id: record.id,
    message: "Submission received (local stack). Check API logs for SES mock.",
  });
});

app.post("/analytics/event", async (req, res) => {
  const eventName =
    typeof req.body?.event === "string" ? req.body.event.trim() : "";
  if (!ALLOWED_EVENTS.has(eventName)) {
    res.status(400).json({ error: "Unsupported analytics event" });
    return;
  }

  for (const metric of [eventName, "total_events"]) {
    await ddb.send(
      new UpdateCommand({
        TableName: ANALYTICS_TABLE,
        Key: { pk: "METRIC", sk: metric },
        UpdateExpression:
          "SET #value = if_not_exists(#value, :zero) + :inc, #updatedAt = :now",
        ExpressionAttributeNames: {
          "#value": "value",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":zero": 0,
          ":inc": 1,
          ":now": new Date().toISOString(),
        },
      })
    );
  }

  res.status(202).json({ ok: true });
});

app.get("/analytics/stats", async (_req, res) => {
  res.json({
    metrics: {
      page_views: "tracked",
      contact_submissions: "tracked",
      infrastructure: "Docker + Redis + DynamoDB Local",
    },
    note: "Local development stack mirroring AWS Lambda architecture.",
  });
});

async function start() {
  await ensureTables();
  app.listen(PORT, () => {
    console.log(`Portfolio local API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
