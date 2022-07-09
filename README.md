# Integration-afip (in PROGRESS)
Project to manage taxpayer records in our application
# Content
- [Challenges](#challenges).
- [Arquitecture](#arquitecture).
- [AFIP](#afip).
# Challenges
Work the project using a serverless structure

Carry out an integration with afip services
# Arquitecture
![imagen](./diagrams/architecture.svg)

# AFIP
The administrative process to obtain the productive credentials to the ws_sr_constancia_inscripcion web service is detailed below.
## Previous Configuration
### 1 - Generar Certificado Digital (spanish)
    
- Ir administración de certificados digitales y seleccionar el contribuyente que va a operar el servicio.
- Agregar un alias para identificar el certificado
- Subir un certificado.csr [[Como generar un certificado .csr]](#scr-certificate).
- Finalmente se habilitara la opciòn para descargar el archivo .crt
### 2 - Vincular Certificado Digital a un Web Service (spanish)
-  Ir Administración de relaciones de Clave Fiscal
    -  Servicio
        -  Nueva Relación
        -  Buscar Servicio
        -  AFIP / Web Service / Consulta de constancia de inscripción
    -  Representante
        -  Seleccionar representante
    -  Computador Fiscal
        -  Seleccionar alias (creado en apartado **Generar Certificado Digital**)

### 3 - Generar un CMS (spanish)
El certificado CMS permite obtener los credenciales para posteriormente realizar las consultas a los Web Services de AFIP
- Generar una solicitud de Ticket de Acceso
- Generar certificado CMS con openssl
    
    - ``` openssl cms -sign -in accessTicketRequest.xml -out certificate-cms.xml.cms -signer certificate.crt -inkey private.key -nodetach ```

[[Certificado accessTicketRequest.xml]](#scr-certificate)
#### Scr Certificate
To generate a csr certificate, the following steps must be followed:
- Install http://www.openssl.org
- Generate a private key:
    - ``` openssl genrsa -out private.key 2048 ```
- Generate a csr certificate:
    - ``` openssl req -new -key privada -subj "/C=AR/O=subj_o/CN=subj_cn/serialNumber=CUIT subj_cuit" -out filename.csr ```
    -  Where
        -  subj_o : company name.
        -  subj_cn : personal name or server hostname.
        -  subj_cuit : CUIT of the company or programmer(no hyphens).
    - example ``` openssl req -new -key private.key -subj "/C=AR/O=leandro/CN=leandro/serialNumber=CUIT miCuit" -out certificateRequest.csr ```

#### accessTicketRequest.xml format.
```JAVA
<?xml version="1.0" encoding="UTF8"?>
<loginTicketRequest version="1.0">
	<header>
		<uniqueId>4325399</uniqueId>
		<generationTime>2022-07-09T00:00:00</generationTime>
		<expirationTime>2022-07-09T23:59:59</expirationTime>
	</header>
	<service>ws_sr_constancia_inscripcion</service>
</loginTicketRequest>
```
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