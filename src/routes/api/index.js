// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Use Fragment model
const { Fragment } = require('../../model/fragment');

// Get all the defined get and post routes
const get = require("./get");
const post = require("./post");
const _delete = require("./delete");
const put = require("./put");


// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
    express.raw({
        inflate: true,
        limit: '5mb',
        type: (req) => {
            // See if we can parse this content type. If we can, `req.body` will be
            // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
            // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
            try {
                const { type } = contentType.parse(req);
                return Fragment.isSupportedType(type);    
            } catch (error) {
                return false;
            }
            
            // return Fragment.isSupportedType(req.get('Content-Type'));
        },
    });



// Attach all our get routes
router.use('/fragments', get);

// Attach all our post routes
// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
// You can use Buffer.isBuffer(req.body) to test if it was parsed by the raw body parser.
router.use('/fragments', rawBody(), post);

// Attach all our delete routes
router.use('/fragments', _delete);

// Attach all our put routes
router.use('/fragments', rawBody(), put);

module.exports = router;