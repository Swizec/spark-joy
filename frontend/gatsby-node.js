/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require("path")

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: "empty",
    },
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise(async resolve => {
    const result = await graphql(`
      query {
        widgetsapi {
          allWidget {
            widgetId
          }
        }
      }
    `)

    result.data.widgetsapi.allWidget.forEach(({ widgetId }) => {
      const componentPath = path.resolve("./src/pages/vote.js")
      createPage({
        path: `/${widgetId}/thumbsup`,
        component: componentPath,
        context: {
          voteType: "thumbsup",
        },
      })
      createPage({
        path: `/${widgetId}/thumbsdown`,
        component: componentPath,
        context: {
          voteType: "thumbsdown",
        },
      })
    })

    resolve()
  })
}
