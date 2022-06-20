const AWS = require('aws-sdk');
const assert = require('assert');
const _ = require('lodash');
const createError = require('http-errors');
const config = require('config');

async function get(event, context) {
  try {
    const { configuration, databaseName } = config.get('dependencies.dynamoDb');
    AWS.config.update(configuration);

    const cuit = event.pathParameters.cuit;

    const DocumentClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: databaseName,
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