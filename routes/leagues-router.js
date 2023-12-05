const leaguesRouter = require("express").Router();
const {
  getLeagues,
  getLeagueByLeagueId,
  postLeague,
  patchLeagueByLeagueId,
} = require("../controllers/leagues.controllers");

leaguesRouter.get("/", getLeagues);

leaguesRouter.get("/:league_id", getLeagueByLeagueId);

leaguesRouter.post("/", postLeague);

leaguesRouter.patch("/:league_id", patchLeagueByLeagueId);

module.exports = { leaguesRouter };
