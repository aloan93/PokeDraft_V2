const { fetchTeams, fetchTeamByTeamId } = require("../models/teams.models");

exports.getTeams = (req, res, next) => {
  return fetchTeams()
    .then((teams) => {
      res.status(200).send({ teams });
    })
    .catch((err) => next(err));
};

exports.getTeamByTeamId = (req, res, next) => {
  const { team_id } = req.params;
  return fetchTeamByTeamId(team_id)
    .then((team) => {
      res.status(200).send({ team });
    })
    .catch((err) => next(err));
};
