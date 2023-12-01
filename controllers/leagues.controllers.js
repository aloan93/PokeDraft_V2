const {
  fetchLeagues,
  fetchLeagueByLeagueId,
} = require("../models/leagues.models");

exports.getLeagues = (req, res, next) => {
  return fetchLeagues()
    .then(({ total, leagues }) => {
      res.status(200).send({ total, leagues });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getLeagueByLeagueId = (req, res, next) => {
  const { league_id } = req.params;
  return fetchLeagueByLeagueId(league_id)
    .then((league) => {
      res.status(200).send({ league });
    })
    .catch((err) => {
      next(err);
    });
};
