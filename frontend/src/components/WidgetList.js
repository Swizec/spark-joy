import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

const WidgetList = () => {
  const { widgetsapi } = useStaticQuery(
    graphql`
      query {
        widgetsapi {
          allWidget {
            widgetId
            name
          }
        }
      }
    `
  )

  return (
    <ul>
      {widgetsapi.allWidget.map(widget => (
        <li key={widget.widgetId}>
          <Link to={widget.widgetId}>{widget.name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default WidgetList
