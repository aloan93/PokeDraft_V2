const leaguesRouter = require("express").Router();
const {
  getLeagues,
  getLeagueByLeagueId,
  postLeague,
  patchLeagueByLeagueId,
  deleteLeagueByLeagueId,
  postLeaguePokemon,
  getLeaguePokemonByLeagueId,
} = require("../controllers/leagues.controllers");

leaguesRouter.get("/", getLeagues);

leaguesRouter.get("/:league_id", getLeagueByLeagueId);

leaguesRouter.get("/:league_id/pokemon", getLeaguePokemonByLeagueId);

leaguesRouter.post("/", postLeague);

leaguesRouter.post("/:league_id/pokemon", postLeaguePokemon);

leaguesRouter.patch("/:league_id", patchLeagueByLeagueId);

leaguesRouter.delete("/:league_id", deleteLeagueByLeagueId);

module.exports = { leaguesRouter };
