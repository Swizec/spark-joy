import React, { useEffect, useReducer } from "react"
import { useApolloClient, useQuery } from "react-apollo-hooks"
import { PacmanLoader } from "react-spinners"
import { Card, Heading } from "rebass"
import { Link } from "gatsby"
import { useAuth } from "react-use-auth"

import { CentralColumn } from "../components/styles"
import theme from "../components/theme"

import Layout from "../components/layout"
import SEO from "../components/seo"
import WidgetBuilder from "../components/WidgetBuilder"

import { WIDGET_QUERY } from "../queries"

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

const WidgetState = ({ widgetId, widgetType, thumbsup, thumbsdown }) => (
  <>
    <Votes thumbsup={thumbsup} thumbsdown={thumbsdown} />
    <WidgetBuilder
      editable={false}
      widgetId={widgetId}
      widgetType={widgetType}
    />
  </>
)

const WidgetPage = ({ pageContext }) => {
  const { userId } = useAuth()
  const { loading, error, data } = useQuery(WIDGET_QUERY, {
    variables: {
      widgetId: pageContext.widgetId,
      userId,
    },
  })

  const { widgetId, widgetType } = pageContext

  return (
    <Layout>
      <SEO title="Thank You" />
      <CentralColumn style={{ paddingTop: "2em" }}>
        <Heading>Did {pageContext.widgetType} spark joy?</Heading>

        {loading || error ? (
          <PacmanLoader
            sizeUnit={"px"}
            size={50}
            color={theme.colors.primary}
            loading={loading || !!error}
          />
        ) : (
          <WidgetState
            {...data.widget}
            widgetId={widgetId}
            widgetType={widgetType}
          />
        )}
        <Link to="/">Back</Link>
      </CentralColumn>
    </Layout>
  )
}

export default WidgetPage
