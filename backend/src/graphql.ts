import { ApolloServer, gql } from "apollo-server-lambda";
import uuidv4 from "uuid/v4";
import { updateItem } from "./dynamodb";

const typeDefs = gql`
    type Widget {
        name: String!
        widgetId: String!
        thumbsup: Int
        thumbsdown: Int
    }

    type Query {
        hello: String
    }

    type Mutation {
        saveWidget(name: String!): Widget
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello world"
    },
    Mutation: {
        saveWidget: async (_: any, { name }: { name: string }) => {
            const widgetId = uuidv4();

            const result = updateItem({
                Key: { widgetId },
                UpdateExpression:
                    "SET widgetId = :widgetId, widgetName = :name",
                ExpressionAttributeValues: {
                    ":widgetId": widgetId,
                    ":name": name
                }
            });

            console.log(result);

            return {
                name,
                widgetId,
                thumbsup: 0,
                thumbsdown: 0
            };
        }
    }
};

export const server = new ApolloServer({
    typeDefs,
    resolvers
});

export const handler = server.createHandler();
