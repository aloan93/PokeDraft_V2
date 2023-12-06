const {
  fetchTeams,
  fetchTeamByTeamId,
  createTeam,
  updateTeamByTeamId,
} = require("../models/teams.models");

exports.getTeams = (req, res, next) => {
  return fetchTeams()
    .then(({ total, teams }) => {
      res.status(200).send({ total, teams });
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

exports.postTeam = (req, res, next) => {
  const { team_name, coach, league } = req.body;
  return createTeam(team_name, coach, league)
    .then((team) => {
      res.status(201).send({ team });
    })
    .catch((err) => next(err));
};

exports.patchTeamByTeamId = (req, res, next) => {
  const { team_id } = req.params;
  const { team_name, coach, notes } = req.body;
  return updateTeamByTeamId(team_id, team_name, coach, notes)
    .then((team) => {
      res.status(200).send({ team });
    })
    .catch((err) => next(err));
};
