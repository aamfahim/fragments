const logger = require("../../../logger");
const { Fragment } = require("../../../model/fragment");
const { createSuccessResponse, createErrorResponse } = require("../../../response");
const util = require("../../../util");


module.exports = async (req, res) => {

    try {
        const newFragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type'), size: req.body.byteLength });
        
        logger.info({ newFragment }, 'created');
        
        await newFragment.setData(req.body);
        util.setHeader(req, res, newFragment);

        const response = createSuccessResponse(newFragment);

        res.status(200).json(response);

    } catch (error) {
        logger.error(error);
        const response = createErrorResponse(400, { error });
        res.status(response.error.code).json(response);
    }

}
