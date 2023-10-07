// src/routes/api/post/index.js

const Express = require('express');

// Create a router on which to mount our API endpoints
const router = Express.Router();

// import the defined functions
const post = require("./post");

/**
 * POST /v1/fragments/
 * Post a Fragment object for the user defined in the request with buffer from body
 */
router.post("/", post);

// Other routes will go here later on...

module.exports = router;