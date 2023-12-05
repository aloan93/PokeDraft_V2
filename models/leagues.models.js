const database = require("../database/connection");
const { checkUserExists } = require("./users.models");

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

exports.createLeague = (league_name, owner) => {
  const doesUserExist = checkUserExists(owner);

  const query = database.query(
    `INSERT INTO leagues (league_name, owner) VALUES (?, ?);`,
    [league_name, owner]
  );

  return Promise.all([doesUserExist, query])
    .then(() => {
      return database.query(
        `SELECT * FROM leagues WHERE league_id = LAST_INSERT_ID();`
      );
    })
    .then((result) => {
      return result[0][0];
    });
};
