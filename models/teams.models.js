const database = require("../database/connection");

exports.fetchTeams = () => {
  return database.query(`SELECT * FROM teams;`).then((result) => {
    return { total: result[0].length, teams: result[0] };
  });
};
