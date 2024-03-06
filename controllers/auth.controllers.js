const {
  loginModel,
  tokenModel,
  logoutModel,
} = require("../models/auth.models");

exports.loginController = (req, res, next) => {
  const { username, password } = req.body;

  return loginModel(username, password)
    .then(({ accessToken, refreshToken, user }) => {
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        // sameSite: "none",
        // secure: true,
        maxAge: 25 * 60 * 60 * 1000,
      });
      res.status(200).send({ accessToken, user });
    })
    .catch((err) => next(err));
};

exports.tokenController = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).send({ message: "No cookie/token supplied" });

  const token = cookies.jwt;

  return tokenModel(token)
    .then(({ accessToken, user }) => {
      res.status(200).send({ accessToken, user });
    })
    .catch((err) => next(err));
};

exports.logoutController = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  const token = cookies.jwt;

  return logoutModel(token)
    .then(() => {
      res.clearCookie("jwt", {
        httpOnly: true,
        // sameSite: "none",
        // secure: true,
      });
      return res.sendStatus(204);
    })
    .catch((err) => next(err));
};
