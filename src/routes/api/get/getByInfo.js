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

    try {
        const fragment = await Fragment.byId(req.user, id);

        util.setHeader(req, res, fragment);

        const response = createSuccessResponse(fragment);
        return res.status(200).json(response);

    } catch (error) {
        logger.error(error);
        const response = createErrorResponse(400, error.message);
        return res.status(response.error.code).json(response);
    }
};

