const AWS = require('aws-sdk');
const { SQS } = require('aws-sdk');
const assert = require('assert');
const _ = require('lodash');
const createError = require('http-errors');
const config = require('config');

async function create(event, context) {
  try {
    const { configuration, databaseName } = config.get('dependencies.dynamoDb');
    const { url } = config.get('dependencies.sqs');

    AWS.config.update(configuration);
    const DocumentClient = new AWS.DynamoDB.DocumentClient();

    const request = JSON.parse(event.body);
    assert(request.firstName, createError.BadRequest());
    assert(request.lastName, createError.BadRequest());
    assert(request.addressStreet, createError.BadRequest());
    assert(request.addressNumber, createError.BadRequest());
    assert(request.cuit, createError.BadRequest());

    request.status = 'pending';

    try {
      await DocumentClient.put({
        TableName: databaseName,
        Item: request,
        ConditionExpression: "attribute_not_exists(cuit)"
      }).promise();
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        return {
          statusCode: 203,
          body: JSON.stringify({
            response: 'existing taxpayer'
          })
        }
      }

      throw createError.BadGateway(error.message)
    };

    const payerToValidate = {
      MessageBody: JSON.stringify(request.cuit),
      QueueUrl: url
    }

    const sqs = new SQS();
    const { MessageId } = await sqs.sendMessage(payerToValidate).promise();
    if (!MessageId) {
      throw createError.Conflict('message not inserted in SQS')
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        response: 'Successfully created taxpayer!'
      })
    }
  } catch (error) {

    return {
      statusCode: error.status || error.statusCode || 500,
      body: JSON.stringify({
        response: error.message
      })
    }
  }
}

module.exports = { create }