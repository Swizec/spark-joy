import styled from "styled-components"
import { palette } from "styled-tools"

export const CentralColumn = styled.div`
  margin: 0 auto;
  max-width: 960px;
`

function headingSize({ h1, h2, h3, h4, h5 }) {
  if (h1) {
    return 0
  } else if (h2) {
    return 1
  } else if (h3) {
    return 2
  } else if (h4) {
    return 3
  } else if (h5) {
    return 4
  } else {
    return 0
  }
}

export const Heading = styled.h1`
  font-size: ${props => palette("headings", headingSize(props))};
  line-height: ${props => palette("headings", headingSize(props))};
  margin-bottom: 0;
`

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => (props.column ? "column" : "row")};
  justify-content: center;
`

export const Footer = styled.footer`
  font-size: 0.5em;
`
