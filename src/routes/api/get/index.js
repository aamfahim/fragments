// src/routes/api/get/index.js

const Express = require('express');

// Create a router on which to mount our API endpoints
const router = Express.Router();

// import the defined functions
const getAll = require("./getAll");
const getById = require("./getById");

/**
 * Define our first route, which will be: 
 * GET /v1/fragments
 * Will get all the fragments from the user defined in the request
*/
router.get("/", getAll);

/**
 * GET /v1/fragments/:id.:ext?
 * Will get Fragment by id from the user defined in the request
 * Optional ext for id to get fragments by ext
 */
router.get("/:id.:ext?", getById); 

// Other routes will go here later on...


module.exports = router;