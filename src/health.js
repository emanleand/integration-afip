const AWS = require('aws-sdk');

function health(event, context) {
    return {
        body: JSON.stringify('healt ok'), 
    }
}

module.exports = { health }