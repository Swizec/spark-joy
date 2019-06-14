import React, { useEffect } from "react"
import { useApolloClient } from "react-apollo-hooks"

import { CentralColumn } from "../components/styles"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import { WIDGET_VOTE_QUERY } from "../queries"

async function saveVote({ widgetId, voteType, apolloClient }) {
  const result = await apolloClient.mutate({
    mutation: WIDGET_VOTE_QUERY,
    variables: {
      widgetId: widgetId,
      thumbsup: voteType === "thumbsup",
      thumbsdown: voteType === "thumbsdown",
    },
  })

  console.log(result)
}

const VotePage = ({ pageContext }) => {
  const apolloClient = useApolloClient()
  const { widgetId, voteType } = pageContext

  useEffect(() => {
    saveVote({ widgetId, voteType, apolloClient })
  }, [])

  return (
    <Layout>
      <SEO title="Thank You" />
      <CentralColumn style={{ paddingTop: "2em" }}>
        <p>Thank you, you are the best!</p>
      </CentralColumn>
    </Layout>
  )
}

export default VotePage
