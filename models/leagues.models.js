const database = require("../database/connection");

exports.fetchLeagues = () => {
  return database.query(`SELECT * FROM leagues`).then((result) => {
    return { total: result[0].length, leagues: result[0] };
  });
};
