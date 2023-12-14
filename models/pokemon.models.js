const database = require("../database/connection");
const { checkPokemonExists } = require("./model.utils");

exports.fetchPokemon = (
  sort_by = "pokedex_no",
  order = "desc",
  pokedex_no,
  type,
  type2,
  ability,
  limit = 10,
  page = 1
) => {
  const validSortBys = {
    pokedex_no: "pokedex_no",
    pokemon_name: "pokemon_name",
    speed_stat: "speed_stat",
  };

  if (!validSortBys[sort_by]) {
    return Promise.reject({ status: 400, message: "Invalid sort_by" });
  }

  if (order.toUpperCase() !== "DESC" && order.toUpperCase() !== "ASC") {
    return Promise.reject({ status: 400, message: "Invalid order" });
  }

  if (limit % 1 !== 0 || page % 1 !== 0 || limit < 1 || page < 1) {
    return Promise.reject({
      status: 400,
      message: "Invalid limit and/or page",
    });
  }

  let query = `SELECT * FROM pokemon `;

  const queryValues = [];
  let count = 0;
  if (pokedex_no) {
    queryValues.push(pokedex_no);
    query += `WHERE pokedex_no = ? `;
    count++;
  }

  if (type) {
    queryValues.push(type);
    queryValues.push(type);
    if (count === 0) query += `WHERE (type_1 = ? OR type_2 = ?) `;
    else query += `AND (type_1 = ? OR type_2 = ?) `;
    count++;
  }

  if (type2) {
    queryValues.push(type2);
    queryValues.push(type2);
    if (count === 0) query += `WHERE (type_1 = ? OR type_2 = ?) `;
    else query += `AND (type_1 = ? OR type_2 = ?) `;
    count++;
  }

  if (ability) {
    queryValues.push(ability);
    queryValues.push(ability);
    queryValues.push(ability);
    if (count === 0)
      query += `WHERE (ability_1 = ? OR ability_2 = ? OR ability_3 = ?) `;
    else query += `AND (ability_1 = ? OR ability_2 = ? OR ability_3 = ?) `;
  }

  query += `ORDER BY ${validSortBys[sort_by]} ${order} `;

  const totalQuery = database.query(query, queryValues).then((result) => {
    return result[0].length;
  });

  query += `LIMIT ${limit} OFFSET ${(page - 1) * limit};`;

  const pokemonQuery = database.query(query, queryValues).then((result) => {
    return result[0];
  });

  return Promise.all([totalQuery, pokemonQuery]).then(([total, pokemon]) => {
    return { total, pokemon };
  });
};

exports.fetchPokemonByPokemonName = (pokemon_name) => {
  const doesPokemonExist = checkPokemonExists(pokemon_name);
  const query = database.query(
    `SELECT * FROM pokemon WHERE pokemon_name = ?;`,
    [pokemon_name]
  );
  return Promise.all([query, doesPokemonExist]).then((results) => {
    return results[0][0][0];
  });
};
