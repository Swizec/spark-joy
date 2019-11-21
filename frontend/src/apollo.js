import ApolloClient from "apollo-boost"
import fetch from "isomorphic-fetch"

import ENV_VARS from "../env-helper"

export const client = new ApolloClient({
  uri: ENV_VARS.server_uri,
  fetch,
})
