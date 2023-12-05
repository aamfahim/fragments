// src/routes/api/put/index.js

const Express = require('express');

// Create a router on which to mount our API endpoints
const router = Express.Router();

// import the defined functions
const put = require("./put");

/**
 * put /v1/fragments/
 * update a Fragment object with matching id and owner id for the user defined in the request with buffer from body
 */
router.put("/:id", put);

// Other routes will go here later on...

module.exports = router;