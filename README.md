# Conva

![Backend CI & CD](https://github.com/ranjanistic/conva/workflows/Backend%20CI%20&%20CD/badge.svg)
![Frontend CI & CD](https://github.com/ranjanistic/conva/workflows/Frontend%20CI%20&%20CD/badge.svg)
[![Frontend Beta CI & CD](https://github.com/ranjanistic/conva/actions/workflows/client-beta.yml/badge.svg)](https://github.com/ranjanistic/conva/actions/workflows/client-beta.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

_You can use ```npm run commit``` to commit your changes in a procedural way. [See below](#contributing)._

## Environment

Before starting development, for first time setup.

### Setup

#### Automatic

```bash
npm run env
```

Follow the CLI to generate local .env file at root of project automatically.

#### Manual

Create a .env file in the root of project, copy contents from [.sample.env](.sample.env), and set the values as per your development requirements.

### Install packages

```bash
npm install -g create-react-app # global client initializer
npm install # server packages
npm run client-install # client packages
```

## Development

### Run client & server concurrently

```bash
npm run dev # client & server localhost
```

_By default, Backend at port: 5000_, _Frontend at port: 3000_

### To run only server

```bash
npm run server
```

### To run only client

```bash
npm run client
```

## Testing

### Full application auto testing

```bash
npm run full-test
```

### Backend Unit Testing

```bash
npm test
```

### Frontend Unit Testing

For automatic testing

```bash
npm run client-test:auto
```

For interactive testing

```bash
npm run client-test
```

## Contributing

```bash
npm run commit
```

Use the above command to locally run unit tests, build linting & committing changes. By doing so, you'll save the time spent by remote action workflow to run tests & builds, and you won't have to revert your commit if tests fail, as this will raise any warnings or errors that occur, before commiting your changes.

## CI & CD

- Any commits on branch:**main** trigger production build, test & deployment workflows for both front & backend, depending upon code changes.

- Any commits on branch:**beta** trigger beta build, test & deployment workflow, currently for frontend only (if backend side code changes are detected, the respective backend production deployment workflow also triggers from this branch). If you've made changes over this branch for frontend, then a temporary beta preview url will be displayed in the respective action workflow logs, valid for 15 days.

- Any pull requests to branch:**main** triggers respective workflows for build & test.

## Footnotes

- _It is highly recommended that ```npm run commit``` is used to commit your contributory changes._
- _Actions workflow is enabled for commits on main branch, therefore tests, builds and deploys are automated from this branch._

- _Actions workflow is enabled for pull requests for build and test._
