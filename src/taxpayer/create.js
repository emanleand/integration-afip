const AWS = require('aws-sdk');
const { SQS } = require('aws-sdk');
const assert = require('assert');
const _ = require('lodash');
const createError = require('http-errors');
const config = require('config');

async function create(event, context) {
  try {
    const { dynamoDb } = config.get('dependencies');

    AWS.config.update(dynamoDb);
    const DocumentClient = new AWS.DynamoDB.DocumentClient();

    const request = JSON.parse(event.body);
    assert(request.firstName, createError.BadRequest());
    assert(request.lastName, createError.BadRequest());
    assert(request.addressStreet, createError.BadRequest());
    assert(request.addressNumber, createError.BadRequest());
    assert(request.cuit, createError.BadRequest());

    request.status = 'pending';

    const newItem = await DocumentClient.put({
      TableName: 'taxpayer',
      Item: request
    }).promise();

    const payerToValidate = {
      MessageBody: JSON.stringify(request.cuit),
      QueueUrl: 'http://localhost:4566/sqs-queue-local'
    }

    const sqs = new SQS();
    const { MessageId } = await sqs.sendMessage(payerToValidate).promise();
    if (!MessageId) {
      throw createError.Conflict('message not inserted in SQS')
    }

    return {
      body: JSON.stringify(newItem)
    }
  } catch (error) {

    return {
      statusCode: error.status,
      body: JSON.stringify(error.message)
    }
  }
}

module.exports = { create }