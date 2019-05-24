import React, { useState } from "react"
import styled from "styled-components"

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
`

const Layout = styled.div`
  width: 450px;
`

const WidgetBuilder = () => {
  const [typeOfJoy, setTypeOfJoy] = useState("")

  return (
    <Layout>
      <Heading h2>
        Did this{" "}
        <Input
          type="text"
          value={typeOfJoy}
          onChange={event => setTypeOfJoy(event.target.value)}
        />{" "}
        spark joy?
      </Heading>
      <Flex row>
        <RoundButton>👎</RoundButton>
        <RoundButton>👍</RoundButton>
      </Flex>
    </Layout>
  )
}

export default WidgetBuilder
