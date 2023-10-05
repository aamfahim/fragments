const logger = require("../../../logger");
const { Fragment } = require("../../../model/fragment");
const { createSuccessResponse, createErrorResponse } = require("../../../response");
const util = require("../../../util");


module.exports = async (req, res) => {

    try {
        if (Buffer.isBuffer(req.body)) {
            const newFragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type'), size: req.body.byteLength });

            logger.info({ newFragment }, 'created');

            await newFragment.setData(req.body);
            util.setHeader(req, res, newFragment);

            const response = createSuccessResponse(newFragment);

            return res.status(201).json(response);
        } else {
            const response = createErrorResponse(415, 'Unsupported type');
            return res.status(response.error.code).json(response);
        }

    } catch (error) {
        logger.error(error);
        const response = createErrorResponse(400, error);
        return res.status(response.error.code).json(response);
    }

}
