const {
  fetchUsers,
  fetchUserByUserId,
  createUser,
} = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  return fetchUsers()
    .then(({ total, users }) => {
      res.status(200).send({ total, users });
    })
    .catch((err) => next(err));
};

exports.getUserByUserId = (req, res, next) => {
  const { user_id } = req.params;
  return fetchUserByUserId(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => next(err));
};

exports.postUser = (req, res, next) => {
  const { username, email, password } = req.body;
  return createUser(username, email, password)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => next(err));
};
