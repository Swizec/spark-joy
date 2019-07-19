import { getItem, scanItems } from "./dynamodb";

export const widget = async (_: any, { widgetId }: { widgetId: string }) => {
    const result = await getItem({ Key: { widgetId } });

    if (!result.Item) {
        return {};
    }

    return {
        ...result.Item,
        name: result.Item.widgetName
    };
};

export const allWidget = async () => {
    const result = await scanItems({});

    if (!result.Items) {
        return [];
    }

    return result.Items.map(widget => ({
        ...widget,
        name: widget.widgetName
    }));
}
    }