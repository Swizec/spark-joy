/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import styled, { ThemeProvider } from "styled-components"

import "./layout.css"

import theme from "./theme"
import Header from "./header"
import { CentralColumn } from "./styles"

const Footer = styled.footer`
  font-size: 0.5em;
`

const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 70px 1fr 30px;
  min-height: 100vh;
`

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <ThemeProvider theme={theme}>
        <Body>
          <Header siteTitle={data.site.siteMetadata.title} />

          <main>{children}</main>

          <Footer>
            <CentralColumn>
              © {new Date().getFullYear()}, Built with ❤️ on the internet
            </CentralColumn>
          </Footer>
        </Body>
      </ThemeProvider>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
