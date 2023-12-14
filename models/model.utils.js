const database = require("../database/connection");

exports.checkUserExists = (user_id) => {
  return database
    .query(`SELECT * FROM users WHERE user_id = ?;`, [user_id])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "User not found" });
      }
    });
};

exports.checkLeagueExists = (league_id) => {
  return database
    .query(`SELECT * FROM leagues WHERE league_id = ?;`, [league_id])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "League not found" });
      }
    });
};

exports.checkTeamExists = (team_id) => {
  return database
    .query(`SELECT * FROM teams WHERE team_id = ?;`, [team_id])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "Team not found" });
      }
    });
};

exports.checkPokemonExists = (pokemon_name) => {
  return database
    .query(`SELECT * FROM pokemon WHERE pokemon_name = ?;`, [pokemon_name])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "Pokemon not found" });
      }
    });
};
