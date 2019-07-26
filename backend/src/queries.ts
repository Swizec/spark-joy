import { getItem, scanItems } from "./dynamodb";

export const widget = async (
    _: any,
    { userId, widgetId }: { userId: string; widgetId: string }
) => {
    const result = await getItem({ Key: { userId, widgetId } });

    if (!result.Item) {
        return {};
    }

    return {
        ...result.Item,
        name: result.Item.widgetName
    };
};

export const allWidget = async (_: any, { userId }: { userId?: string }) => {
    // Query by userId if passed-in, otherwise return all widgets
    const result = await scanItems(
        userId
            ? {
                  FilterExpression: "#user = :userId",
                  ExpressionAttributeNames: {
                      "#user": "userId"
                  },
                  ExpressionAttributeValues: {
                      ":userId": userId
                  }
              }
            : {}
    );

    if (!result.Items) {
        return [];
    }

    return result.Items.map(widget => ({
        ...widget,
        name: widget.widgetName
    }));
};
