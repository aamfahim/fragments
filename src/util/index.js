const logger = require("../logger");

module.exports.setHeader = (req, res, fragment) => {
    logger.info('modifying req and res in setHeader');
    const baseUrl = 'http://' + req.headers.host + '/v1/fragments/';
    res.setHeader('Access-Control-Expose-Headers', 'Location');
    if (fragment) {
        res.setHeader('Location', baseUrl + fragment.id);
        res.setHeader('Content-Type', fragment.mimeType);
    } else {
        res.setHeader('Location', baseUrl);

    }
}