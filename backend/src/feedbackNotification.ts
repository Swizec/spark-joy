import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { IncomingWebhook } from "@slack/webhook";
import {
    GetSecretValueCommand,
    SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

type Vote = {
    createdAt: string;
    voteType: "thumbsup" | "thumbsdown";
    widgetId: string;
    answers?: { [key: string]: string };
    instanceOfJoy: string;
    voteId: string;
    voter: string;
};

type VoteRecord = DynamoDBRecord & {
    vote: Vote;
};

function parseRecord(record: DynamoDBRecord): VoteRecord {
    if (!record.dynamodb?.NewImage) {
        throw new Error("Invalid DynamoDBRecord");
    }

    const vote = unmarshall(
        record.dynamodb?.NewImage as {
            [key: string]: AttributeValue;
        }
    );

    if (typeof vote.answers === "string") {
        vote.answers = JSON.parse(vote.answers);
    }

    return {
        ...record,
        vote: vote as Vote,
    };
}

// decides if we should do the thing
function shouldNotify(record: VoteRecord): boolean {
    // we only care about inserts and updates
    if (!(record.eventName === "INSERT" || record.eventName === "MODIFY")) {
        return false;
    }

    // only send for Swizec's widgetIds
    if (
        ![
            "1b23e2b6-1c2a-49a2-b3ee-69bb26c125e9",
            "50c48f9e-66bd-47d0-9c78-4865719ad305",
            "aab01040-bb89-40d9-8a2e-92ede0f8d82b",
            "c02dba9a-2eed-48d8-acd8-5b1797b5b14a",
            "e7e9ae80-73ac-45e7-84e0-38fc6b5443b1",
            "e9819383-7166-4d69-a091-557bd7f73f22",
            // test
            "8e4d5e4a-7a51-4ecf-a577-c0a2255281d7",
        ].includes(record.vote.widgetId)
    ) {
        return false;
    }

    return true;
}

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
    const votes = new Map<string, Vote>();

    // collect latest instance of a vote
    // event processing happens in-order
    // https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html
    for (const record of event.Records) {
        const voteRecord = parseRecord(record);

        if (shouldNotify(voteRecord)) {
            votes.set(voteRecord.vote.voteId, voteRecord.vote);
        }
    }

    for (const [voteId, vote] of votes) {
        await sendNotification(vote);
    }
}
