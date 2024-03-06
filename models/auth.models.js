require("dotenv").config({ path: `${__dirname}/../.env` });
const database = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { fetchUserByUserId } = require("./users.models");
const crypto = require("crypto");

exports.loginModel = (username, password) => {
  return database
    .query(`SELECT password, user_id FROM users WHERE username = ?;`, [
      username,
    ])
    .then((result) => {
      if (result[0].length === 0)
        return Promise.reject({ status: 404, message: "User not found" });

      return [
        bcrypt.compare(password, result[0][0].password),
        result[0][0].user_id,
      ];
    })
    .then(([isMatch, user_id]) => {
      if (!isMatch)
        return Promise.reject({
          status: 401,
          message: "Password is incorrect",
        });
      else {
        const user = { name: username, id: user_id };
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: "25h",
        });

        return Promise.all([
          accessToken,
          refreshToken,
          fetchUserByUserId(user_id),
          storeToken(user_id, refreshToken),
        ]);
      }
    })
    .then(([accessToken, refreshToken, user]) => {
      return { accessToken, refreshToken, user };
    });
};

exports.tokenModel = (token) => {
  return database
    .query(`SELECT user FROM tokens WHERE token = ?;`, [hashToken(token)])
    .then((result) => {
      if (result[0].length === 0)
        return Promise.reject({
          status: 401,
          message: "Token not found",
        });

      let accessToken;
      let verificationError = false;

      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) verificationError = true;
        else
          accessToken = generateAccessToken({ name: user.name, id: user.id });
      });

      if (verificationError)
        return Promise.reject({
          status: 403,
          message: "Token verification error",
        });

      const user_id = result[0][0].user;
      return Promise.all([accessToken, fetchUserByUserId(user_id)]);
    })
    .then(([accessToken, user]) => {
      return { accessToken, user };
    });
};

exports.logoutModel = (token) => {
  return database.query(`DELETE FROM tokens WHERE token = ?;`, [
    hashToken(token),
  ]);
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
}

function storeToken(user_id, refreshToken) {
  return database
    .query(`DELETE FROM tokens WHERE user = ?;`, [user_id])
    .then(() => {
      return hashToken(refreshToken);
    })
    .then((hashedToken) => {
      return database.query(
        `INSERT INTO tokens (token, expires_at, user) VALUES (?, CURRENT_TIMESTAMP + INTERVAL 1 DAY, ?);`,
        [hashedToken, user_id]
      );
    });
}

function hashToken(str) {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto.createHash("sha256").update(str).digest("hex");
    return hash;
  }
  return Promise.reject({ status: 400, message: "Not a valid string to hash" });
}
