const { fetchUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  return fetchUsers()
    .then(({ total, users }) => {
      res.status(200).send({ total, users });
    })
    .catch((err) => {
      next(err);
    });
};
