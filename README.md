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
-   pip install awscli
--------------------------
	
-   npm install -g serverless
-   npm install --save-dev serverless-localstack
-   npm install --saver-dev serverless-offline
### Run serverless locally
#### Create project structure from serverless.yml
    aws configure --profile localstack
        AWS Access Key ID : test
        AWS Secret Access Key : test
        Default region name [us-east-1]:
        Default output format [json]: json

    serverless deploy --aws-profile localstack
#### Run serverless for local develop
    sls offline start
### remove deploy serverless
    serverless remove --stage dev --region us-east-1 (pending)
    serverless remove --aws-profile localstack (pending)
## Component
### Dynamo DB
[**ver referencia**](https://aws.amazon.com/es/dynamodb/)

### SQS
[**ver referencia**](https://www.serverless.com/blog/aws-lambda-sqs-serverless-integration#using-sqs-with-the-serverless-framework)

### SECRET