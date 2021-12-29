import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";

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

async function sendNotification(record: DynamoDBRecord): Promise<void> {
    // const message = buildMessage(record);
}

export async function handler(event: DynamoDBStreamEvent) {
    console.log("Handling stuff from dynamodb");
    for (const record of event.Records) {
        console.log(record, record.dynamodb);
        if (shouldNotify(record)) {
            console.log(record, record.dynamodb);
            await sendNotification(record);
        }
    }
}
