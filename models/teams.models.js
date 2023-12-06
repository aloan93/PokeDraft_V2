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
