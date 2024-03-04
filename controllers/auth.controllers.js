const {
  loginModel,
  tokenModel,
  logoutModel,
  logoutAllModel,
} = require("../models/auth.models");

exports.loginController = (req, res, next) => {
  const { username, password } = req.body;

  return loginModel(username, password)
    .then(({ accessToken, refreshToken, user }) => {
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        //sameSite: "None",
        //secure: true,
        maxAge: 25 * 60 * 60 * 1000,
      });
      res.status(200).send({ accessToken, user });
    })
    .catch((err) => next(err));
};

exports.tokenController = (req, res, next) => {
  const { user_id } = req.body;
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).send({ message: "No cookie/token supplied" });

  const token = cookies.jwt;

  return tokenModel(user_id, token)
    .then(({ accessToken }) => {
      res.status(200).send({ accessToken });
    })
    .catch((err) => next(err));
};

exports.logoutController = (req, res, next) => {
  const { user_id } = req.body;
  const cookies = req.cookies;

  if (!cookies?.jwt) return sendStatus(204);

  const token = cookies.jwt;

  return logoutModel(user_id, token)
    .then(() => {
      res.clearCookie("jwt", {
        httpOnly: true,
        //sameSite: "None",
        //secure: true,
      });
      return res.sendStatus(204);
    })
    .catch((err) => next(err));
};

exports.logoutAllController = (req, res, next) => {
  const { user_id } = req.body;
  const cookies = req.cookies;

  return logoutAllModel(user_id)
    .then(() => {
      if (cookies?.jwt)
        res.clearCookie("jwt", {
          httpOnly: true,
          //sameSite: "None",
          //secure: true,
        });
      return res.sendStatus(204);
    })
    .catch((err) => next(err));
};
