const {
  fetchUsers,
  fetchUserByUserId,
  createUser,
  createUserLogin,
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

exports.postUserLogin = (req, res, next) => {
  const { username, password } = req.body;
  return createUserLogin(username, password)
    .then(({ status, message }) => {
      res.status(status).send({ message });
    })
    .catch((err) => next(err));
};
