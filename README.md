# Sales_Tracking
comprehensive sales tracking system that enables sales agents to record sales, calculate commissions, and receive email notifications containing statements of their sales within a requested period.

## Dependencies
To install and run the application locally, make sure to have the following dependencies:

1. [Docker](https://www.docker.com/) ~25.0.3
2. Register an API key with Mailchimp.

## Installation

Make sure docker is up and running. Go to your command line and execute the following instructions:
1. `$ git clone https://github.com/JayKay24/Sales_Tracking.git`
2. `$ cd Sales_Tracking`
3. Create an `.env` with the following keys:
  ```
  JOBS_CONN_STR_LOCAL="mongodb://sales_database:27017/inc_olap"
  DB_PASSWORD="<ANY PASSWORD WILL DO>"
  CONN_STR_LOCAL="mongodb://server_oltp_database:27017/inc_oltp"
  JWT_SECRET="<YOUR JWT SECRET>"
  NODE_ENV="development"
  JWT_EXPIRY="1d"
  BROKER_URL="amqp://rabbitmq_broker:5672"
  MAILCHIMP_API_KEY="<YOUR MAILCHIMP_API_KEY>"
  FROM_EMAIL="<YOUR email sending domain e.g bruce@yourdomain.com>"
  ```
4. `$ docker-compose up`

To shut down the application, run `docker-compose down` in the root directory of the project.

## Postman collection
A postman collection is included at [this](./docs/postman/Sales%20Tracking%20System.postman_collection.json) location. Import it into your postman client and view the endpoints and docs.
Alternatively, with the application running, visit `http://localhost:4000/api/v1/docs` to view the OpenAPI spec for this application.

## Architecture

The application uses a microservices arechitecture and splits the workload into two categories:

1. OLTP(Server/API) - These are the day to day transactional requests that the users will make to the application e.g registration, buying a product etc.
2. OLAP(Jobs) - These are the background jobs required to fulfill application requirments that will require long-running calculations e.g calculating agent
  commissions and unpaid commissions within a given date range, sending emails to agents etc. Will also run cron jobs at specific intervals to send emails.

Also, this repository is structured as a [monorepo](https://lerna.js.org/) to run tests in parallel and to keep all services under one repository.

### Diagrams
#### Backend
![Backend](./docs/diagrams/backend_architecture.png)

#### Entity relationship diagram across all services
![ER](./docs/diagrams/ER_diagram.png)

## Testing
To run the tests locally, navigate to the root directoy and run `npx lerna run test`.

## Items remaining
1. Hosting
2. Increasing test coverage