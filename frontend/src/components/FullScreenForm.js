import React, { useState } from "react"
import { Form, Field } from "react-final-form"
import { Button, Heading, Text, Box, Flex } from "rebass"
import styled from "styled-components"
import { fontSize, lineHeight, fontFamily } from "styled-system"
import posed, { PoseGroup } from "react-pose"

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

const ExplainerText = posed(styled(Text)`
  width: 80%;
  text-align: left;
  display: inline-block;
`)({
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 14 },
})

const BulletText = styled(Text)`
  display: inline;
`

const InputComponent = props => (
  <InputBox>
    <BulletText fontSize={[1, 2, 3]}>{props.index + 1}. 👉</BulletText>
    <Input
      fontSize={[3, 4, 5]}
      placeholder="Listen to your gut :)"
      {...props.input}
    />
    <PoseGroup>
      {props.meta.active ? (
        <ExplainerText fontSize={[0.5, 1, 1]} key="explainer">
          <strong>Enter</strong> to submit
        </ExplainerText>
      ) : null}
    </PoseGroup>
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

export const FullScreenForm = ({ onSubmit, followupQuestions }) => {
  const [fieldIndex, setFieldIndex] = useState(0)

  function handleSubmit(values) {
    if (fieldIndex >= followupQuestions.length - 1) {
      console.log(values)
      // onSubmit(values)
    } else {
      setFieldIndex(fieldIndex + 1)
    }
  }

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          {renderField({
            index: fieldIndex,
            ...followupQuestions[fieldIndex],
          })}
        </form>
      )}
    />
  )
}
