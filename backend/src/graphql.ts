import { ApolloServer, gql } from "apollo-server-lambda";
import AWS from "aws-sdk";
import uuidv4 from "uuid/v4";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

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

            const result = await new Promise((resolve, reject) => {
                dynamoDB.update({
                    TableName: process.env.DYNAMODB_TABLE!,
                    Key: { widgetId },
                    UpdateExpression: "SET widgetId = :widgetId, name = :name",
                    ExpressionAttributeValues: {
                        ":widgetId": widgetId,
                        ":name": name
                    }
                });
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
