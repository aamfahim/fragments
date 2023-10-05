// src/routes/api/get/getById.js

const logger = require("../../../logger");
const { Fragment } = require("../../../model/fragment");
const util = require("../../../util");
const { createSuccessResponse, createErrorResponse } = require("../../../response");

/**
 * Get a list of fragments for the current user by id
 */
module.exports = async (req, res) => {
    const { id, ext } = req.params;

    try {
        const fragment = await Fragment.byId(req.user, id);

        if (!ext) {
            // no extension given, send the fragment
            util.setHeader(req, res, fragment);

            const response = createSuccessResponse(fragment);
            return res.status(200).json(response);
        }
        else if (ext == "txt" && fragment.mimeType == "text/plain") {
            // Check if an extension is provided and it is text/plain
            util.setHeader(req, res, fragment);

            const response = createSuccessResponse(fragment);
            return res.status(200).json(response);

        } else {
            const response = createErrorResponse(415, 'Unsupported media type or conversion not possible');
            return  res.status(response.error.code).send(response);
        }
    } catch (error) {
        logger.error( error );
        const response = createErrorResponse(400, { error });
        return res.status(response.error.code).json(response);
    }
};

