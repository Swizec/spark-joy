const { DynamoDBDataSource } = require('./DynamoDBDataSource')
const uuidv4 = require('uuid/v4')

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

  async saveWidget({ widgetType, userId, widgetId, followupQuestions }) {
    if (!widgetId) {
      widgetId = uuidv4()
    }

    // This works because we currently don't have a mechanism to update widgets
    // Otherwise it would overwrite the timestamp
    const createdAt = new Date().toISOString()

    const result = await this.update({
      Key: { userId, widgetId },
      UpdateExpression:
        'SET widgetType = :widgetType, thumbsup = :thumbsup, thumbsdown = :thumbsdown, followupQuestions = :followupQuestions, createdAt = :createdAt',
      ExpressionAttributeValues: {
        ':widgetType': widgetType,
        ':followupQuestions': followupQuestions,
        ':thumbsup': 0,
        ':thumbsdown': 0,
        ':createdAt': createdAt,
      },
    })

    return {
      widgetType,
      widgetId,
      followupQuestions,
      thumbsup: 0,
      thumbsdown: 0,
    }
  }

  async addWidgetVote({ userId, widgetId, thumbsup, thumbsdown }) {
    return this.update({
      Key: { userId, widgetId },
      UpdateExpression:
        'SET thumbsup = thumbsup + :thumbsup, thumbsdown = thumbsdown + :thumbsdown',
      ExpressionAttributeValues: {
        ':thumbsup': thumbsup ? 1 : 0,
        ':thumbsdown': thumbsdown ? 1 : 0,
      },
    })
  }
}

module.exports = WidgetsTable
