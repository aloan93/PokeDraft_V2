const { fetchTeams } = require("../models/teams.models");

exports.getTeams = (req, res, next) => {
  return fetchTeams()
    .then((teams) => {
      res.status(200).send({ teams });
    })
    .catch((err) => next(err));
};
