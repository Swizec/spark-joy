const { ApolloServer } = require('apollo-server-cloudflare')
const {
  graphqlCloudflare,
} = require('apollo-server-cloudflare/dist/cloudflareApollo')

const KVCache = require('../kv-cache')
const resolvers = require('../resolvers')
const typeDefs = require('../schema')
const WidgetsTable = require('../datasources/widgetsTable')

console.log(AWS_ACCESS_KEY_ID)

const dataSources = () => ({
  widgetsTable: new WidgetsTable({
    region: AWS_REGION,

    // created with wrangler secrets
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  }),
})

const kvCache = { cache: new KVCache() }

const createServer = (graphQLOptions) =>
  new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    dataSources,
    ...(graphQLOptions.kvCache ? kvCache : {}),
  })

const handler = async (request, graphQLOptions) => {
  const server = createServer(graphQLOptions)
  await server.start()
  return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(
    request,
  )
}

module.exports = handler
