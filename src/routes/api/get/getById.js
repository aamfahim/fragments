// src/routes/api/get/getById.js

const logger = require("../../../logger");
const { Fragment } = require("../../../model/fragment");
const util = require("../../../util");
const { createErrorResponse } = require("../../../response");

/**
 * Get a fragment for the current user by id
 */
module.exports = async (req, res) => {
    const { id, ext } = req.params;
    logger.debug({ id }, { ext }, "received by getById");

    try {
        const fragment = await Fragment.byId(req.user, id);
        const buffer = await fragment.getData();
        const data = buffer.toString();

        util.setHeader(req, res, fragment);

        if (!ext) {
            // no extension given, send the fragment
            return res.status(200).send(data);
            
        }
        // Check if an extension is provided and it is text/plain
        else if (ext == "txt" && fragment.mimeType == "text/plain") {
            return res.status(200).send(data);

        }
         else {
            const response = createErrorResponse(415, 'Unsupported media type or conversion not possible');
            return res.status(response.error.code).send(response);
        }
    } catch (error) {
        logger.error(error);
        const response = createErrorResponse(400, error.message);
        return res.status(response.error.code).json(response);
    }
};

