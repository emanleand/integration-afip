const AWS = require('aws-sdk');
const { SQS } = require('aws-sdk');
const assert = require('assert');
const createError = require('http-errors');
const config = require('config');

const { updateTaxpayerService } = require('../../service/taxpayerService');

async function update(event, context) {
  try {
    const request = JSON.parse(event.body);

    assert(event.pathParameters.cuit, createError.BadRequest());
    assert(request.status, createError.BadRequest());

    //integracion AFIP TODO
    await updateTaxpayerService(request, event.pathParameters.cuit);

    return {
      statusCode: 200,
      body: JSON.stringify({
        response: 'Successfully updated taxpayer!'
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

module.exports = { update };