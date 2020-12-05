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

## Getting started

The app is packaged in a Docker container can be run with:

```shell
# Select port required and bring up app service
SERVER_PORT=4000 docker-compose up
```
