const { DynamoDBDataSource } = require('apollo-datasource-dynamodb')

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
    return this.getItem(
      {
        TableName: this.tableName,
        ConsistentRead: true,
        Key: { userId, widgetId },
      },
      this.ttl,
    )
  }

  async getAllWidgets(userId) {
    return this.scan(
      {
        TableName: this.tableName,
        ConsistentRead: true,
        FilterExpression: '#user = :userId',
        ExpressionAttributeNames: {
          '#user': 'userId',
        },
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      },
      this.ttl,
    )
  }
}

module.exports = WidgetsTable
