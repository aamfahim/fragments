// src/routes/api/get/index.js

const Express = require('express');

// Create a router on which to mount our API endpoints
const router = Express.Router();

// import the defined functions
const getAll = require("./getAll");
const getById = require("./getById");
const getByInfo = require("./getByInfo");

/**
 * Define our first route, which will be: 
 * GET /v1/fragments
 * GET /v1/fragments/?expand=1
 * Will get all the fragments from the user defined in the request
 * Can get expanded version of all fragments with query
*/
router.get("/", getAll);

/**
 * GET /v1/fragments/:id.:ext?
 * Will get Fragment by id from the user defined in the request
 * Optional ext for id to get fragments by ext
 */
router.get("/:id.:ext?", getById); 

/**
 * GET /v1/fragments/:id.:ext?
 * Will get Fragment fragment metadata by id from the user defined in the request
 */
router.get("/:id/info", getByInfo); 
// Other routes will go here later on...


module.exports = router;