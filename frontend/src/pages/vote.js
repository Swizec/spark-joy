import React, { useEffect, useState } from "react"
import { useApolloClient } from "react-apollo-hooks"
import { Form, Field } from "react-final-form"
import { Button, Heading, Text, Box, Flex } from "rebass"
import styled from "styled-components"
import { fontSize, lineHeight, fontFamily } from "styled-system"

import { CentralColumn } from "../components/styles"

import Image from "../components/image"
import SEO from "../components/seo"

import { WIDGET_VOTE_QUERY, SAVE_WIDGET_FEEDBACK_QUERY } from "../queries"

const FullScreen = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  min-height: 100vh;
  text-align: center;
`

const Input = styled("input")(
  {
    padding: "0.5rem 1rem",
    width: "80%",
    border: 0,
  },
  fontSize,
  lineHeight,
  fontFamily
)

const InputBox = styled(Box)`
  height: 60px;
`

const ExplainerText = styled(Text)`
  width: 80%;
  text-align: left;
  display: inline-block;
`

const BulletText = styled(Text)`
  display: inline;
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

const InputComponent = props => (
  <InputBox>
    <BulletText fontSize={[1, 2, 3]}>{props.index + 1}. 👉</BulletText>
    <Input
      fontSize={[3, 4, 5]}
      placeholder="Listen to your gut :)"
      {...props.input}
    />
    {props.meta.active ? (
      <ExplainerText fontSize={[0.5, 1, 1]}>
        <strong>Enter</strong> to submit
      </ExplainerText>
    ) : null}
  </InputBox>
)

function renderField({ index, id, label, type }) {
  return (
    <div key={id}>
      <Heading fontSize={[4, 5, 6]}>
        <label>{label}</label>
      </Heading>
      <br />
      <Field
        name={`field_${id}`}
        component={InputComponent}
        type="text"
        initialValue=""
        index={index}
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
    <FullScreen>
      <SEO title="Thank You" />
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {renderField({
              index: fieldIndex,
              ...followupQuestions[fieldIndex],
            })}
          </form>
        )}
      />
    </FullScreen>
  )
}

export default VotePage
