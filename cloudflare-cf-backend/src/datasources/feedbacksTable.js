const { DynamoDBDataSource } = require('./DynamoDBDataSource')
const uuidv4 = require('uuid/v4')

class FeedbacksTable extends DynamoDBDataSource {
  constructor(config) {
    const tableName = FEEDBACKS_TABLE
    const keySchema = [
      { AttributeName: 'widgetId', AttributeType: 'S' },
      { AttributeName: 'voteId', AttributeType: 'S' },
    ]

    super(tableName, keySchema, config)

    this.ttl = 30 * 60 // 30min
  }

  async createFeedback({
    widgetId,
    instanceOfJoy,
    voter,
    thumbsup = false,
    thumbsdown = false,
  }) {
    const voteId = uuidv4()
    const createdAt = new Date().toISOString()
    const voteType = thumbsup ? 'thumbsup' : 'thumbsdown'

    return this.updateFeedback({
      widgetId,
      voteId,
      instanceOfJoy,
      voter,
      voteType,
    })
  }

  async updateFeedback({
    widgetId,
    voteId,
    instanceOfJoy,
    voteType,
    answers,
    createdAt,
    voter,
  }) {
    const fields = { instanceOfJoy, voter, voteType, answers, createdAt }

    const UpdateFields = Object.entries(fields)
      .filter(([key, val]) => val) // use only defined values
      .map(([key, val]) => key) // get list of keys
      .map((key) => `${key} = :${key}`) // get list of key = :key strings

    const ExpressionAttributeValues = Object.entries(fields)
      .filter(([key, val]) => val) // use only defined values
      .map(([key, val]) => [`:${key}`, val]) // get list of [:key, val] entries

    return this.update({
      Key: { widgetId, voteId },
      UpdateExpression: `SET ${UpdateFields.join(',')}`,
      ExpressionAttributeValues: Object.fromEntries(ExpressionAttributeValues),
      ReturnValues: 'ALL_NEW',
    })
  }
}

module.exports = FeedbacksTable
