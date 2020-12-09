# ![RealWorld Example App](logo.png)

> ## Typescript codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API

### [Demo](https://github.com/gothinkster/realworld)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

The [RealWorld](https://github.com/gothinkster/realworld) examples project provides a front end and
back end spec to be implemented in many different languages and technologies that allows you to
create a [Conduit](https://demo.realworld.io/) clone.

This project will follow the [RealWorld backend API spec](https://github.com/gothinkster/realworld/tree/master/api),
making it compatible with any of the [RealWorld front end implementations](https://github.com/gothinkster/realworld#frontends).


This codebase was created to demonstrate a fully fledged fullstack application built with Typescript and Express including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the Typescript community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

## How it works

This implementation uses Typescript, Node, Express, PostgreSQL, and Docker.

The app is packaged with Docker and can be run with docker compose.

### Server configuration

A number of configuration environment variables are used to configure the app.

| Variable name    | Description                                 | Required for app | Example            |
| ---------------- | ------------------------------------------- | ---------------- |
| APP_PORT         | Port to expose the app on                   | Yes              | 4000               |
| JWT_SECRET       | Secret to use for signing JWT auth tokens   | Yes              | arandomstring      |
| DB_USERNAME      | Username to be used for postgreSQL database | Yes              | postgres           |
| DB_PASSWORD      | Password to be used for postgreSQL database | Yes              | postgres           |
| DB_NAME          | Name to be used for postgreSQL database     | Yes              | postgres           |
| DB_PORT          | Port to expose the database on              | Yes              | 5432               |
| PGADMIN_EMAIL    | Pgadmin4 database admin login email         | No               | myemail@domain.com |
| PGADMIN_PASSWORD | Pgadmin4 database admin login password      | No               | supersecret        |
| PGADMIN_PORT     | Port to expose the Pgadmin4 on              | No               | 443                |

## Getting started

The app can be run standalone with Node.js, or the whole stack can be run using Docker.

### Run the stack

#### Dependencies

First of all, make sure you have Docker and Docker Compose installed.
Installation instructions can be found at:

* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

If installing for the first time, make sure to check successful installation with:

```shell
$ docker -v
Docker version 19.03.13, build 4484c46d9d

$ docker-compose -v
docker-compose version 1.27.4, build 40524192
```

(_Your versions may vary_)

#### Build and run

To build the app Docker container run:

```shell
docker-compose up
```

The first step is to build the app's Docker image:

```shell
docker-compose build
```

Before running the app a number of environment variables must be set.
See [Server configuration](#server-configuration) section for more info.

Once these are set you can run the app, database, and database admin page with:

```shell
docker-compose up
```

For those running Linux, a convenience script [run-services.sh](scripts/run-services.sh) is provided to simplify this and save some typing.
You can edit the environment variables at the top of the script, and bring everything up with:

```shell
./scripts/run-services.sh
```

### Run just the app

To run the app on it's own you can use Node.js.
Ensure this is installed before continuing.

Install dependencies:

```shell
npm install
```

Run the app:

```shell
npm start
```
> Note: You will need to manually set the [environment variables](#server-configuration) before running this.

Run the tests:

```shell
npm test
```

>Note: The test suite uses a separate set of environment variables, which can
be set in [test_env.sh](test_env.sh).