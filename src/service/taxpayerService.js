const config = require('config');
const AWS = require('aws-sdk');
const createError = require('http-errors');
const { configuration, databaseName } = config.get('dependencies.dynamoDb');

const getTaxpayerService = async (cuitToSearch) => {

  const params = {
    TableName: databaseName,
    KeyConditionExpression: '#cuit = :cuit',
    ExpressionAttributeNames: {
      '#cuit': 'cuit'
    },
    ExpressionAttributeValues: {
      ':cuit': cuitToSearch
    }
  };

  const DocumentClient = new AWS.DynamoDB.DocumentClient(
    AWS.config.update(configuration)
  );

  const taxpayer = await DocumentClient.query(params).promise();

  return taxpayer;
}

const createTaxpayerService = async (newTaxpayer) => {
  try {
    const DocumentClient = new AWS.DynamoDB.DocumentClient(
      AWS.config.update(configuration)
    );

    await DocumentClient.put({
      TableName: databaseName,
      Item: newTaxpayer,
      ConditionExpression: "attribute_not_exists(cuit)"
    }).promise();

  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      throw createError.Conflict('existing taxpayer');
    }

    throw createError.BadGateway(error.message)
  }
}

const updateTaxpayerService = async (taxpayer, cuit) => {

  const { status } = taxpayer;

  const DocumentClient = new AWS.DynamoDB.DocumentClient(
    AWS.config.update(configuration)
  );

  const updateTaxpayer = queryForUpdateTaxpayer({ status }, databaseName, cuit);
  await DocumentClient.update(updateTaxpayer).promise();

}

const queryForUpdateTaxpayer = (fieldsToEdit, tableName, cuit) => {
  let exp = {
    TableName: tableName,
    Key: { cuit },
    UpdateExpression: 'set',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {}
  }
  Object.entries(fieldsToEdit).forEach(([key, item]) => {
    exp.UpdateExpression += ` #${key} = :${key},`;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = item
  });

  exp.UpdateExpression = exp.UpdateExpression.slice(0, exp.UpdateExpression.length - 1);

  return exp
}

module.exports = { getTaxpayerService, createTaxpayerService, updateTaxpayerService };