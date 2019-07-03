import React, { useEffect, useState } from "react"
import { useApolloClient } from "react-apollo-hooks"
import { Form, Field } from "react-final-form"
import { Button } from "rebass"

import { CentralColumn } from "../components/styles"

import Image from "../components/image"
import SEO from "../components/seo"

import { WIDGET_VOTE_QUERY, SAVE_WIDGET_FEEDBACK_QUERY } from "../queries"

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

function renderField({ id, label, type }) {
  return (
    <div key={id}>
      <label>{label}</label>
      <br />
      <Field
        name={`field_${id}`}
        component="input"
        type="text"
        initialValue=""
        placeholder="Listen to your gut :)"
      />
    </div>
  )
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

  const [fieldIndex, setFieldIndex] = useState(0)

  useEffect(() => {
    saveVote({ widgetId, voteType, apolloClient })
  }, [])

  function onSubmit(values) {
    if (fieldIndex >= followupQuestions.length - 1) {
      console.log(values)
    } else {
      setFieldIndex(fieldIndex + 1)
    }
  }

  return (
    <>
      <SEO title="Thank You" />
      <CentralColumn style={{ paddingTop: "2em" }}>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              {renderField(followupQuestions[fieldIndex])}
            </form>
          )}
        />
      </CentralColumn>
    </>
  )
}

export default VotePage
