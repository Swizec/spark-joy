import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { IncomingWebhook } from "@slack/webhook";
import {
    GetSecretValueCommand,
    SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

type Vote = {
    createdAt: Date | null;
    voteType?: "thumbsup" | "thumbsdown";
    widgetId?: string;
    answers: string | null;
    instanceOfJoy?: string;
    voteId?: string;
    voter?: string;
};

function shouldNotify(record: DynamoDBRecord): boolean {
    // we only care about inserts and updates
    if (!(record.eventName === "INSERT" || record.eventName === "MODIFY")) {
        return false;
    }

    // can't do much unless the new values are there
    if (!record.dynamodb?.NewImage) {
        return false;
    }

    return true;
}

// function buildMessage(recordContents: { [key: string]: ) {
//     // if (record
// }

// reads slack webhook url from secrets manager
async function getSlackUrl() {
    const client = new SecretsManagerClient({
        region: "us-east-1",
    });
    const command = new GetSecretValueCommand({
        SecretId: "sparkjoySlackWebhook",
    });

    const secret = await client.send(command);

    if (!secret.SecretString) {
        throw new Error("Failed to read Slack Webhook URL");
    }

    return JSON.parse(secret.SecretString) as { webhookUrl: string };
}

async function sendNotification(vote: Vote): Promise<void> {
    console.log("Gonna send notification for", vote);

    const { webhookUrl } = await getSlackUrl();
    const webhook = new IncomingWebhook(webhookUrl);

    if (vote.voteType === "thumbsup") {
        await webhook.send({
            text: `Yay _${
                vote.instanceOfJoy
            }_ got a 👍 with answers \`${JSON.stringify(vote.answers)}\` from ${
                vote.voter
            }`,
        });
    } else {
        await webhook.send({
            text: `Womp _${
                vote.instanceOfJoy
            }_ got a 👎 with answers \`${JSON.stringify(vote.answers)}\` from ${
                vote.voter
            }`,
        });
    }
}

export async function handler(event: DynamoDBStreamEvent) {
    const votes = new Map();

    // collect latest instance of a vote
    // event processing happens in-order
    // https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html
    for (const record of event.Records) {
        if (shouldNotify(record)) {
            // shouldNotify guarantees NewImage is defined
            const vote = unmarshall(
                record.dynamodb!.NewImage! as {
                    [key: string]: AttributeValue;
                }
            );
            if (typeof vote.answers === "string") {
                vote.answers = JSON.parse(vote.answers);
            }

            votes.set(vote.voteId, vote);
        }
    }

    for (const [voteId, vote] of votes) {
        await sendNotification(vote);
    }
}
