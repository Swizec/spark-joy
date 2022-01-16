import { ApolloServer, gql } from "apollo-server-lambda";
import { saveWidget, saveFeedback, widgetVote } from "./mutations";
import { widget, allWidget } from "./queries";

const typeDefs = gql`
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
        voteId: String!
        followupQuestions: String
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

export const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

export const handler = server.createHandler({
    cors: {
        origin: "*",
        credentials: true,
    },
});
