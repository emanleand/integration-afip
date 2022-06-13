const AWS = require('aws-sdk');
const assert = require('assert');
const _ = require('lodash');
const createError = require('http-errors');

async function get(event, context) {
  try {
    AWS.config.update({
      "endpoint": "http://localhost:4566",
      "accessKeyId": "fake-access-key",
      "secretAccessKey": "fake-secret-key"
    });

    const cuit = event.pathParameters.cuit;

    const DocumentClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: 'taxpayer',
      KeyConditionExpression: '#cuit = :cuit',
      ExpressionAttributeNames: {
        '#cuit': 'cuit'
      },
      ExpressionAttributeValues: {
        ':cuit': cuit
      }
    };

    const taxpayer = await DocumentClient.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(taxpayer)
    }
  } catch (error) {
    return {
      statusCode: error.status,
      body: JSON.stringify(error.message)
    }
  }
}

module.exports = { get }