import React, { useEffect, useReducer } from "react"
import { useApolloClient } from "react-apollo-hooks"
import { PacmanLoader } from "react-spinners"
import { Card, Heading } from "rebass"
import { Link } from "gatsby"
import { useAuth } from "react-use-auth"

import { CentralColumn } from "../components/styles"
import theme from "../components/theme"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import WidgetBuilder from "../components/WidgetBuilder"

import { WIDGET_QUERY } from "../queries"

async function getWidget({ userId, widgetId, apolloClient }) {
  const result = await apolloClient.query({
    query: WIDGET_QUERY,
    variables: {
      widgetId: widgetId,
      userId: userId,
    },
  })

  return result.data.widget
}

function useWidgetState({ widgetId, name }) {
  const apolloClient = useApolloClient()
  const { userId } = useAuth()

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "loading":
          return { ...state, loading: true }
        case "loaded":
          return { ...state, loading: false, ...action.widget }
        default:
          return state
      }
    },
    { widgetId, name, thumbsup: 0, thumbsdown: 0, loading: false }
  )

  useEffect(() => {
    dispatch({ type: "loading" })
    ;(async () => {
      const widget = await getWidget({
        userId,
        widgetId,
        apolloClient,
      })
      dispatch({ type: "loaded", widget })
    })()
  }, [])

  return state
}

const Votes = ({ thumbsup, thumbsdown }) => (
  <>
    <Card
      fontSize={5}
      fontWeight="bold"
      width={[1, 1, 1 / 2]}
      p={3}
      my={3}
      bg="#f6f6ff"
      borderRadius={8}
      boxShadow="0 2px 16px rgba(0, 0, 0, 0.25)"
    >
      👎 {thumbsdown}
    </Card>
    <Card
      fontSize={5}
      fontWeight="bold"
      width={[1, 1, 1 / 2]}
      p={3}
      my={3}
      bg="#f6f6ff"
      borderRadius={8}
      boxShadow="0 2px 16px rgba(0, 0, 0, 0.25)"
    >
      👍 {thumbsup}
    </Card>
  </>
)

const WidgetPage = ({ pageContext }) => {
  const { widgetId, name, thumbsup, thumbsdown, loading } = useWidgetState(
    pageContext
  )

  console.log(pageContext, { widgetId, name, thumbsup, thumbsdown, loading })

  return (
    <Layout>
      <SEO title="Thank You" />
      <CentralColumn style={{ paddingTop: "2em" }}>
        <Heading>Did {name} spark joy?</Heading>
        <PacmanLoader
          sizeUnit={"px"}
          size={50}
          color={theme.colors.primary}
          loading={loading}
        />
        {loading ? null : <Votes thumbsup={thumbsup} thumbsdown={thumbsdown} />}
        <WidgetBuilder editable={false} widgetId={widgetId} name={name} />
        <Link to="/">Back</Link>
      </CentralColumn>
    </Layout>
  )
}

export default WidgetPage
