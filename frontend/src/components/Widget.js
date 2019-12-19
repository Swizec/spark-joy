import React from "react"
import styled from "styled-components"
import { palette } from "styled-tools"

import { Heading, Flex } from "./styles"

const Input = styled.input`
  border: 0;
  border-bottom: 1px solid black;
  padding: 0 0.5em;
  width: 150px;

  &:focus {
    outline: none;
  }
`

const RoundButton = styled.a`
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

const WidgetLayout = styled.div`
  width: 450px;
  display: grid;
  grid-template-rows: 0.3fr 0.7fr;
`

const Question = styled(Heading)`
  text-align: center;
`

export const Widget = React.forwardRef(
  ({ widgetId, editable, value, onNameChange, instanceOfJoy }, ref) => {
    let domain = ""
    if (typeof window !== "undefined") {
      domain = `${window.location.protocol}//${window.location.host}`
    }

    return (
      <WidgetLayout ref={ref}>
        <Question h2>
          Did this{" "}
          {editable ? (
            <Input
              type="text"
              value={value}
              onChange={event => onNameChange(event.target.value)}
            />
          ) : (
            value
          )}{" "}
          spark joy?
        </Question>
        <Flex row>
          <RoundButton
            href={`${domain}/${widgetId}/thumbsdown?voter={{ subscriber.email_address }}&instanceOfJoy=${instanceOfJoy}`}
          >
            👎
          </RoundButton>
          <RoundButton
            href={`${domain}/${widgetId}/thumbsup?voter={{ subscriber.email_address }}&instanceOfJoy=${instanceOfJoy}`}
          >
            👍
          </RoundButton>
        </Flex>
      </WidgetLayout>
    )
  }
)
