const pokemonRouter = require("express").Router();
const { getPokemon } = require("../controllers/pokemon.controllers");

pokemonRouter.get("/", getPokemon);

module.exports = { pokemonRouter };
