const { loginModel } = require("../models/auth.models");

exports.loginController = (req, res, next) => {
  const { username, password } = req.body;
  return loginModel(username, password)
    .then(({ accessToken }) => {
      res.json({ accessToken });
    })
    .catch((err) => next(err));
};
