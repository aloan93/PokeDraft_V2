const leaguesRouter = require("express").Router();
const {
  getLeagues,
  getLeagueByLeagueId,
  postLeague,
} = require("../controllers/leagues.controllers");

leaguesRouter.get("/", getLeagues);

leaguesRouter.get("/:league_id", getLeagueByLeagueId);

leaguesRouter.post("/", postLeague);

module.exports = { leaguesRouter };
