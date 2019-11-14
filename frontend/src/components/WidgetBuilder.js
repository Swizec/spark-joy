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

const WidgetBuilder = ({ userId, name, editable = true }) => {
  const [typeOfJoy, setTypeOfJoy] = useState(name)

  const exportWidget = useWidgetExporter({ typeOfJoy, userId })

  return (
    <Layout>
      <Widget editable={editable} value={typeOfJoy} update={setTypeOfJoy} />
      <Button bg="primary" onClick={exportWidget}>
        Export
      </Button>
    </Layout>
  )
}

export default WidgetBuilder
