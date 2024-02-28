const {
  loginModel,
  tokenModel,
  logoutModel,
} = require("../models/auth.models");

exports.loginController = (req, res, next) => {
  const { username, password } = req.body;
  return loginModel(username, password)
    .then(({ accessToken, refreshToken }) => {
      res.json({ accessToken, refreshToken });
    })
    .catch((err) => next(err));
};

exports.tokenController = (req, res, next) => {
  const { user_id, token } = req.body;
  return tokenModel(user_id, token)
    .then(({ accessToken }) => {
      res.json({ accessToken });
    })
    .catch((err) => next(err));
};

exports.logoutController = (req, res, next) => {
  const { user_id, token } = req.body;
  return logoutModel(user_id, token)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => next(err));
};
