// src/response.js

const logger = require("./logger");

/**
 * A successful response looks like:
 *
 * {
 *   "status": "ok",
 *   ...
 * }
 */
module.exports.createSuccessResponse = function (data) {
    logger.info({data}, `passed to createSuccessResponse`);
    return {
        "status": 'ok',
        // Use the spread operator to clone `data` into our object, see:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals
        ...data
    };
};

/**
 * An error response looks like:
 *
 * {
 *   "status": "error",
 *   "error": {
 *     "code": 400,
 *     "message": "invalid request, missing ...",
 *   }
 * }
 */
module.exports.createErrorResponse = function (code, message) {
    logger.info({code, message} ,`passed to createErrorResponse`);
    return {
        "status": "error",
        "error": {
            "code": code,
            "message": message
        }
    }
};