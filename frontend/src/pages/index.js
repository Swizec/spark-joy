import React from "react"
import { Link } from "gatsby"
import { Button } from "rebass"
import { CentralColumn } from "../components/styles"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Auth from "../auth"

import WidgetBuilder from "../components/WidgetBuilder"
import WidgetList from "../components/WidgetList"

const auth = new Auth()

// Move to actual component
const Login = () => {
  const { isAuthenticated } = auth

  console.log(auth.getUser())

  if (isAuthenticated()) {
    return <Button onClick={auth.logout}>Logout {auth.getUserName()}</Button>
  } else {
    return <Button onClick={auth.login}>Login</Button>
  }
}

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <CentralColumn style={{ paddingTop: "2em" }}>
      <p>Did your thing spark joy? Ask the fans and get some feedback :)</p>
      <p>Fill out the widget, export to HTML, insert anywhere. 👇</p>
      <Login />
      {auth.isAuthenticated() ? (
        <>
          <WidgetBuilder />
          <WidgetList />
        </>
      ) : null}
    </CentralColumn>
  </Layout>
)

export default IndexPage
