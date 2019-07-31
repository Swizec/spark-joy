/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react"
import { ApolloProvider } from "react-apollo-hooks"
import { ThemeProvider } from "styled-components"

import { client } from "./src/apollo"
import theme from "./src/components/theme"
import { AuthContextProvider } from "./src/auth"

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <AuthContextProvider>{element}</AuthContextProvider>
    </ThemeProvider>
  </ApolloProvider>
)
