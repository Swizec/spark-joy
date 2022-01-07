const { DataSource } = require('apollo-datasource')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb')

// using aws-sdk v3 instead of v2
// cribbed heavily from original implementation in
// https://github.com/cmwhited/apollo-datasource-dynamodb/blob/main/src/DynamoDBDataSource.ts

class DynamoDBDataSource extends DataSource {
  constructor(tableName, tableKeySchema, config) {
    super()

    this.tableName = tableName
    this.tableKeySchema = tableKeySchema

    // need @aws-sdk v3 client because of XMLHttpRequest
    const client = new DynamoDBClient(config)
    this.client = DynamoDBDocumentClient.from(client)
  }

  async getItem(getItemInput) {
    const command = new GetCommand({
      TableName: this.tableName,
      ConsistentRead: true,
      ...getItemInput,
    })

    const result = await this.client.send(command)

    return result.Item
  }

  async scan(scanInput) {
    const command = new ScanCommand({
      TableName: this.tableName,
      ConsistentRead: true,
      ...scanInput,
    })
    const result = await this.client.send(command)

    return result.Items
  }

  async update(updateInput) {
    const command = new UpdateCommand({
      TableName: this.tableName,
      ReturnValues: 'ALL_NEW',
      ...updateInput,
    })
    const result = await this.client.send(command)
    return result.Attributes
  }
}

module.exports = { DynamoDBDataSource }
