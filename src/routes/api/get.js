// src/routes/api/get.js

const { createSuccessResponse } = require("../../response");

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  const data = { fragments: [] };
  const response = createSuccessResponse(data);
  // TODO: this is just a placeholder to get something working...
  res.status(200).json(response);
};