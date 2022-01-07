module.exports = {
  Query: {
    widget: async (_source, { userId, widgetId }, { dataSources }) => {
      return dataSources.widgetsTable.getWidget(userId, widgetId)
    },
    allWidget: async (_source, { userId }, { dataSources }) => {
      return dataSources.widgetsTable.getAllWidgets(userId)
    },
  },
  Mutation: {
    saveWidget: async (_source, props, { dataSources }) => {
      return dataSources.widgetsTable.saveWidget(props)
    },
    saveFeedback: async (_source, props, { dataSources }) => {
      return dataSources.feedbacksTable.updateFeedback(props)
    },
    widgetVote: async (_source, props, { dataSources }) => {
      const feedback = dataSources.feedbacksTable.createFeedback(props)
      const widget = dataSources.widgetsTable.addWidgetVote(props)
    },
  },
}
