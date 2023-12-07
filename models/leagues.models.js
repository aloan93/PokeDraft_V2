const database = require("../database/connection");
const { checkLeagueExists, checkUserExists } = require("./model.utils");

exports.fetchLeagues = (
  sort_by = "created_at",
  order = "DESC",
  league_name,
  limit = 10,
  page = 1
) => {
  const validSortBys = { created_at: "created_at", league_name: "league_name" };

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

  let query = `SELECT * FROM leagues `;

  const queryValues = [];
  if (league_name) {
    queryValues.push(league_name);
    query += `WHERE league_name = ? `;
  }

  query += `ORDER BY ${validSortBys[sort_by]} ${order} `;

  const totalQuery = database.query(query, queryValues).then((result) => {
    return result[0].length;
  });

  query += `LIMIT ${limit} OFFSET ${(page - 1) * limit};`;

  const leaguesQuery = database.query(query, queryValues).then((result) => {
    return result[0];
  });

  return Promise.all([totalQuery, leaguesQuery]).then(([total, leagues]) => {
    return { total, leagues };
  });
};

exports.fetchLeagueByLeagueId = (league_id) => {
  const doesLeagueExist = checkLeagueExists(league_id);

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
  const doesLeagueExist = checkLeagueExists(league_id);

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

exports.removeLeagueByLeagueId = (league_id) => {
  const query = database.query(`DELETE FROM leagues WHERE league_id = ?;`, [
    league_id,
  ]);
  const doesLeagueExist = checkLeagueExists(league_id);
  return Promise.all([query, doesLeagueExist]).then((results) => {
    if (results[0][0].affectedRows === 0) {
      return Promise.reject({ status: 500, message: "Issue deleting league" });
    } else return;
  });
};
