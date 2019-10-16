/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react"
import { ApolloProvider } from "react-apollo-hooks"
import { ThemeProvider } from "styled-components"
import { AuthProvider } from "react-use-auth"
import { navigate } from "gatsby"

import { client } from "./src/apollo"
import theme from "./src/components/theme"

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <AuthProvider
        navigate={navigate}
        auth0_domain="sparkjoy.auth0.com"
        auth0_client_id="GGfO12E5R8iHPBPh87bym5b3gzmdaYY9"
      >
        {element}
      </AuthProvider>
    </ThemeProvider>
  </ApolloProvider>
)
