const apiRouter = require("express").Router();
const { getApis } = require("../controllers/apis.controller");

apiRouter.get("/", getApis);

module.exports = { apiRouter };
