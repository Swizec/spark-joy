const { DynamoDBDataSource } = require('apollo-datasource-dynamodb')

class WidgetsTable extends DynamoDBDataSource {
  constructor(config) {
    super(this.tableName, this.tableKeySchema, config)

    this.tableName = WIDGETS_TABLE
    this.tableKeySchema = [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'widgetId', AttributeType: 'S' },
    ]
    this.ttl = 30 * 60 // 30 minutes
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
