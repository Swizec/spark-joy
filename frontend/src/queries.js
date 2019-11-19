import gql from "graphql-tag"

export const SAVE_WIDGET_QUERY = gql`
  mutation saveWidget(
    $widgetType: String!
    $userId: String!
    $widgetId: String
    $followupQuestions: String
  ) {
    saveWidget(
      widgetType: $widgetType
      userId: $userId
      widgetId: $widgetId
      followupQuestions: $followupQuestions
    ) {
      widgetId
    }
  }
`

export const SAVE_WIDGET_FEEDBACK_QUERY = gql`
  mutation saveFeedback(
    $widgetId: String!
    $voteId: String!
    $voteType: String!
    $answers: String!
    $createdAt: String
  ) {
    saveFeedback(
      widgetId: $widgetId
      voteId: $voteId
      voteType: $voteType
      answers: $answers
      createdAt: $createdAt
    ) {
      answers
    }
  }
`

export const WIDGET_VOTE_QUERY = gql`
  mutation widgetVote(
    $userId: String!
    $widgetId: String!
    $thumbsup: Boolean
    $thumbsdown: Boolean
    $voter: String
    $instanceOfJoy: String
  ) {
    widgetVote(
      userId: $userId
      widgetId: $widgetId
      thumbsup: $thumbsup
      thumbsdown: $thumbsdown
      voter: $voter
      instanceOfJoy: $instanceOfJoy
    ) {
      voteId
    }
  }
`

export const WIDGET_QUERY = gql`
  query widget($userId: String!, $widgetId: String!) {
    widget(userId: $userId, widgetId: $widgetId) {
      widgetType
      thumbsup
      thumbsdown
    }
  }
`

export const ALL_WIDGETS_QUERY = gql`
  query allWidget($userId: String!) {
    allWidget(userId: $userId) {
      widgetId
      widgetType
      thumbsup
      thumbsdown
      createdAt
    }
  }
`
