const database = require("../database/connection");
const { checkUserExists } = require("./users.models");
const { checkLeagueExists } = require("./leagues.models");

exports.checkTeamExists = (team_id) => {
  return database
    .query(`SELECT * FROM teams WHERE team_id = ?;`, [team_id])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "Team not found" });
      }
    });
};

exports.fetchTeams = () => {
  return database.query(`SELECT * FROM teams;`).then((result) => {
    return { total: result[0].length, teams: result[0] };
  });
};

exports.fetchTeamByTeamId = (team_id) => {
  const doesTeamExist = this.checkTeamExists(team_id);
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
  const query = database.query(
    `INSERT INTO teams (team_name, coach, league) VALUES (?, ?, ?);`,
    [team_name, coach, league]
  );

  return Promise.all([doesUserExist, doesLeagueExist, query])
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
  const doesTeamExist = this.checkTeamExists(team_id);

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
  const doesTeamExist = this.checkTeamExists(team_id);
  const query = database.query(`DELETE FROM teams WHERE team_id = ?;`, [
    team_id,
  ]);
  return Promise.all([query, doesTeamExist]).then((results) => {
    if (results[0][0].affectedRows === 0) {
      return Promise.reject({ status: 500, message: "Issue deleting team" });
    } else return;
  });
};
