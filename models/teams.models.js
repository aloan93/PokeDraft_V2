const database = require("../database/connection");
const {
  checkTeamExists,
  checkLeagueExists,
  checkUserExists,
} = require("./model.utils");

exports.fetchTeams = (
  sort_by = "created_at",
  order = "desc",
  team_name,
  limit = 10,
  page = 1
) => {
  const validSortBys = { created_at: "created_at", team_name: "team_name" };

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

  let query = `SELECT * FROM teams `;

  const queryValues = [];
  if (team_name) {
    queryValues.push(team_name);
    query += `WHERE team_name = ? `;
  }

  query += `ORDER BY ${validSortBys[sort_by]} ${order} `;

  const totalQuery = database.query(query, queryValues).then((result) => {
    return result[0].length;
  });

  query += `LIMIT ${limit} OFFSET ${(page - 1) * limit};`;

  const teamsQuery = database.query(query, queryValues).then((result) => {
    return result[0];
  });

  return Promise.all([totalQuery, teamsQuery]).then(([total, teams]) => {
    return { total, teams };
  });
};

exports.fetchTeamByTeamId = (team_id) => {
  const doesTeamExist = checkTeamExists(team_id);
  const query = database.query(`SELECT * FROM teams WHERE team_id = ?;`, [
    team_id,
  ]);
  return Promise.all([query, doesTeamExist]).then((results) => {
    return results[0][0][0];
  });
};

exports.createTeam = (team_name, coach, league) => {
  const doesUserExist = checkUserExists(coach);
  const doesLeagueExist = checkLeagueExists(league);
  return Promise.all([doesLeagueExist, doesUserExist])
    .then(() => {
      return database.query(
        `SELECT * FROM teams WHERE coach = ? AND league = ?;`,
        [coach, league]
      );
    })
    .then((result) => {
      if (result[0].length !== 0) {
        return Promise.reject({
          status: 400,
          message: "Each player may coach only one team per league",
        });
      }

      return database.query(
        `INSERT INTO teams (team_name, coach, league) VALUES (?, ?, ?);`,
        [team_name, coach, league]
      );
    })
    .then(() => {
      return database.query(
        `SELECT * FROM teams WHERE team_id = LAST_INSERT_ID();`
      );
    })
    .then((result) => {
      return result[0][0];
    });
};

exports.updateTeamByTeamId = (team_id, team_name, coach, notes) => {
  const doesTeamExist = checkTeamExists(team_id);

  if (!team_name && !coach && !notes) {
    return Promise.reject({
      status: 400,
      message: "At least one field must be selected for update",
    });
  }

  let query = `UPDATE teams SET`;
  const queryValues = [];
  let count = 0;

  if (team_name) {
    queryValues.push(team_name);
    query += ` team_name = ?`;
    count++;
  }

  let doesUserExist;
  if (coach) {
    doesUserExist = checkUserExists(coach);
    queryValues.push(coach);
    if (count === 0) query += ` coach = ?`;
    else query += `, coach = ?`;
    count++;
  }

  if (notes) {
    queryValues.push(notes);
    if (count === 0) query += ` notes = ?`;
    else query += `, notes = ?`;
  }

  query += ` WHERE team_id = ?;`;
  queryValues.push(team_id);

  const finalQuery = database.query(query, queryValues);

  return Promise.all([finalQuery, doesUserExist, doesTeamExist])
    .then(() => {
      return this.fetchTeamByTeamId(team_id);
    })
    .then((team) => team);
};

exports.removeTeamByTeamId = (team_id) => {
  const doesTeamExist = checkTeamExists(team_id);
  const query = database.query(`DELETE FROM teams WHERE team_id = ?;`, [
    team_id,
  ]);
  return Promise.all([query, doesTeamExist]).then((results) => {
    if (results[0][0].affectedRows === 0) {
      return Promise.reject({ status: 500, message: "Issue deleting team" });
    } else return;
  });
};
