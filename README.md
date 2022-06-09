# integration-afip
Repositories to consult the data of Argentine taxpayers

## Context
The project consults the tax data in a database (dynamo). if the data does not exist, the query is made against an Afip service, to finally persist the information in the DB

## Arquitecture
![imagen](./diagrams/architecture.svg)

## Component

### Dynamo DB
[**ver referencia**](https://aws.amazon.com/es/dynamodb/)

### SQS
[**ver referencia**](https://www.serverless.com/blog/aws-lambda-sqs-serverless-integration#using-sqs-with-the-serverless-framework)

### SECRET