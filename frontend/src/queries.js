import gql from "graphql-tag"

export const SAVE_WIDGET_QUERY = gql`
  mutation saveWidget(
    $name: String!
    $widgetId: String
    $followupQuestions: String
  ) {
    saveWidget(
      name: $name
      widgetId: $widgetId
      followupQuestions: $followupQuestions
    ) {
      widgetId
    }
  }
`

export const WIDGET_VOTE_QUERY = gql`
  mutation widgetVote(
    $widgetId: String!
    $thumbsup: Boolean
    $thumbsdown: Boolean
  ) {
    widgetVote(
      widgetId: $widgetId
      thumbsup: $thumbsup
      thumbsdown: $thumbsdown
    ) {
      thumbsup
      thumbsdown
    }
  }
`

export const WIDGET_QUERY = gql`
  query widget($widgetId: String!) {
    widget(widgetId: $widgetId) {
      name
      thumbsup
      thumbsdown
    }
  }
`
