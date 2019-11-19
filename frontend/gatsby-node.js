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
            userId
            widgetId
            widgetType
            followupQuestions
          }
        }
      }
    `)

    result.data.widgetsapi.allWidget.forEach(
      ({ userId, widgetId, widgetType, followupQuestions }) => {
        const votePath = path.resolve("./src/pages/vote.js")
        const widgetPath = path.resolve("./src/pages/widget_admin.js")

        followupQuestions = JSON.parse(followupQuestions).sort(
          (a, b) => a.id - b.id
        )

        createPage({
          path: `/${widgetId}/thumbsup`,
          component: votePath,
          context: {
            userId,
            widgetId,
            followupQuestions,
            widgetType,
            voteType: "thumbsup",
          },
        })
        createPage({
          path: `/${widgetId}/thumbsdown`,
          component: votePath,
          context: {
            userId,
            widgetId,
            followupQuestions,
            widgetType,
            voteType: "thumbsdown",
          },
        })
        createPage({
          path: widgetId,
          component: widgetPath,
          context: {
            widgetId,
            widgetType,
          },
        })
      }
    )

    resolve()
  })
}
