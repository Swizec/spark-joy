import React, { useState } from "react"
import styled from "styled-components"
import { Button } from "rebass"

import { Heading, Flex } from "./styles"
import { palette } from "styled-tools"

const Input = styled.input`
  border: 0;
  border-bottom: 1px solid black;
  padding: 0 0.5em;
  width: 150px;

  &:focus {
    outline: none;
  }
`

const RoundButton = styled.button`
  border-radius: 100%;
  font-size: ${palette("headings", 0)};
  line-height: ${palette("headings", 0)};
  width: 2em;
  height: 2em;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:first-child {
    margin-right: 10px;
  }
`

const Layout = styled.div`
  width: 450px;
  height: 250px;
  display: grid;
  grid-template-rows: 0.5fr 1fr 0.2fr;
`

const Question = styled(Heading)`
  text-align: center;
`

const WidgetBuilder = () => {
  const [typeOfJoy, setTypeOfJoy] = useState("")

  return (
    <Layout>
      <Question h2>
        Did this{" "}
        <Input
          type="text"
          value={typeOfJoy}
          onChange={event => setTypeOfJoy(event.target.value)}
        />{" "}
        spark joy?
      </Question>
      <Flex row>
        <RoundButton>👎</RoundButton>
        <RoundButton>👍</RoundButton>
      </Flex>
      <Button bg="primary">Export</Button>
    </Layout>
  )
}

export default WidgetBuilder
