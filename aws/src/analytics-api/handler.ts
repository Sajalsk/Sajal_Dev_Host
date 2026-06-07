import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { corsHeaders, jsonResponse } from "../shared/cors";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.ANALYTICS_TABLE!;

const ALLOWED_EVENTS = new Set([
  "page_view",
  "section_view",
  "contact_open",
  "assistant_open",
]);

async function incrementMetric(metric: string, amount = 1) {
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { pk: "METRIC", sk: metric },
      UpdateExpression:
        "SET #value = if_not_exists(#value, :zero) + :inc, #updatedAt = :now",
      ExpressionAttributeNames: {
        "#value": "value",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":zero": 0,
        ":inc": amount,
        ":now": new Date().toISOString(),
      },
    })
  );
}

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const path = event.path.replace(/\/+$/, "");

  if (event.httpMethod === "GET" && path.endsWith("/analytics/stats")) {
    return jsonResponse(200, {
      metrics: {
        page_views: "tracked",
        contact_submissions: "tracked",
        infrastructure: "AWS serverless",
      },
      note: "Public aggregate stats — detailed counts available in DynamoDB / CloudWatch.",
    });
  }

  if (event.httpMethod === "POST" && path.endsWith("/analytics/event")) {
    let body: { event?: string };
    try {
      body = JSON.parse(event.body ?? "{}");
    } catch {
      return jsonResponse(400, { error: "Invalid JSON" });
    }

    const eventName = body.event?.trim();
    if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
      return jsonResponse(400, { error: "Unsupported analytics event" });
    }

    await incrementMetric(eventName);
    await incrementMetric("total_events");

    return jsonResponse(202, { ok: true });
  }

  return jsonResponse(404, { error: "Not found" });
};
