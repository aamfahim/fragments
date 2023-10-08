const logger = require("../logger");

module.exports.setHeader = (req, res, fragment) => {
    logger.info('modifying response header in setHeader');

    logger.debug(res.headers, "before set");

    let baseUrl;

    if (req.headers.host) {
        baseUrl = 'http://' + req.headers.host + '/v1/fragments/'; // create base url from req.headers        
    }
    else {
        baseUrl = process.env.API_URL + '/v1/fragments/'; // create base url from .env      
    }

    res.setHeader('Access-Control-Expose-Headers', 'Location'); // add Location to Access-Control-Expose-Headers

    if (fragment) {
        res.setHeader('Location', baseUrl + fragment.id); // if fragment provided set location with fragment id
        res.setHeader('Content-Type', fragment.mimeType); // also set the content type according to fragment's
    } else {
        res.setHeader('Location', baseUrl); // just set the default url
    }

    logger.debug(res.headers, "after set");

}