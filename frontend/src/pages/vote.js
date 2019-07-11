import React, { useEffect, useState } from "react"
import { useApolloClient } from "react-apollo-hooks"
import styled from "styled-components"

import Image from "../components/image"
import SEO from "../components/seo"

import { WIDGET_VOTE_QUERY, SAVE_WIDGET_FEEDBACK_QUERY } from "../queries"
import { FullScreenForm } from "../components/FullScreenForm"

const FullScreen = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  min-height: 100vh;
  text-align: center;
`

async function saveVote({ widgetId, voteType, apolloClient }) {
  await apolloClient.mutate({
    mutation: WIDGET_VOTE_QUERY,
    variables: {
      widgetId: widgetId,
      thumbsup: voteType === "thumbsup",
      thumbsdown: voteType === "thumbsdown",
    },
  })
}

// Final submission method
//
// const onSubmit = async ({ widgetId, values, apolloClient }) => {
//   await apolloClient.mutate({
//     mutation: SAVE_WIDGET_FEEDBACK_QUERY,
//     variables: {
//       widgetId,
//       values: JSON.stringify(values),
//     },
//   })
// }

const VotePage = ({ pageContext }) => {
  const apolloClient = useApolloClient()
  const { widgetId, voteType, followupQuestions } = pageContext

  useEffect(() => {
    saveVote({ widgetId, voteType, apolloClient })
  }, [])

  function onSubmit(values) {
    console.log(values)
  }

  return (
    <FullScreen>
      <SEO title="Thank You" />
      <FullScreenForm
        onSubmit={onSubmit}
        followupQuestions={followupQuestions}
      />
    </FullScreen>
  )
}

export default VotePage
