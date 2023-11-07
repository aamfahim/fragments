// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
// import logger
const logger = require('../../src/logger');
// Functions for working with fragment metadata/data using our DB
const {
    readFragment,
    writeFragment,
    readFragmentData,
    writeFragmentData,
    listFragments,
    deleteFragment,
} = require('./data');

class Fragment {
    // all possible values that this class can work with
    static validTypes = [
        `text/plain`,
        `text/markdown`,
        `text/html`,
        `application/json`,
        /*
         Currently, only text/plain is supported. Others will be added later.
        `image/png`,
        `image/jpeg`,
        `image/webp`,
        `image/gif`,
        */
    ];

    constructor({ id = randomUUID(), ownerId, created = new Date().toISOString(), updated = created, type, size = 0 }) {

        logger.info({ id, ownerId, created, updated, type, size }, `passed to the Fragment constructor`);

        if (!ownerId || !type) {
            logger.error({ ownerId, type }, `is missing`);
            throw new Error(`ownerId and type are missing`);
        }

        const parsedType = contentType.parse(type).type;
        if (!Fragment.validTypes.includes(parsedType)) {
            logger.error({ type }, `is invalid`);
            throw new Error(`Invalid type`);
        }

        if (typeof size !== 'number' || size < 0) {
            logger.error({ size }, `is invalid. Should be of type number and greater than 0`);
            throw new Error('Invalid size');
        }

        this.id = id;
        this.ownerId = ownerId;
        this.created = created;
        this.updated = updated;
        this.type = type;
        this.size = size;

    }

    /**
     * Get all fragments (id or full) for the given user
     * @param {string} ownerId user's hashed email
     * @param {boolean} expand whether to expand ids to full fragments
     * @returns Promise<Array<Fragment>>
     */
    static async byUser(ownerId, expand = false) {

        if (!ownerId) {
            logger.error({ ownerId }, `missing in function parameter`);
            throw new Error(`missing Owner ID`);
        }
        logger.info({ ownerId }, `has requested all fragments. Expanded : ${expand}`);
        const idsOrFragmentsArray = await listFragments(ownerId, expand);
        return Promise.resolve(idsOrFragmentsArray);
    }

    /**
     * Gets a fragment for the user by the given id.
     * @param {string} ownerId user's hashed email
     * @param {string} id fragment's id
     * @returns Promise<Fragment>
     */
    static async byId(ownerId, id) {
        const result = await readFragment(ownerId, id);

        if (!result) {
            logger.error({ result }, `found nothing`);
            throw new Error("Nothing found");
        }

        return Promise.resolve(new Fragment(result)); // create a new fragment from retrieved data
    }

    /**
     * Delete the user's fragment data and metadata for the given id
     * @param {string} ownerId user's hashed email
     * @param {string} id fragment's id
     * @returns Promise<void>
     */
    // static delete(ownerId, id) {
    static async delete(ownerId, id) {
        logger.info({ ownerId, id }, `fragment is being deleted`);
        return await deleteFragment(ownerId, id);

    }

    /**
     * Saves the current fragment to the database
     * @returns Promise<void>
     */
    async save() {
        this.updated = new Date().toISOString();

        return await writeFragment(this);

    }

    /**
     * Gets the fragment's data from the database
     * @returns Promise<Buffer>
     */
    async getData() {
        const fragment = await readFragmentData(this.ownerId, this.id);

        if (!fragment) {
            logger.error(`no fragment was found for given ownerId and fragment id`);
            throw new Error("no fragment found");
        }

        return Buffer.from(fragment);
    }

    /**
     * Set's the fragment's data in the database
     * @param {Buffer} data
     * @returns Promise<void>
     */
    async setData(data) {
        if (!Buffer.isBuffer(data)) {
            logger.error({ data }, `is not of type Buffer`);
            throw new Error('Data must be of type Buffer');
        }

        this.size = data.length;
        await writeFragmentData(this.ownerId, this.id, data);

        return await this.save();
    }

    /**
     * Returns the mime type (e.g., without encoding) for the fragment's type:
     * "text/html; charset=utf-8" -> "text/html"
     * @returns {string} fragment's mime type (without encoding)
     */
    get mimeType() {
        const { type } = contentType.parse(this.type);
        return type;
    }

    /**
     * Returns true if this fragment is a text/* mime type
     * @returns {boolean} true if fragment's type is text/*
     */
    get isText() {
        return this.mimeType.startsWith('text/');
    }

    /**
     * Returns the formats into which this fragment type can be converted
     * @returns {Array<string>} list of supported mime types
     */
    get formats() {
        const { type } = contentType.parse(this.type);
        switch (type) {
            case 'text/plain':
                return ['txt'];
            case 'text/markdown':
                return ['md', 'html', 'txt'];
            case 'text/html':
                return ['html', 'txt'];
            case 'application/json':
                return ['json', 'txt'];
            // case 'image/png':
            // case 'image/jpeg':
            // case 'image/webp':
            // case 'image/gif':
            //     return ['png', 'jpg', 'webp', 'gif'];
            default:
                return [];
        }
    }


    /**
     * Returns true if we know how to work with this content type
     * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
     * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
     */
    static isSupportedType(value) {
        const { type } = contentType.parse(value);
        return Fragment.validTypes.includes(type);
    }
}

module.exports.Fragment = Fragment;