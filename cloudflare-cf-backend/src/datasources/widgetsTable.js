const { DynamoDBDataSource } = require('apollo-datasource-dynamodb')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
} = require('@aws-sdk/lib-dynamodb')

class WidgetsTable extends DynamoDBDataSource {
  constructor(config) {
    const tableName = WIDGETS_TABLE
    const keySchema = [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'widgetId', AttributeType: 'S' },
    ]

    // need @aws-sdk v3 client because of XMLHttpRequest
    const client = new DynamoDBClient(config)
    const docClient = DynamoDBDocumentClient.from(client)

    super(tableName, keySchema, config, docClient)

    this.ttl = 30 * 60 // 30min
  }

  async getWidget(userId, widgetId) {
    const command = new GetCommand({
      TableName: this.tableName,
      ConsistentRead: true,
      Key: { userId, widgetId },
      ttl: this.ttl,
    })
    const result = await this.dynamoDbDocClient.send(command)
    return result.Item
  }

  async getAllWidgets(userId) {
    const command = new ScanCommand({
      TableName: this.tableName,
      ConsistentRead: true,
      FilterExpression: '#user = :userId',
      ExpressionAttributeNames: {
        '#user': 'userId',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ttl: this.ttl,
    })
    const result = await this.dynamoDbDocClient.send(command)

    return result.Items
  }
}

module.exports = WidgetsTable
