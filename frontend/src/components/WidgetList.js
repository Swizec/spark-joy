import React from "react"
import { Link } from "gatsby"
import { useQuery } from "react-apollo-hooks"
import { Heading, Box } from "rebass"

import { ALL_WIDGETS_QUERY } from "../queries"

const WidgetList = ({ userId }) => {
  const {
    data: { allWidget },
  } = useQuery(ALL_WIDGETS_QUERY, {
    variables: { userId },
  })

  return (
    <Box mt={4}>
      <Heading mb={3}>Your widgets</Heading>
      {allWidget ? (
        <ul>
          {allWidget.map(widget => (
            <li key={widget.widgetId}>
              <Link to={widget.widgetId}>{widget.name}</Link> |{" "}
              <small>
                {widget.thumbsup} 👍 {widget.thumbsdown} 👎
              </small>
            </li>
          ))}
        </ul>
      ) : null}
    </Box>
  )
}

export default WidgetList
