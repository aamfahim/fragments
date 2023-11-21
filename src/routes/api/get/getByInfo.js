// src/routes/api/get/getByInfo.js

const logger = require("../../../logger");
const { Fragment } = require("../../../model/fragment");
const util = require("../../../util");
const { createSuccessResponse, createErrorResponse } = require("../../../response");

/**
 * Get a fragment's metadata for the current user by id
 */
module.exports = async (req, res) => {
    const { id } = req.params;
    logger.debug({ id }, "received by getByInfo");

    let fragment;
    
    try {
        fragment = await Fragment.byId(req.user, id);
        
    } catch (error) {
        logger.info('unsupported extension requested');
        
        const response = createErrorResponse(404, 'Fragment not found');
        return res.status(response.error.code).send(response);
    }

    try {

        util.setHeader(req, res, fragment, "application/json");

        const obj = { fragment: fragment };
        const response = createSuccessResponse(obj);        

        logger.debug({ response }, "response from getByInfo");
        return res.status(200).json(response);

    } catch (error) {
        logger.error(error);
        const response = createErrorResponse(500, error.message);
        return res.status(response.error.code).json(response);
    }
};

