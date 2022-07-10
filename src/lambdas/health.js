const AWS = require('aws-sdk');

async function health(event, context) {
    return {
        body: JSON.stringify('health ok'), 
    }
}

module.exports = { health }