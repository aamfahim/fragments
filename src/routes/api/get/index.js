const Express = require('express');
const router = Express.Router();


const getAll = require("./getAll");
const getById = require("./getById");

// get all Fragment for a user
router.get("/", getAll);

// get Fragment by id for a user
router.get("/:id.:ext?", getById); // optional ext for id



module.exports = router;