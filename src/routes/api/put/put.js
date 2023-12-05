// src/routes/api/put/put.js
const logger = require("../../../logger");
const contentType = require('content-type');
const { Fragment } = require("../../../model/fragment");
const { createSuccessResponse, createErrorResponse } = require("../../../response");
const util = require("../../../util");

module.exports = async (req, res) => {

    // extract the id from the request
    const { id } = req.params;
    logger.debug({ id }, "received by put");
    
    // extract the type from the request
    logger.debug("Body received by put is a buffer:", Buffer.isBuffer(req.body));
    const { type } = contentType.parse(req.get('Content-Type'));

    let fragment;
    
    // try to get the fragment by id
    try {
        fragment = await Fragment.byId(req.user, id);

    } catch (error) {
        logger.info('Fragment not found');

        const response = createErrorResponse(404, 'Fragment not found');
        return res.status(response.error.code).send(response);
    }

    // check if the type is supported
    if (contentType.parse(fragment.type) != type) {
        logger.info('Tried to change the type of a fragment');
        
        const response = createErrorResponse(415, `A fragment's type can not be changed after it is created`);
        
        return res.status(response.error.code).json(response);
    }

    try {
        // check if the body is correct and the type passed is supported
        if (Buffer.isBuffer(req.body) && Fragment.isSupportedType(type)) {
            
            // update the fragment data
            await fragment.setData(req.body);
            logger.info({ id }, "updated");

            // update the fragment metadata
            await fragment.save();
            util.setHeader(req, res, fragment, "application/json");

            const obj = { fragment: fragment, formats: [contentType.parse(fragment)] };
            const response = createSuccessResponse(obj);

            return res.status(200).json(response);
        } else {
            const response = createErrorResponse(415, 'Unsupported type');
            return res.status(response.error.code).json(response);
        }

    } catch (error) {
        logger.error(error);
        const response = createErrorResponse(400, error.message);
        return res.status(response.error.code).json(response);
    }
}