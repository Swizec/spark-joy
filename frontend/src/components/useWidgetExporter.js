import React from "react"
import ReactDOM from "react-dom"
import { useApolloClient } from "react-apollo-hooks"
import ButterToast, { Cinnamon } from "butter-toast"

import { copyToClipboard, getCSS, triggerSiteBuild } from "../utils"
import { SAVE_WIDGET_QUERY } from "../queries"
import { Widget } from "./Widget"

// saves widget instance to database
async function saveToBackend({
  typeOfJoy,
  followupQuestions,
  userId,
  apolloClient,
}) {
  const { data } = await apolloClient.mutate({
    mutation: SAVE_WIDGET_QUERY,
    variables: {
      name: typeOfJoy,
      userId,
      followupQuestions: JSON.stringify(followupQuestions),
    },
  })
  return data
}

function getWidgetHtml({ data, typeOfJoy }) {
  const widgetRef = React.createRef()

  // render virtual widget
  const widget = (
    <Widget
      value={typeOfJoy}
      widgetId={data.saveWidget.widgetId}
      ref={widgetRef}
    />
  )

  const el = document.createElement("div")
  ReactDOM.render(widget, el)

  const styles = getCSS(widgetRef.current)
  const html = `<style>${styles}</style>${el.innerHTML}`

  return html
}

// returns function to call for exporting
export function useWidgetExporter({ typeOfJoy, userId }) {
  const apolloClient = useApolloClient()

  // Hardcoded for now, will be part of UI in future
  const followupQuestions = [
    {
      label: "Why?",
      id: 1,
      type: "text",
    },
    {
      label: "Have a burning question?",
      id: 2,
      type: "text",
    },
    {
      label: "Would you recommend this to a friend?",
      id: 3,
      type: "boolean",
    },
  ]

  return async function saveWidget() {
    const data = await saveToBackend({
      typeOfJoy,
      followupQuestions,
      userId,
      apolloClient,
    })

    triggerSiteBuild()
    copyToClipboard(getWidgetHtml({ data }))

    ButterToast.raise({
      content: (
        <Cinnamon.Crisp
          scheme={Cinnamon.Crisp.SCHEME_BLUE}
          title="Copied to clipboard!"
          content={() => <div> 👍Paste HTML into your favorite editor </div>}
        />
      ),
    })
  }
}
