const { fetchPokemon } = require("../models/pokemon.models");

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
