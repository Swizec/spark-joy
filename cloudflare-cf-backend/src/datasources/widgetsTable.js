const { DynamoDBDataSource } = require('./DynamoDBDataSource')

class WidgetsTable extends DynamoDBDataSource {
  constructor(config) {
    const tableName = WIDGETS_TABLE
    const keySchema = [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'widgetId', AttributeType: 'S' },
    ]

    super(tableName, keySchema, config)

    this.ttl = 30 * 60 // 30min
  }

  async getWidget(userId, widgetId) {
    return this.getItem({
      Key: { userId, widgetId },
      ttl: this.ttl,
    })
  }

  async getAllWidgets(userId) {
    return this.scan({
      FilterExpression: '#user = :userId',
      ExpressionAttributeNames: {
        '#user': 'userId',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ttl: this.ttl,
    })
  }
}

module.exports = WidgetsTable
