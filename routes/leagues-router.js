const leaguesRouter = require("express").Router();
const {
  getLeagues,
  getLeagueByLeagueId,
  getLeaguePokemonByLeagueId,
  getSingleLeaguePokemonByLeagueIdAndPokemonName,
  postLeague,
  postLeaguePokemon,
  patchLeagueByLeagueId,
  patchLeaguePokemonByLeagueIdAndPokemonName,
  deleteLeagueByLeagueId,
} = require("../controllers/leagues.controllers");

leaguesRouter.get("/", getLeagues);

leaguesRouter.get("/:league_id", getLeagueByLeagueId);

leaguesRouter.get("/:league_id/pokemon", getLeaguePokemonByLeagueId);

leaguesRouter.get(
  "/:league_id/pokemon/:pokemon_name",
  getSingleLeaguePokemonByLeagueIdAndPokemonName
);

leaguesRouter.post("/", postLeague);

leaguesRouter.post("/:league_id/pokemon", postLeaguePokemon);

leaguesRouter.patch("/:league_id", patchLeagueByLeagueId);

leaguesRouter.patch(
  "/:league_id/pokemon/:pokemon_name",
  patchLeaguePokemonByLeagueIdAndPokemonName
);

leaguesRouter.delete("/:league_id", deleteLeagueByLeagueId);

module.exports = { leaguesRouter };
