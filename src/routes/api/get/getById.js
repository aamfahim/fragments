// src/routes/api/get/getById.js

const logger = require("../../../logger");
const { Fragment } = require("../../../model/fragment");
const util = require("../../../util");
const { createErrorResponse } = require("../../../response");
const md = require('markdown-it')();


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

        // if no extension is provided
        if (!ext) {
            logger.info('no ext response type');

            if (fragment.isText) {  // and if the fragment is text
                return res.status(200).send(data);
            }
            else if (fragment.mimeType == "application/json") { // and if the fragment is json
                const JsonData = JSON.parse(data);
                return res.status(200).json(JsonData);
            }
            // else if (fragment.mimeType.startsWith("image/")) { // and if the fragment is image
            //     //TODO: make adjustments for image
            //     return res.status(200).send(data);
            // }
        }
        // if the extension is supported
        else if (fragment.formats.includes(ext)) {
            logger.info(fragment.formats.includes(ext), 'ext support');

            // make conversion

            // if text no conversion
            if (fragment.mimeType == "text/plain") {
                logger.info('text/plain extension requested');
                return res.status(200).send(data);
            }

            // if html convert to text, html
            if (fragment.mimeType == "text/html") {
                logger.info('text/html extension requested');

                if (ext == "txt") {
                    util.setHeader(req, res, fragment, "text/plain");
                }
                else if (ext == "html") {
                    util.setHeader(req, res, fragment);
                }
                return res.status(200).send(data);
            }

            // if json convert to json, text
            if (fragment.mimeType == "application/json") {
                logger.info('application/json extension requested');

                if (ext == "json") {
                    const JsonData = JSON.parse(data);
                    return res.status(200).json(JsonData);
                }
                else if (ext == "txt") {
                    const JsonData = JSON.parse(data);
                    util.setHeader(req, res, fragment, "text/plain");
                    return res.status(200).json(JsonData);
                }
            }

            // if md convert to text, html, md
            if (fragment.mimeType == "text/markdown") {
                logger.info('text/markdown extension requested');

                if (ext == "txt") {
                    util.setHeader(req, res, fragment, "text/plain");
                    return res.status(200).send(data);

                }
                else if (ext == "html") {
                    util.setHeader(req, res, fragment, "text/html");
                    const result = md.render(data); // convert to html
                    return res.status(200).send(result);
                }
                else if (ext == "md") {
                    util.setHeader(req, res, fragment);
                    return res.status(200).send(data);
                }
            }
            // send appropriate response

        }
        else {
            logger.info('unsupported extension requested');
            
            const response = createErrorResponse(415, 'Unsupported media type or conversion not possible');
            return res.status(response.error.code).send(response);
        }
    } catch (error) {
        logger.error(error);
        const response = createErrorResponse(400, error.message);
        return res.status(response.error.code).json(response);
    }
};

