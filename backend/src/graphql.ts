import { ApolloServer, gql } from "apollo-server-lambda";
import { DocumentNode } from "graphql";
// import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { saveWidget, saveFeedback, widgetVote } from "./mutations";
import { widget, allWidget } from "./queries";

// poor man's memoization
let typeDefs: DocumentNode | null = null;
function getTypeDefs() {
    if (!typeDefs) {
        typeDefs = gql`
            type Widget {
                widgetType: String!
                userId: String!
                widgetId: String!
                createdAt: String
                thumbsup: Int
                thumbsdown: Int
                followupQuestions: String
            }

            type Feedback {
                widgetId: String!
                voteId: String!
                voteType: String!
                answers: String!
                createdAt: String
                voter: String
                instanceOfJoy: String
            }

            type Query {
                widget(userId: String!, widgetId: String!): Widget
                allWidget(userId: String): [Widget]
            }

            type VoteResult {
                widgetType: String!
                widgetId: String!
                followupQuestions: String
                voteId: String!
                createdAt: String
                voter: String
                instanceOfJoy: String
            }

            type Mutation {
                saveWidget(
                    widgetType: String!
                    userId: String!
                    widgetId: String
                    followupQuestions: String
                ): Widget
                widgetVote(
                    userId: String!
                    widgetId: String!
                    thumbsup: Boolean
                    thumbsdown: Boolean
                    voter: String
                    instanceOfJoy: String
                ): VoteResult
                saveFeedback(
                    widgetId: String!
                    voteId: String!
                    voteType: String!
                    answers: String!
                    createdAt: String
                    instanceOfJoy: String
                ): Feedback
            }
        `;
    }

    return typeDefs;
}

const resolvers = {
    Query: {
        widget,
        allWidget,
    },
    Mutation: {
        saveWidget,
        widgetVote,
        saveFeedback,
    },
};

// poor man's memoization
let server: ApolloServer | null = null;
function getServer() {
    if (!server) {
        server = new ApolloServer({
            typeDefs: getTypeDefs(),
            resolvers,
        });
    }

    return server;
}

// export const server = new ApolloServer({
//     typeDefs: typeDefs,
//     resolvers: resolvers,
// });

export const handler = getServer().createHandler({
    expressGetMiddlewareOptions: {
        cors: {
            origin: "*",
            credentials: true,
        },
    },
});
