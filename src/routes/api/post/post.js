// src/routes/api/post/post.js

const logger = require("../../../logger");
const contentType = require('content-type');
const { Fragment } = require("../../../model/fragment");
const { createSuccessResponse, createErrorResponse } = require("../../../response");
const util = require("../../../util");


module.exports = async (req, res) => {

    logger.debug("Body received by post is a buffer:", Buffer.isBuffer(req.body));
    const { type } = contentType.parse(req.get('Content-Type'));
    try {
        if (Buffer.isBuffer(req.body) && Fragment.isSupportedType(type)) {
            const newFragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type')});

            logger.info({ newFragment }, 'created');

            await newFragment.setData(req.body);
            util.setHeader(req, res, newFragment, "application/json");

            const response = createSuccessResponse(newFragment);

            return res.status(201).json(response);
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
