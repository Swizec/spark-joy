module.exports = {
  Query: {
    widget: async (_source, { userId, widgetId }, { dataSources }) => {
      return {}
      //   return dataSources.widgetsTable.getWidget(userId, widgetId)
    },
    allWidget: async (_source, { userId }, { dataSources }) => {
      return []
      //   return dataSources.widgetsTable.getAllWidgets(userId)
    },
  },
}
