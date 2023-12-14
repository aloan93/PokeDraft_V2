const {
  fetchPokemon,
  fetchPokemonByPokemonName,
} = require("../models/pokemon.models");

exports.getPokemon = (req, res, next) => {
  const { sort_by, order, pokedex_no, type, type2, ability, limit, page } =
    req.query;
  return fetchPokemon(
    sort_by,
    order,
    pokedex_no,
    type,
    type2,
    ability,
    limit,
    page
  )
    .then((total, pokemon) => {
      res.status(200).send({ total, pokemon });
    })
    .catch((err) => next(err));
};

exports.getPokemonByPokemonName = (req, res, next) => {
  const { pokemon_name } = req.params;
  return fetchPokemonByPokemonName(pokemon_name)
    .then((pokemon) => {
      res.status(200).send({ pokemon });
    })
    .catch((err) => next(err));
};
