# integration-afip
Project to manage taxpayer records in our application
# challenges
Work the project using a serverless structure

Carry out an integration with afip services
## Arquitecture
![imagen](./diagrams/architecture.svg)

## Development Environment
### install aws locally [**ver referencia**](https://github.com/localstack/localstack)
-	pip install localstack (for install)
-	localstack start -d (for start)
-	localstack status services (for check status)



## Component
### Dynamo DB
[**ver referencia**](https://aws.amazon.com/es/dynamodb/)

### SQS
[**ver referencia**](https://www.serverless.com/blog/aws-lambda-sqs-serverless-integration#using-sqs-with-the-serverless-framework)

### SECRET