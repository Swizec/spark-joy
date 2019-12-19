import React, { useState } from "react"
import styled from "styled-components"
import { Button } from "rebass"

import { useWidgetExporter } from "./useWidgetExporter"
import { Widget } from "./Widget"

const Layout = styled.div`
  width: 450px;
  height: 250px;
  display: grid;
  grid-template-rows: 1fr 0.2fr;
`

const WidgetBuilder = ({ userId, widgetId, widgetType, editable = true }) => {
  const [typeOfJoy, setTypeOfJoy] = useState(widgetType)
  const [instanceOfJoy, setInstanceOfJoy] = useState("")

  const exportWidget = useWidgetExporter({
    typeOfJoy,
    userId,
    widgetId,
    instanceOfJoy,
    saveOnExport: editable,
  })

  return (
    <Layout>
      <Widget
        editable={editable}
        value={typeOfJoy}
        instanceOfJoy={instanceOfJoy}
        onNameChange={setTypeOfJoy}
      />
      <input
        type="text"
        name="instanceOfJoy"
        value={instanceOfJoy}
        onChange={ev => setInstanceOfJoy(ev.target.value)}
        placeholder={`Which ${typeOfJoy} are you asking about?`}
      />
      <Button bg="primary" onClick={exportWidget}>
        Export
      </Button>
    </Layout>
  )
}

export default WidgetBuilder
