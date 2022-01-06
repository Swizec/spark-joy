const { gql } = require('apollo-server-cloudflare')

module.exports = gql`
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
`
