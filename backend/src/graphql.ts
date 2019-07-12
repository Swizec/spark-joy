import { ApolloServer, gql } from "apollo-server-lambda";
import uuidv4 from "uuid/v4";
import { updateItem, getItem, scanItems } from "./dynamodb";

const typeDefs = gql`
    type Widget {
        name: String!
        widgetId: String!
        thumbsup: Int
        thumbsdown: Int
        followupQuestions: String
    }

    type Feedback {
        widgetId: String!
        answers: String!
    }

    type Query {
        widget(widgetId: String!): Widget
        allWidget: [Widget]
    }

    type Mutation {
        saveWidget(
            name: String!
            widgetId: String
            followupQuestions: String
        ): Widget
        widgetVote(
            widgetId: String!
            thumbsup: Boolean
            thumbsdown: Boolean
        ): Widget
        saveFeedback(widgetId: String!, answers: String!): Feedback
    }
`;

const resolvers = {
    Query: {
        widget: async (_: any, { widgetId }: { widgetId: string }) => {
            const result = await getItem({ Key: { widgetId } });

            if (!result.Item) {
                return {};
            }

            return {
                ...result.Item,
                name: result.Item.widgetName
            };
        },
        allWidget: async () => {
            const result = await scanItems({});

            if (!result.Items) {
                return [];
            }

            return result.Items.map(widget => ({
                ...widget,
                name: widget.widgetName
            }));
        }
    },
    Mutation: {
        saveWidget: async (
            _: any,
            {
                name,
                widgetId,
                followupQuestions
            }: { name: string; widgetId?: string; followupQuestions?: string }
        ) => {
            if (!widgetId) {
                widgetId = uuidv4();
            }

            const result = await updateItem({
                Key: { widgetId },
                UpdateExpression:
                    "SET widgetName = :name, thumbsup = :thumbsup, thumbsdown = :thumbsdown, followupQuestions = :followupQuestions",
                ExpressionAttributeValues: {
                    ":name": name,
                    ":followupQuestions": followupQuestions,
                    ":thumbsup": 0,
                    ":thumbsdown": 0
                }
            });

            console.log(result);

            return {
                name,
                widgetId,
                followupQuestions,
                thumbsup: 0,
                thumbsdown: 0
            };
        },
        widgetVote: async (
            _: any,
            {
                widgetId,
                thumbsup = false,
                thumbsdown = false
            }: { widgetId: string; thumbsup?: boolean; thumbsdown?: boolean }
        ) => {
            const { Attributes } = await updateItem({
                Key: { widgetId },
                UpdateExpression:
                    "SET thumbsup = thumbsup + :thumbsup, thumbsdown = thumbsdown + :thumbsdown",
                ExpressionAttributeValues: {
                    ":thumbsup": thumbsup ? 1 : 0,
                    ":thumbsdown": thumbsdown ? 1 : 0
                },
                ReturnValues: "ALL_NEW"
            });

            return {
                ...Attributes,
                name: Attributes && Attributes.widgetName
            };
        },
        saveFeedback: async (
            _: any,
            { widgetId, answers }: { widgetId: string; answers: any }
        ) => {
            const { Attributes } = await updateItem({
                TableName: process.env.FEEDBACKS_TABLE!,
                Key: { widgetId },
                UpdateExpression: "SET answers = :answers",
                ExpressionAttributeValues: {
                    ":answers": answers
                },
                ReturnValues: "ALL_NEW"
            });

            return Attributes;
        }
    }
};

export const server = new ApolloServer({
    typeDefs,
    resolvers
});

export const handler = server.createHandler({
    cors: {
        origin: "*",
        credentials: true
    }
});
