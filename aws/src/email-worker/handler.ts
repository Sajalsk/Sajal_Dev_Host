import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { SQSHandler } from "aws-lambda";
import type { ContactPayload } from "../shared/types";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESClient({});

function buildEmailBody(payload: ContactPayload & { id: string; createdAt: string }) {
  return [
    "New recruiter inquiry from portfolio",
    "",
    `Submission ID: ${payload.id}`,
    `Received: ${payload.createdAt}`,
    "",
    `Recruiter / HR: ${payload.name}`,
    `Company: ${payload.company}`,
    `Role: ${payload.role}`,
    `Location: ${payload.location || "Not specified"}`,
    `Joining / notice: ${payload.availability || "To be discussed"}`,
    "",
    "Additional details:",
    payload.message || "(none)",
    "",
    "---",
    "Sent via AWS Lambda + SQS + SES",
  ].join("\n");
}

export const handler: SQSHandler = async (event) => {
  const toEmail = process.env.OWNER_EMAIL!;
  const fromEmail = process.env.FROM_EMAIL!;

  for (const record of event.Records) {
    const payload = JSON.parse(record.body) as ContactPayload & {
      id: string;
      createdAt: string;
    };

    try {
      await ses.send(
        new SendEmailCommand({
          Source: fromEmail,
          Destination: { ToAddresses: [toEmail] },
          ReplyToAddresses: [toEmail],
          Message: {
            Subject: {
              Data: `Job Opportunity — ${payload.role} at ${payload.company}`,
            },
            Body: {
              Text: { Data: buildEmailBody(payload) },
            },
          },
        })
      );

      await ddb.send(
        new UpdateCommand({
          TableName: process.env.CONTACT_TABLE!,
          Key: { id: payload.id },
          UpdateExpression: "SET #status = :sent",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: { ":sent": "sent" },
        })
      );
    } catch (error) {
      console.error("Failed to process contact email", error);

      await ddb.send(
        new UpdateCommand({
          TableName: process.env.CONTACT_TABLE!,
          Key: { id: payload.id },
          UpdateExpression: "SET #status = :failed",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: { ":failed": "failed" },
        })
      );

      throw error;
    }
  }
};
