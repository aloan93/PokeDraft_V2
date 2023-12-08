const {
  fetchLeagues,
  fetchLeagueByLeagueId,
  createLeague,
  updateLeagueByLeagueId,
  removeLeagueByLeagueId,
} = require("../models/leagues.models");

exports.getLeagues = (req, res, next) => {
  const { sort_by, order, league_name, owner, limit, page } = req.query;
  return fetchLeagues(sort_by, order, league_name, owner, limit, page)
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

exports.patchLeagueByLeagueId = (req, res, next) => {
  const { league_id } = req.params;
  const { league_name, owner, notes } = req.body;
  return updateLeagueByLeagueId(league_id, league_name, owner, notes)
    .then((league) => {
      res.status(200).send({ league });
    })
    .catch((err) => next(err));
};

exports.deleteLeagueByLeagueId = (req, res, next) => {
  const { league_id } = req.params;
  return removeLeagueByLeagueId(league_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => next(err));
};
