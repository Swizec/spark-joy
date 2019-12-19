import React, { useEffect, useState } from "react"
import { useApolloClient, useMutation } from "@apollo/react-hooks"
import styled from "styled-components"
import { Heading } from "rebass"

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

// Sends a vote to the backend
// Locally stores data to prevent double-voting
function useSaveVote({ userId, widgetId, voteType }) {
  const [storageKey, setStorageKey] = useState("")
  const [saveVote, { data }] = useMutation(WIDGET_VOTE_QUERY, {
    onCompleted: () => {
      // save vote type in unique local storage key
      if (typeof localStorage !== "undefined") {
        console.log("saving to localstorage", storageKey)
        localStorage.setItem(storageKey, voteType)
      }
    },
  })

  // save vote on page load
  useEffect(() => {
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new Map()
    const instanceOfJoy = params.get("instanceOfJoy") || "undefined"
    const storageKey = `sparkJoy:voted:${widgetId}:${instanceOfJoy}`
    setStorageKey(storageKey)

    // allow changing your vote, but not re-voting
    if (
      typeof localStorage === "undefined" ||
      localStorage.getItem(storageKey) !== voteType
    ) {
      saveVote({
        variables: {
          userId: userId,
          widgetId: widgetId,
          thumbsup: voteType === "thumbsup",
          thumbsdown: voteType === "thumbsdown",
          voter: params.get("voter"),
          instanceOfJoy,
        },
      })
    }
    // }
  }, [])

  return data ? data.widgetVote.voteId : null
}

const VoteTypeHeading = ({ voteType, widgetType }) =>
  voteType === "thumbsup" ? (
    <Heading fontSize={[5, 6, 7]}>
      👍 you enjoyed Swizec's {widgetType} 👍
    </Heading>
  ) : (
    <Heading fontSize={[5, 6, 7]}>
      👎 you didn't enjoy Swizec's {widgetType} 👎
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

const FormView = ({ voteType, onSubmit, followupQuestions, widgetType }) => (
  <>
    <VoteTypeHeading voteType={voteType} widgetType={widgetType} />
    <FullScreenForm onSubmit={onSubmit} followupQuestions={followupQuestions} />
  </>
)

const VotePage = ({ pageContext }) => {
  const apolloClient = useApolloClient()
  const {
    userId,
    widgetId,
    voteType,
    followupQuestions,
    widgetType,
  } = pageContext

  const [showThankYou, setShowThankYou] = useState(false)
  const voteId = useSaveVote({ userId, widgetId, voteType })

  async function onSubmit(answers) {
    if (Object.values(answers).length >= followupQuestions.length) {
      setShowThankYou(true)
    }

    await apolloClient.mutate({
      mutation: SAVE_WIDGET_FEEDBACK_QUERY,
      variables: {
        widgetId,
        voteId,
        voteType,
        answers: JSON.stringify(answers),
      },
    })
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
          widgetType={widgetType}
        />
      )}
      <Footer>
        © {new Date().getFullYear()}, Built with ❤️ on the internet
      </Footer>
    </FullScreen>
  )
}

export default ({ pageContext }) =>
  pageContext.isCreatedByStatefulCreatePages ? null : (
    <VotePage pageContext={pageContext} />
  )
