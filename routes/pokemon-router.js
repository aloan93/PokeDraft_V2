const pokemonRouter = require("express").Router();
const {
  getPokemon,
  getPokemonByPokemonName,
} = require("../controllers/pokemon.controllers");

pokemonRouter.get("/", getPokemon);

pokemonRouter.get("/:pokemon_name", getPokemonByPokemonName);

module.exports = { pokemonRouter };
