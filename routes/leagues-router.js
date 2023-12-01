const leaguesRouter = require("express").Router();
const {
  getLeagues,
  getLeagueByLeagueId,
} = require("../controllers/leagues.controllers");

leaguesRouter.get("/", getLeagues);

leaguesRouter.get("/:league_id", getLeagueByLeagueId);

module.exports = { leaguesRouter };
