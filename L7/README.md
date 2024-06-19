# Dockerizing and Deploying a Node.js Application with CICD Pipeline

## Dockerization:

### Dockerfile

```Dockerfile
FROM --platform=$BUILDPLATFORM node:lts-alpine as base
WORKDIR /app
COPY package.json /
EXPOSE 3000

FROM base as development
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /app
CMD npm run start

FROM base as production
ENV NODE_ENV=production
RUN npm install
COPY . /app
CMD node index.js
```

## Environment Variables

1. `NODE_ENV`: This environment variable is used to set the environment of the application. It can be set to either `development` or `production`.
2. `DEV_DB_USER`: This environment variable is used to set the username of the development database.
3. `DEV_DB_PASSWORD`: This environment variable is used to set the password of the development database.
4. `DEV_DB_NAME`: This environment variable is used to set the name of the development database.
5. `PROD_DB_USER`: This environment variable is used to set the username of the production database.
6. `PROD_DB_PASSWORD`: This environment variable is used to set the password of the production database.
7. `PROD_DB_NAME`: This environment variable is used to set the name of the production database.

[Video Link](https://www.loom.com/share/06966c93b2ee4de59c5d6b037775c7a9?sid=f84673ec-e17a-443f-889b-781a42c92d25)

## Docker Compose for Multiple Services:

### docker-compose.yml

```yaml 
version: "3.8"
services:
  app:
    build:
      context: .
      target: development
    image: todo-app:development
    volumes:
      - .:/app
    ports:
      - 3000:3000
    env_file:
      - .env
    depends_on:
      - db

  db:
    image: postgres:16
    volumes:
      - pg-dev-data:/var/lib/postgresql/data
    env_file:
      - .env
    environment:
      POSTGRES_USER: $DEV_DB_USER
      POSTGRES_DB: $DEV_DB
      POSTGRES_PASSWORD: $DEV_DB_PASSWORD

volumes:
  pg-dev-data:
```

This Docker Compose configuration file (`docker-compose.yml`) sets up a development environment for a Todo application using Docker containers. Below is a breakdown of its components:

### Services

#### `app`
- **Build Configuration**: Builds the application using Dockerfile defined in the current context (`.`) with the target set to `development`.
- **Image**: Specifies the name of the image for the application as `todo-app:development`.
- **Volumes**: Mounts the current directory (`.`) to `/app` directory inside the container to facilitate live code reloading during development.
- **Ports**: Maps port 3000 on the host to port 3000 on the container, allowing access to the application.
- **Environment File**: Loads environment variables from `.env` file.
- **Dependencies**: Depends on the `db` service.

#### `db`
- **Image**: Uses the `postgres:16` image to run the PostgreSQL database.
- **Volumes**: Mounts a named volume `pg-dev-data` to persist database data.
- **Environment Variables**:
  - `POSTGRES_USER`: Sets the PostgreSQL username to the value specified in `$DEV_DB_USER`.
  - `POSTGRES_DB`: Sets the name of the PostgreSQL database to the value specified in `$DEV_DB`.
  - `POSTGRES_PASSWORD`: Sets the password for the PostgreSQL user to the value specified in `$DEV_DB_PASSWORD`.
- **Environment File**: Loads environment variables from `.env`.

#### Volumes
- **pg-dev-data**: Named volume used by the `db` service to persist PostgreSQL database data.

## Continuous Integration (CI)

### main.yml

```yaml 
name: CI/CD

# Triggers the workflow on every push event
on:
  push:

# Environment variables
env:
  PG_DATABASE: ${{ secrets.POSTGRES_DATABASE }}
  PG_USER: ${{ secrets.POSTGRES_USER }}
  PG_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}

# Jobs
jobs:
  # Job to run tests
  run-tests:
    # Runs on Ubuntu latest version
    runs-on: ubuntu-latest

    # Define a PostgreSQL service for running tests
    services:
      postgres:
        image: postgres:11.7
        env:
          POSTGRES_USER: "postgres"
          POSTGRES_PASSWORD: "postgres"
          POSTGRES_DB: "wd-todo-test"
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    # Steps to execute within the job
    steps:
      # Check out repository code
      - name: Check out repository code
        uses: actions/checkout@v3

      # Install dependencies
      - name: Install dependencies
        run: npm ci

      # Run unit tests
      - name: Run unit tests
        run: npm test

      # Run the app in test environment
      - name: Run the app (test environment)
        run: |
          npx sequelize-cli db:drop --env=test
          npx sequelize-cli db:create --env=test
          npx sequelize-cli db:migrate --env=test
          PORT=3000 NODE_ENV=test npm start &
          sleep 5

      # Run integration tests
      - name: Run integration tests
        run: |
          npm install cypress cypress-json-results
          npx cypress run

  build-and-push:
    runs-on: ubuntu-latest
    needs: run-tests
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          # Docker Hub username
          username: ${{ secrets.DOCKER_USERNAME }}
          # Docker Hub password
          password: ${{ secrets.DOCKER_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          # Push the image with the latest tag
          tags: ${{ secrets.DOCKER_USERNAME }}/todo:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: needs.build-and-push.result == 'success'
    steps:
      # Deploy to production using a custom action
      - name: Deploy to production
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.MY_RENDER_SERVICE_ID }}
          api-key: ${{ secrets.MY_RENDER_API_KEY }}

  # Job to send Slack notifications
  notify:
    # Define the job dependencies
    needs: [run-tests, deploy]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Send Slack notification on success
        # Send a Slack notification if the tests and deployment are successful
        if: needs.run-tests.result == 'success' && needs.deploy.result == 'success'
        uses: slackapi/slack-github-action@v1.25.0
        with:
          payload: |
            {
              "text": "CI/CD process succeeded!" 
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

      - name: Send Slack notification on failure
        if: needs.run-tests.result != 'success' || needs.deploy.result != 'success'
        uses: slackapi/slack-github-action@v1.25.0
        with:
          payload: |
            {
              "text": "*${{ github.workflow }}* failed. Access the details https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}."
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

```




The CI workflow is triggered on every push to the repository. It consists of the following steps:

### 1. run-tests

- **Description:** This job runs unit tests and integration tests for the Todo application.
- **Services:** Sets up a PostgreSQL database for testing purposes.
- **Steps:**
  1. Check out repository code.
  2. Install dependencies using `npm ci`.
  3. Run unit tests using `npm test`.
  4. Set up the test environment by dropping and creating the test database, migrating database schema, and starting the application in test mode.
  5. Run integration tests using Cypress.

### 2. build-and-push

- **Description:** This job builds the Docker image of the Todo application and pushes it to Docker Hub.
- **Dependencies:** Depends on the successful completion of the `run-tests` job.
- **Steps:**
  1. Checkout code.
  2. Log in to Docker Hub using Docker credentials.
  3. Set up Docker Buildx for multi-platform builds.
  4. Build and push Docker image tagged as `latest`.

## Continuous Deployment (CD)

The CD workflow deploys the Todo application to production when changes are pushed to the repository, and the build-and-push job is successful.

### 1. deploy

- **Description:** Deploys the Docker image to a production environment.
- **Dependencies:** Depends on the successful completion of the `build-and-push` job.
- **Steps:**
  1. Deploy to production environment using Render deploy action.

## Notifications

The notification workflow sends Slack notifications based on the success or failure of the CI/CD process.

### 1. notify

- **Description:** Sends Slack notifications based on the outcome of CI/CD process.
- **Dependencies:** Depends on the completion of both `run-tests` and `deploy` jobs.
- **Steps:**
  1. Sends a success notification to Slack if both tests and deployment are successful.
  2. Sends a failure notification to Slack if either tests or deployment fails.

## Secrets

Ensure the following secrets are added to the repository for the workflow to function properly:
- `POSTGRES_DATABASE`, `POSTGRES_USER`, `POSTGRES_PASSWORD`: PostgreSQL database credentials for testing.
- `DOCKER_USERNAME`, `DOCKER_TOKEN`: Docker Hub credentials for pushing Docker images.
- `MY_RENDER_SERVICE_ID`, `MY_RENDER_API_KEY`: Render service and API key for deployment.
- `SLACK_WEBHOOK_URL`: Slack webhook URL for notifications.


 *Video Demonstration* [*Link*](https://www.loom.com/share/06966c93b2ee4de59c5d6b037775c7a9?sid=f84673ec-e17a-443f-889b-781a42c92d25)
