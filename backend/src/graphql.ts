import { ApolloServer, gql } from "apollo-server-lambda";
import { saveWidget, saveFeedback, widgetVote } from "./mutations";
import { widget, allWidget } from "./queries";

const typeDefs = gql`
    type Widget {
        name: String!
        userId: String!
        widgetId: String!
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
    }

    type Query {
        widget(widgetId: String!): Widget
        allWidget(userId: String): [Widget]
    }

    type VoteResult {
        name: String!
        widgetId: String!
        followupQuestions: String
        voteId: String!
        createdAt: String
    }

    type Mutation {
        saveWidget(
            name: String!
            userId: String!
            widgetId: String
            followupQuestions: String
        ): Widget
        widgetVote(
            widgetId: String!
            thumbsup: Boolean
            thumbsdown: Boolean
        ): VoteResult
        saveFeedback(
            widgetId: String!
            voteId: String!
            voteType: String!
            answers: String!
            createdAt: String
        ): Feedback
    }
`;

const resolvers = {
    Query: {
        widget,
        allWidget
    },
    Mutation: {
        saveWidget,
        widgetVote,
        saveFeedback
    }
};

export const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});

export const handler = server.createHandler({
    cors: {
        origin: "*",
        credentials: true
    }
});
