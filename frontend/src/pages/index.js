import React from "react"
import { Button, Heading, Text } from "rebass"
import styled from "styled-components"
import FadeIn from "react-lazyload-fadein"
import { useAuth } from "react-use-auth"

import Layout from "../components/layout"
import { JoyGuyImage } from "../components/image"
import SEO from "../components/seo"
import WidgetDemoGif from "../images/widget-demo.gif"

import WidgetBuilder from "../components/WidgetBuilder"
import WidgetList from "../components/WidgetList"
import { Footer, CentralColumn } from "../components/styles"

const FullScreen = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  min-height: 100vh;
  text-align: center;
`

const HomePage = () => {
  const { userId } = useAuth()

  return (
    <Layout>
      <SEO title="Home" />
      <CentralColumn style={{ paddingTop: "2em" }}>
        <p>Did your thing spark joy? Ask the fans and get some feedback :)</p>
        <p>Fill out the widget, export to HTML, insert anywhere. 👇</p>
        <>
          <WidgetBuilder userId={userId} />
          <WidgetList userId={userId} />
        </>
      </CentralColumn>
    </Layout>
  )
}

const LandingPage = () => {
  const { login } = useAuth()
  return (
    <FullScreen>
      <SEO title="Spark Joy" />
      <CentralColumn style={{ maxWidth: 860 }}>
        <Heading fontSize={[5, 6, 7]} mt={[30, 60, 100]} mb={[10, 25, 40]}>
          Get feedback on anything
          <Text fontSize={[3, 4, 5]}>
            Stop wondering how you're doing, ask your fans
          </Text>
        </Heading>
        <a onClick={login}>
          <JoyGuyImage title="Start sparking joy" />
        </a>
        <Text fontSize={[2, 3, 4]} mb={3} mt={4}>
          Spark Joy lets you ask the most important question with everything you
          make 👇
        </Text>
        <Text fontSize={[3, 4, 5]} mb={4}>
          <em>"Did you enjoy this?"</em>
        </Text>
        <Text fontSize={[2, 3, 4]} mb={3}>
          Your fans click 👍 or 👎, tell you <em>Why?</em> and your work
          improves.
        </Text>
        <Button
          onClick={login}
          fontSize={[3, 4, 5]}
          paddingLeft={[3, 4, 5]}
          paddingRight={[3, 4, 5]}
          paddingTop={[1, 2, 3]}
          paddingBottom={[1, 2, 3]}
          margin={[3, 4, 5]}
          style={{ cursor: "pointer" }}
        >
          ❤️ Start Sparking Joy ❤️
        </Button>
        <FadeIn height={200}>
          {onload => <img src={WidgetDemoGif} onLoad={onload} />}
        </FadeIn>
      </CentralColumn>
      <Footer>
        © {new Date().getFullYear()}, Built with ❤️ on the internet
      </Footer>
    </FullScreen>
  )
}

const IndexPage = () => {
  const { isAuthenticated } = useAuth()

  return isAuthenticated() ? <HomePage /> : <LandingPage />
}

export default IndexPage
