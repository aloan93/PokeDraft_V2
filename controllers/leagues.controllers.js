const { fetchLeagues } = require("../models/leagues.models");

exports.getLeagues = (req, res, next) => {
  return fetchLeagues()
    .then(({ total, leagues }) => {
      res.status(200).send({ total, leagues });
    })
    .catch((err) => {
      next(err);
    });
};
