import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { corsHeaders, jsonResponse } from "../shared/cors";
import { parseContactBody } from "../shared/validate";
import type { ContactRecord } from "../shared/types";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sqs = new SQSClient({});

const RATE_LIMIT = Number(process.env.RATE_LIMIT_PER_HOUR ?? 5);

async function isRateLimited(ip: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const ttl = now + 3600;
  const key = `RATE#${ip}`;

  try {
    await ddb.send(
      new UpdateCommand({
        TableName: process.env.RATE_LIMIT_TABLE!,
        Key: { pk: key },
        UpdateExpression:
          "SET #count = if_not_exists(#count, :zero) + :one, #ttl = :ttl",
        ConditionExpression:
          "attribute_not_exists(#count) OR #count < :limit",
        ExpressionAttributeNames: {
          "#count": "count",
          "#ttl": "ttl",
        },
        ExpressionAttributeValues: {
          ":zero": 0,
          ":one": 1,
          ":limit": RATE_LIMIT,
          ":ttl": ttl,
        },
      })
    );
    return false;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "name" in err &&
      err.name === "ConditionalCheckFailedException"
    ) {
      return true;
    }
    throw err;
  }
}

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const payload = parseContactBody(event.body);
  if (!payload) {
    return jsonResponse(400, { error: "Invalid contact payload" });
  }

  const sourceIp =
    event.requestContext.identity?.sourceIp ??
    event.headers["X-Forwarded-For"]?.split(",")[0]?.trim() ??
    "unknown";

  if (await isRateLimited(sourceIp)) {
    return jsonResponse(429, {
      error: "Too many submissions. Please try again in an hour.",
    });
  }

  const record: ContactRecord = {
    ...payload,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "queued",
    sourceIp,
  };

  await ddb.send(
    new PutCommand({
      TableName: process.env.CONTACT_TABLE!,
      Item: record,
    })
  );

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: process.env.CONTACT_QUEUE_URL!,
      MessageBody: JSON.stringify({
        id: record.id,
        ...payload,
        createdAt: record.createdAt,
      }),
    })
  );

  return jsonResponse(202, {
    ok: true,
    id: record.id,
    message: "Submission received. Email notification queued.",
  });
};
