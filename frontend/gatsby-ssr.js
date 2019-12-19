/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
import React from "react"
import { ApolloProvider } from "@apollo/react-hooks"
import { ThemeProvider } from "styled-components"
import { navigate } from "gatsby"

import { client } from "./src/apollo"
import theme from "./src/components/theme"
import { AuthProvider } from "react-use-auth"

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
