import uuidv4 from "uuid/v4";
import { updateItem } from "./dynamodb";

export const saveWidget = async (
    _: any,
    {
        widgetType,
        userId,
        widgetId,
        followupQuestions,
    }: {
        widgetType: string;
        userId: string;
        widgetId?: string;
        followupQuestions?: string;
    }
) => {
    if (!widgetId) {
        widgetId = uuidv4();
    }

    // This works because we currently don't have a mechanism to update widgets
    // Otherwise it would overwrite the timestamp
    const createdAt = new Date().toISOString();

    const result = await updateItem({
        Key: { userId, widgetId },
        UpdateExpression:
            "SET widgetType = :widgetType, thumbsup = :thumbsup, thumbsdown = :thumbsdown, followupQuestions = :followupQuestions, createdAt = :createdAt",
        ExpressionAttributeValues: {
            ":widgetType": widgetType,
            ":followupQuestions": followupQuestions,
            ":thumbsup": 0,
            ":thumbsdown": 0,
            ":createdAt": createdAt,
        },
    });

    return {
        widgetType,
        widgetId,
        followupQuestions,
        thumbsup: 0,
        thumbsdown: 0,
    };
};

export const saveFeedback = async (
    _: any,
    {
        widgetId,
        voteId,
        instanceOfJoy,
        voteType,
        answers,
        createdAt,
        voter,
    }: {
        widgetId: string;
        voteId: string;
        instanceOfJoy: string;
        voteType: string;
        answers: any;
        createdAt: string;
        voter: string;
    }
) => {
    const fields = { instanceOfJoy, voter, voteType, answers, createdAt };

    const UpdateFields: string[] = Object.entries(fields)
        .filter(([key, val]) => val) // use only defined values
        .map(([key, val]) => key) // get list of keys
        .map((key) => `${key} = :${key}`); // get list of key = :key strings

    const ExpressionAttributeValues: [any, any][] = Object.entries(fields)
        .filter(([key, val]) => val) // use only defined values
        .map(([key, val]) => [`:${key}`, val]); // get list of [:key, val] entries

    const { Attributes } = await updateItem({
        TableName: process.env.FEEDBACKS_TABLE!,
        Key: { widgetId, voteId },
        UpdateExpression: `SET ${UpdateFields.join(",")}`,
        ExpressionAttributeValues: Object.fromEntries(
            ExpressionAttributeValues
        ),
        ReturnValues: "ALL_NEW",
    });

    return Attributes;
};

export const widgetVote = async (
    _: any,
    {
        userId,
        widgetId,
        thumbsup = false,
        thumbsdown = false,
        voter = "",
        instanceOfJoy = "",
    }: {
        userId: string;
        widgetId: string;
        thumbsup?: boolean;
        thumbsdown?: boolean;
        voter?: string;
        instanceOfJoy?: string;
    }
) => {
    const voteId = uuidv4(),
        createdAt = new Date().toISOString(),
        voteType = thumbsup ? "thumbsup" : "thumbsdown";

    // Saves vote per user:widget pair
    // But now we need it separate for instances of widget types
    // const widgetUpdateResult = await updateItem({
    //     Key: { userId, widgetId },
    //     UpdateExpression:
    //         "SET thumbsup = thumbsup + :thumbsup, thumbsdown = thumbsdown + :thumbsdown",
    //     ExpressionAttributeValues: {
    //         ":thumbsup": thumbsup ? 1 : 0,
    //         ":thumbsdown": thumbsdown ? 1 : 0
    //     },
    //     ReturnValues: "ALL_NEW"
    // });
    // const widget = widgetUpdateResult.Attributes || {};

    const feedback = await saveFeedback(
        {},
        {
            widgetId,
            voteId,
            instanceOfJoy,
            createdAt,
            voteType,
            voter,
            answers: {},
        }
    );

    return {
        // ...widget,
        ...feedback,
    };
};
