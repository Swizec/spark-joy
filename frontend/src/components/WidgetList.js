import React from "react"
import { Link } from "gatsby"
import { useQuery } from "react-apollo-hooks"

import { ALL_WIDGETS_QUERY } from "../queries"

const WidgetList = ({ userId }) => {
  const { widgets, error } = useQuery(ALL_WIDGETS_QUERY, {
    variables: { userId },
  })

  console.log(widgets, error)

  return "this is a list of widgets"

  //   return (
  //     <ul>
  //       {widgetsapi.allWidget.map(widget => (
  //         <li key={widget.widgetId}>
  //           <Link to={widget.widgetId}>{widget.name}</Link>
  //         </li>
  //       ))}
  //     </ul>
  //   )
}

export default WidgetList
