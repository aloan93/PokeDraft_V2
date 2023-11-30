const apiRouter = require("express").Router();
const { getApis } = require("../controllers/apis.controller");
const { usersRouter } = require("./users-router");

apiRouter.get("/", getApis);

apiRouter.use("/users", usersRouter);

module.exports = { apiRouter };
