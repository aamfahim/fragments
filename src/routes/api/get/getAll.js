// src/routes/api/get/getAll.js

const util = require("../../../util");
const logger = require("../../../logger");
const { Fragment } = require("../../../model/fragment");
const { createSuccessResponse, createErrorResponse } = require("../../../response");

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {

  const expand = (req?.query?.expand == 1 ? true : false) || false;
  try {
    const data = await Fragment.byUser(req.user, expand);

    util.setHeader(req, res);
    const obj = { fragments: data };
    const response = createSuccessResponse(obj);
    return res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    const response = createErrorResponse(400, { error });
    return res.status(response.error.code).json(response);
  }
};

