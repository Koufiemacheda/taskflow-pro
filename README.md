# TaskFlow Pro v4

AWS Serverless Task Management Platform

## Architecture

Frontend:

* HTML
* CSS
* JavaScript

Backend:

* Amazon API Gateway
* AWS Lambda
* Amazon DynamoDB

Hosting:

* Amazon S3
* Amazon CloudFront

CI/CD:

* GitHub Actions

## AWS Services Used

### Amazon S3

Hosts the static website files.

### Amazon CloudFront

Provides global content delivery and caching.

### Amazon API Gateway

Exposes REST API endpoints for task operations.

### AWS Lambda

Executes serverless business logic.

### Amazon DynamoDB

Stores task data.

### IAM

Controls permissions for users, GitHub Actions, and Lambda.

### GitHub Actions

Automatically deploys code changes to AWS.

## Architecture Flow

User
→ CloudFront
→ S3 Frontend
→ API Gateway
→ Lambda
→ DynamoDB

Developer
→ GitHub
→ GitHub Actions
→ S3
→ CloudFront Invalidation

## Features

* Create Tasks
* Update Task Status
* Delete Tasks
* Dashboard Metrics
* Search & Filtering
* Serverless Architecture
* Automated CI/CD Deployment

## Project Status

Completed – Production Deployment
