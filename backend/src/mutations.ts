import uuidv4 from "uuid/v4";
import { updateItem } from "./dynamodb";

export const saveWidget = async (
    _: any,
    {
        name,
        userId,
        widgetId,
        followupQuestions
    }: {
        name: string;
        userId: string;
        widgetId?: string;
        followupQuestions?: string;
    }
) => {
    if (!widgetId) {
        widgetId = uuidv4();
    }

    const result = await updateItem({
        Key: { userId, widgetId },
        UpdateExpression:
            "SET widgetName = :name, thumbsup = :thumbsup, thumbsdown = :thumbsdown, followupQuestions = :followupQuestions",
        ExpressionAttributeValues: {
            ":name": name,
            ":followupQuestions": followupQuestions,
            ":thumbsup": 0,
            ":thumbsdown": 0
        }
    });

    return {
        name,
        widgetId,
        followupQuestions,
        thumbsup: 0,
        thumbsdown: 0
    };
};

export const saveFeedback = async (
    _: any,
    {
        widgetId,
        voteId,
        voteType,
        answers,
        createdAt
    }: {
        widgetId: string;
        voteId: string;
        voteType: string;
        answers: any;
        createdAt: string;
    }
) => {
    const fields = { voteType, answers, createdAt };

    const UpdateFields: string[] = Object.entries(fields)
        .filter(([key, val]) => val) // use only defined values
        .map(([key, val]) => key) // get list of keys
        .map(key => `${key} = :${key}`); // get list of key = :key strings

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
        ReturnValues: "ALL_NEW"
    });

    return Attributes;
};

export const widgetVote = async (
    _: any,
    {
        widgetId,
        thumbsup = false,
        thumbsdown = false
    }: { widgetId: string; thumbsup?: boolean; thumbsdown?: boolean }
) => {
    const voteId = uuidv4(),
        createdAt = new Date().toISOString(),
        voteType = thumbsup ? "thumbsup" : "thumbsdown";

    const widgetUpdateResult = await updateItem({
        Key: { widgetId },
        UpdateExpression:
            "SET thumbsup = thumbsup + :thumbsup, thumbsdown = thumbsdown + :thumbsdown",
        ExpressionAttributeValues: {
            ":thumbsup": thumbsup ? 1 : 0,
            ":thumbsdown": thumbsdown ? 1 : 0
        },
        ReturnValues: "ALL_NEW"
    });
    const widget = widgetUpdateResult.Attributes || {};
    widget.name = widget.widgetName;

    const feedback = await saveFeedback(
        {},
        {
            widgetId,
            voteId,
            createdAt,
            voteType,
            answers: {}
        }
    );

    return {
        ...widget,
        ...feedback
    };
};
