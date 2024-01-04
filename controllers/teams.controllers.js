const {
  fetchTeams,
  fetchTeamByTeamId,
  createTeam,
  updateTeamByTeamId,
  removeTeamByTeamId,
} = require("../models/teams.models");

exports.getTeams = (req, res, next) => {
  const { sort_by, order, team_name, coach, league, limit, page } = req.query;
  return fetchTeams(sort_by, order, team_name, coach, league, limit, page)
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
  const { team_name, coach, team_image_url, notes } = req.body;
  return updateTeamByTeamId(team_id, team_name, coach, team_image_url, notes)
    .then((team) => {
      res.status(200).send({ team });
    })
    .catch((err) => next(err));
};

exports.deleteTeamByTeamId = (req, res, next) => {
  const { team_id } = req.params;
  return removeTeamByTeamId(team_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => next(err));
};
