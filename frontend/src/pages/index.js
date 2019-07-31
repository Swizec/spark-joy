import React from "react"
import { Link } from "gatsby"
import { Button } from "rebass"
import { CentralColumn } from "../components/styles"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import useAuth from "../auth"

import WidgetBuilder from "../components/WidgetBuilder"
import WidgetList from "../components/WidgetList"
import { Login } from "../components/User"

const IndexPage = () => {
  const { isAuthenticated, userId } = useAuth()

  return (
    <Layout>
      <SEO title="Home" />
      <CentralColumn style={{ paddingTop: "2em" }}>
        <p>Did your thing spark joy? Ask the fans and get some feedback :)</p>
        <p>Fill out the widget, export to HTML, insert anywhere. 👇</p>
        {!isAuthenticated() ? <Login /> : null}
        {isAuthenticated() ? (
          <>
            <WidgetBuilder userId={userId} />
            <WidgetList userId={userId} />
          </>
        ) : null}
      </CentralColumn>
    </Layout>
  )
}

export default IndexPage
