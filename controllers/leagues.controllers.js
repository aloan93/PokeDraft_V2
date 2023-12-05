const {
  fetchLeagues,
  fetchLeagueByLeagueId,
  createLeague,
} = require("../models/leagues.models");

exports.getLeagues = (req, res, next) => {
  return fetchLeagues()
    .then(({ total, leagues }) => {
      res.status(200).send({ total, leagues });
    })
    .catch((err) => next(err));
};

exports.getLeagueByLeagueId = (req, res, next) => {
  const { league_id } = req.params;
  return fetchLeagueByLeagueId(league_id)
    .then((league) => {
      res.status(200).send({ league });
    })
    .catch((err) => next(err));
};

exports.postLeague = (req, res, next) => {
  const { league_name, owner } = req.body;
  return createLeague(league_name, owner)
    .then((league) => {
      res.status(201).send({ league });
    })
    .catch((err) => next(err));
};
