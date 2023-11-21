// src/routes/api/delete/index.js

const Express = require('express');

// Create a router on which to mount our API endpoints
const router = Express.Router();

// import the defined functions
const _delete = require("./delete");

/**
 * delete /v1/fragments/
 * delete a Fragment object
 */
router.delete("/:id", _delete);

// Other routes will go here later on...

module.exports = router;