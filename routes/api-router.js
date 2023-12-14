const apiRouter = require("express").Router();
const { getApis } = require("../controllers/apis.controller");
const { usersRouter } = require("./users-router");
const { leaguesRouter } = require("./leagues-router");
const { teamsRouter } = require("./teams-router");
const { pokemonRouter } = require("./pokemon-router");

apiRouter.get("/", getApis);

apiRouter.use("/users", usersRouter);

apiRouter.use("/leagues", leaguesRouter);

apiRouter.use("/teams", teamsRouter);

apiRouter.use("/pokemon", pokemonRouter);

module.exports = { apiRouter };
