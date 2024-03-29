// src/routes/api/delete/delete.js

const logger = require("../../../logger");
const { Fragment } = require("../../../model/fragment");
const { createSuccessResponse, createErrorResponse } = require("../../../response");

/**
 * delete a fragment for the current user by id
 */
module.exports = async (req, res) => {
    const { id } = req.params;
    logger.debug({ id }, "received by delete");

    try {
         await Fragment.byId(req.user, id);
        
    } catch (error) {
        logger.info('Fragment not found');
        
        const response = createErrorResponse(404, 'Fragment not found');
        return res.status(response.error.code).send(response);
    }

    try {
        await Fragment.delete(req.user, id);
        
        logger.info({ id }, "deleted");
        
        const response = createSuccessResponse();

        return res.status(200).json(response);

    } catch (error) {
        logger.error(error);
        const response = createErrorResponse(500, error.message);
        return res.status(response.error.code).json(response);
    }
};

