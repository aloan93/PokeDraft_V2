const leaguesRouter = require("express").Router();
const { getLeagues } = require("../controllers/leagues.controllers");

leaguesRouter.get("/", getLeagues);

module.exports = { leaguesRouter };
