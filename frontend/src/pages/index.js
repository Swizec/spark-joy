import React from "react"
import { Link } from "gatsby"
import { CentralColumn } from "../components/styles"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <CentralColumn>
      <p>this is body</p>
    </CentralColumn>
  </Layout>
)

export default IndexPage
