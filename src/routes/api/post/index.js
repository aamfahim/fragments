const Express = require('express');
const router = Express.Router();

const post = require("./post");

// post a Fragment object for a user with buffer from body
router.post("/", post);

module.exports = router;