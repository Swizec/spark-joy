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

// transforms an event record to a vote
function recordToVote(record: DynamoDBRecord): Vote {
    if (!record.dynamodb?.NewImage) {
        throw new Error("Invalid DB record");
    }

    // this feels like I'm missing a util library
    return {
        createdAt: record.dynamodb.NewImage.createdAt.S
            ? new Date(record.dynamodb?.NewImage?.createdAt.S)
            : null,
        voteType: record.dynamodb.NewImage.voteType.S,
        widgetId: record.dynamodb.NewImage.widgetId.S,
        answers: record.dynamodb.NewImage.answers.S
            ? JSON.parse(record.dynamodb.NewImage.answers.S)
            : null,
        instanceOfJoy: record.dynamodb.NewImage.instanceOfJoy.S,
        voteId: record.dynamodb.NewImage.voteId.S,
        voter: record.dynamodb.NewImage.voter.S,
    };
}

export async function handler(event: DynamoDBStreamEvent) {
    const votes = new Map();

    // collect latest instance of a vote
    // event processing happens in-order
    // https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html
    for (const record of event.Records) {
        if (shouldNotify(record)) {
            const vote = recordToVote(record);
            votes.set(vote.voteId, vote);
        }
    }

    for (const [voteId, vote] of votes) {
        await sendNotification(vote);
    }
}
