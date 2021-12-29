import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";

type Vote = {
    createdAt: Date | null;
    voteType?: string;
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

async function sendNotification(vote: Vote): Promise<void> {
    console.log("Gonna send notification for", vote);
    // const message = buildMessage(record);
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
