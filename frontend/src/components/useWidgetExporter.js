import React from "react"
import ReactDOM from "react-dom"
import { useMutation } from "@apollo/react-hooks"
import ButterToast, { Cinnamon } from "butter-toast"

import { copyToClipboard, getCSS, triggerSiteBuild } from "../utils"
import { SAVE_WIDGET_QUERY } from "../queries"
import { Widget } from "./Widget"

function useSaveWidget({ typeOfJoy, userId, followupQuestions }) {
  const [saveWidget, { data }] = useMutation(SAVE_WIDGET_QUERY, {
    variables: {
      widgetType: typeOfJoy,
      userId,
      followupQuestions: JSON.stringify(followupQuestions),
    },
    onCompleted: () => triggerSiteBuild(),
  })

  return saveWidget
}

function getWidgetHtml({ widgetId, typeOfJoy, instanceOfJoy }) {
  const widgetRef = React.createRef()

  // render virtual widget
  const widget = (
    <Widget
      value={typeOfJoy}
      widgetId={widgetId}
      instanceOfJoy={instanceOfJoy}
      ref={widgetRef}
    />
  )

  const el = document.createElement("div")
  ReactDOM.render(widget, el)

  const styles = getCSS(widgetRef.current)
  const html = `<style>${styles}</style>${el.innerHTML}`

  return html
}

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

// returns function to call for exporting
export function useWidgetExporter({
  typeOfJoy,
  userId,
  widgetId,
  instanceOfJoy,
  saveOnExport,
}) {
  const saveWidget = useSaveWidget({
    typeOfJoy,
    userId,
    followupQuestions,
  })

  // exports to clipboard
  // calls saveWidget if necessary
  return async function exportWidget() {
    const _widgetId = saveOnExport
      ? (await saveWidget()).saveWidget.widgetId
      : widgetId

    copyToClipboard(
      getWidgetHtml({
        typeOfJoy,
        widgetId: _widgetId,
        instanceOfJoy,
      })
    )

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
