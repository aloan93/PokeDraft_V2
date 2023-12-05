const leaguesRouter = require("express").Router();
const {
  getLeagues,
  getLeagueByLeagueId,
  postLeague,
  patchLeagueByLeagueId,
  deleteLeagueByLeagueId,
} = require("../controllers/leagues.controllers");

leaguesRouter.get("/", getLeagues);

leaguesRouter.get("/:league_id", getLeagueByLeagueId);

leaguesRouter.post("/", postLeague);

leaguesRouter.patch("/:league_id", patchLeagueByLeagueId);

leaguesRouter.delete("/:league_id", deleteLeagueByLeagueId);

module.exports = { leaguesRouter };
