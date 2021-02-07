# Conva

![Backend CI & CD](https://github.com/ranjanistic/conva/workflows/Backend%20CI%20&%20CD/badge.svg)
![Frontend CI & CD](https://github.com/ranjanistic/conva/workflows/Frontend%20CI%20&%20CD/badge.svg)

## Environment

### Setup

Manually create a .env file in the root of project, copy contents from [.sample.env](.sample.env), and set the values as per your development requirements.

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

### Backend Unit Testing

```bash
npm test
```

## Footnotes

- _Actions workflow is enabled for commits on main branch, therefore tests, builds and deploys are automated from this branch._

- _Actions workflow is enabled for pull requests for build and test._
