const AWS = require('aws-sdk');
const assert = require('assert');
const _ = require('lodash');
const createError = require('http-errors');

const { getTaxpayerService } = require('../../service/taxpayerService');

async function get(event, _) {
  try {
    assert(event.pathParameters.cuit, createError.BadRequest());

    const cuit = event.pathParameters.cuit;
    const taxpayer = await getTaxpayerService(cuit);

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