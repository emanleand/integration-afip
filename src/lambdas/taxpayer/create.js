const AWS = require('aws-sdk');
const { SQS } = require('aws-sdk');
const assert = require('assert');
const _ = require('lodash');
const createError = require('http-errors');
const config = require('config');

const { createTaxpayerService } = require('../../service/taxpayerService');

async function create(event, context) {
  try {
    const { url } = config.get('dependencies.sqs');

    const request = JSON.parse(event.body);
    assert(request.firstName, createError.BadRequest());
    assert(request.lastName, createError.BadRequest());
    assert(request.addressStreet, createError.BadRequest());
    assert(request.addressNumber, createError.BadRequest());
    assert(request.cuit, createError.BadRequest());
    request.status = 'pending';

    await createTaxpayerService(request);

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