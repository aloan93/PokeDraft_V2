const database = require("../database/connection");
const { checkUserExists } = require("./users.models");

exports.checkLeagueExists = (league_id) => {
  return database
    .query(`SELECT * FROM leagues WHERE league_id = ?;`, [league_id])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "League not found" });
      }
    });
};

exports.fetchLeagues = () => {
  return database.query(`SELECT * FROM leagues`).then((result) => {
    return { total: result[0].length, leagues: result[0] };
  });
};

exports.fetchLeagueByLeagueId = (league_id) => {
  const doesLeagueExist = this.checkLeagueExists(league_id);

  const query = database.query(`SELECT * FROM leagues WHERE league_id=?`, [
    league_id,
  ]);

  return Promise.all([query, doesLeagueExist]).then((results) => {
    return results[0][0][0];
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

exports.updateLeagueByLeagueId = (league_id, league_name, owner, notes) => {
  const doesLeagueExist = this.checkLeagueExists(league_id);

  if (!league_name && !owner && !notes) {
    return Promise.reject({
      status: 400,
      message: "At least one field must be selected for update",
    });
  }

  let query = `UPDATE leagues SET`;
  const queryValues = [];
  let count = 0;

  if (league_name) {
    queryValues.push(league_name);
    query += ` league_name = ?`;
    count++;
  }

  let doesUserExist;
  if (owner) {
    doesUserExist = checkUserExists(owner);
    queryValues.push(owner);
    if (count === 0) query += ` owner = ?`;
    else query += `, owner = ?`;
    count++;
  }

  if (notes) {
    queryValues.push(notes);
    if (count === 0) query += ` notes = ?`;
    else query += `, notes = ?`;
  }

  query += ` WHERE league_id = ?;`;
  queryValues.push(league_id);

  const finalQuery = database.query(query, queryValues);

  return Promise.all([finalQuery, doesUserExist, doesLeagueExist])
    .then(() => {
      return this.fetchLeagueByLeagueId(league_id);
    })
    .then((league) => league);
};
