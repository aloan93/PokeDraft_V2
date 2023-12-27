const {
  fetchLeagues,
  fetchLeagueByLeagueId,
  fetchLeaguePokemonByLeagueId,
  createLeague,
  createLeaguePokemon,
  updateLeagueByLeagueId,
  updateLeaguePokemonByLeagueIdAndPokemonName,
  removeLeagueByLeagueId,
} = require("../models/leagues.models");

exports.getLeagues = (req, res, next) => {
  const { sort_by, order, league_name, owner, limit, page } = req.query;
  return fetchLeagues(sort_by, order, league_name, owner, limit, page)
    .then(({ total, leagues }) => {
      res.status(200).send({ total, leagues });
    })
    .catch((err) => next(err));
};

exports.getLeagueByLeagueId = (req, res, next) => {
  const { league_id } = req.params;
  return fetchLeagueByLeagueId(league_id)
    .then((league) => {
      res.status(200).send({ league });
    })
    .catch((err) => next(err));
};

exports.getLeaguePokemonByLeagueId = (req, res, next) => {
  const { league_id } = req.params;
  const {
    sort_by,
    order,
    pokedex_no,
    type,
    type2,
    ability,
    tier,
    limit,
    page,
  } = req.query;
  return fetchLeaguePokemonByLeagueId(
    league_id,
    sort_by,
    order,
    pokedex_no,
    type,
    type2,
    ability,
    tier,
    limit,
    page
  )
    .then(({ total, pokemon }) => {
      res.status(200).send({ total, pokemon });
    })
    .catch((err) => next(err));
};

exports.postLeague = (req, res, next) => {
  const { league_name, owner } = req.body;
  return createLeague(league_name, owner)
    .then((league) => {
      res.status(201).send({ league });
    })
    .catch((err) => next(err));
};

exports.postLeaguePokemon = (req, res, next) => {
  const { league_id } = req.params;
  const { pokemon_name } = req.body;
  return createLeaguePokemon(league_id, pokemon_name)
    .then((leaguePokemon) => {
      res.status(201).send({ leaguePokemon });
    })
    .catch((err) => next(err));
};

exports.patchLeagueByLeagueId = (req, res, next) => {
  const { league_id } = req.params;
  const { league_name, owner, notes } = req.body;
  return updateLeagueByLeagueId(league_id, league_name, owner, notes)
    .then((league) => {
      res.status(200).send({ league });
    })
    .catch((err) => next(err));
};

exports.patchLeaguePokemonByLeagueIdAndPokemonName = (req, res, next) => {
  const { league_id, pokemon_name } = req.params;
  const { tier, drafted_by } = req.body;
  return updateLeaguePokemonByLeagueIdAndPokemonName(
    league_id,
    pokemon_name,
    tier,
    drafted_by
  )
    .then((leaguePokemon) => {
      res.status(200).send({ leaguePokemon });
    })
    .catch((err) => next(err));
};

exports.deleteLeagueByLeagueId = (req, res, next) => {
  const { league_id } = req.params;
  return removeLeagueByLeagueId(league_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => next(err));
};
