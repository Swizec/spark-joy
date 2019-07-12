import React, { useEffect, useState } from "react"
import { useApolloClient } from "react-apollo-hooks"
import styled from "styled-components"
import { Heading } from "rebass"

import Image from "../components/image"
import SEO from "../components/seo"

import { WIDGET_VOTE_QUERY, SAVE_WIDGET_FEEDBACK_QUERY } from "../queries"
import { FullScreenForm } from "../components/FullScreenForm"
import { Footer } from "../components/styles"

const FullScreen = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 140px 1fr;
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

const VoteTypeHeading = ({ voteType, name }) =>
  voteType === "thumbsup" ? (
    <Heading fontSize={[5, 6, 7]}>👍 you enjoyed Swizec's {name} 👍</Heading>
  ) : (
    <Heading fontSize={[5, 6, 7]}>
      👎 you didn't enjoy Swizec's {name} 👎
    </Heading>
  )

const ThankYouView = () => (
  <>
    <div />
    <div>
      <img src="https://media.giphy.com/media/QAsBwSjx9zVKoGp9nr/giphy.gif" />
      <Heading fontSize={[3, 4, 5]}>
        ❤️️️ Thank you, you're the best! ❤️
      </Heading>
    </div>
  </>
)

const FormView = ({ voteType, onSubmit, followupQuestions, name }) => (
  <>
    <VoteTypeHeading voteType={voteType} name={name} />
    <FullScreenForm onSubmit={onSubmit} followupQuestions={followupQuestions} />
  </>
)

const VotePage = ({ pageContext }) => {
  const apolloClient = useApolloClient()
  const { widgetId, voteType, followupQuestions, name } = pageContext
  const [showThankYou, setShowThankYou] = useState(false)

  useEffect(() => {
    saveVote({ widgetId, voteType, apolloClient })
  }, [])

  function onSubmit(values) {
    if (Object.values(values).length >= followupQuestions.length) {
      setShowThankYou(true)
    }
    console.log(values)
  }

  return (
    <FullScreen>
      <SEO title="Thank You" />
      {showThankYou ? (
        <ThankYouView />
      ) : (
        <FormView
          voteType={voteType}
          onSubmit={onSubmit}
          followupQuestions={followupQuestions}
          name={name}
        />
      )}
      <Footer>
        © {new Date().getFullYear()}, Built with ❤️ on the internet
      </Footer>
    </FullScreen>
  )
}

export default VotePage
