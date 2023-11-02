const logger = require("../logger");

module.exports.setHeader = (req, res, fragment, type = null) => {
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

        if (type) {
            const contentType = res.getHeader('Content-Type');
            const parts = contentType.split(';').map(part => part.trim()); // extract the media type from the content type
            const newMediaType = type; // Set your new media type here
            parts[0] = newMediaType;
            
            const newContentType = parts.join(';');
            res.setHeader('Content-Type', newContentType);
        }
    } else {
        res.setHeader('Location', baseUrl); // just set the default url
    }

    logger.debug(res.headers, "after set");

}