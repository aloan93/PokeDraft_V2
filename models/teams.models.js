const database = require("../database/connection");

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
