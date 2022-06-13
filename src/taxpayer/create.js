const AWS = require('aws-sdk');
const assert = require('assert');
const _ = require('lodash');
const createError = require('http-errors');

async function create(event, context) {
  try {
    AWS.config.update({
      "endpoint": "http://localhost:4566",
      "accessKeyId": "fake-access-key",
      "secretAccessKey": "fake-secret-key"
    });
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