const database = require("../database/connection");

exports.fetchLeagues = () => {
  return database.query(`SELECT * FROM leagues`).then((result) => {
    return { total: result[0].length, leagues: result[0] };
  });
};

exports.fetchLeagueByLeagueId = (league_id) => {
  return database
    .query(`SELECT * FROM leagues WHERE league_id=?`, [league_id])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "League not found" });
      }
      return result[0][0];
    });
};
