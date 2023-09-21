// src/routes/index.js

const express = require('express');

// modular function to create custom responses
const { createSuccessResponse } = require('../../src/response');

// version and author from package.json
const { version, author } = require('../../package.json');
// Our authentication middleware
const { authenticate } = require('../auth');

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {

  const data = {
    author,
    githubUrl: 'https://github.com/aamfahim/fragments',
    version,
  };

  const response = createSuccessResponse(data);

  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json(response);
});

module.exports = router;