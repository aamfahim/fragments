# Fragments

### Libraries used

- [`Node.js`](https://nodejs.org/en) - JavaScript runtime environment
- [`Curl`](https://curl.se/) - Command line tool and library for transferring data with URLs
- [`Pino`](https://getpino.io/#/) - Very low overhead Node.js logger.
  - `Pino-http` - Pino-http is a middleware for HTTP frameworks like Express.jsm that integrates Pino with web applications.
  - `Pino-pretty` - basic prettifier to make log lines human-readable.
- [`Helmet.js`](https://helmetjs.github.io/) - Helmet helps secure Express apps by setting HTTP response headers
- [`Stoppable`](https://www.npmjs.com/package/stoppable) - Stoppable stops accepting new connections and closes existing, idle connections (including keep-alives) without killing requests that are in-flight
- [`Jq`](https://jqlang.github.io/jq/) - The jq utility is a powerful way to format and query JSON data

### Terminal Commands Used

- npm init -y
- npm install --save-dev --save-exact prettier
- npm install --save-dev eslint
- npm install --save pino pino-pretty pino-http
- npm install --save express cors helmet compression
- npm install --save stoppable
- npm install --save-dev nodemon

### Scripts available

| Script        | Use                                                                    |
|---------------|------------------------------------------------------------------------|
| npm run lint  | Run eslint and make sure there are no errors that need to be fixed     |
| npm start     | Start the application with node                                        |
| npm run dev   | Start the application in dev mode using nodemon with log level debug   |
| npm run debug | Start the application in debug mode using nodemon with log level debug |
