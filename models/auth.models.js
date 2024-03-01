require("dotenv").config({ path: `${__dirname}/../.env` });
const database = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkUserExists } = require("./model.utils");
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
          storeToken(user_id, refreshToken),
        ]);
      }
    })
    .then(([accessToken, refreshToken]) => {
      return { accessToken, refreshToken };
    });
};

exports.tokenModel = (user_id, token) => {
  if (!token)
    return Promise.reject({ status: 401, message: "No token supplied" });

  if (!user_id)
    return Promise.reject({ status: 400, message: "No user_id supplied" });

  const doesUserExist = checkUserExists(user_id);
  const query = database.query(`SELECT token from tokens WHERE user = ?`, [
    user_id,
  ]);
  return Promise.all([query, doesUserExist])
    .then(([result]) => {
      if (result[0].length === 0)
        return Promise.reject({
          status: 401,
          message: "User does not have any valid tokens",
        });

      return [...result[0]].map((i) => i.token === hashToken(token));
    })
    .then((matchCheckArr) => {
      if (!matchCheckArr.includes(true))
        return Promise.reject({ status: 403, message: "Invalid token" });

      let accessToken;
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return Promise.reject({
            status: 403,
            message: "Token generation error",
          });
        accessToken = generateAccessToken({ name: user.name, id: user.id });
      });

      return { accessToken };
    });
};

exports.logoutModel = (user_id, token) => {
  if (!token)
    return Promise.reject({ status: 401, message: "No token supplied" });

  if (!user_id)
    return Promise.reject({ status: 400, message: "No user_id supplied" });

  const doesUserExist = checkUserExists(user_id);
  const query = database.query(
    `SELECT token, token_id from tokens WHERE user = ?`,
    [user_id]
  );

  return Promise.all([query, doesUserExist]).then(([result]) => {
    if (result[0].length === 0) return;
    else {
      for (let i of result[0]) {
        if (i.token === hashToken(token))
          return database.query(`DELETE FROM tokens WHERE token_id = ?;`, [
            i.token_id,
          ]);
        else continue;
      }
      return;
    }
  });
};

exports.logoutAllModel = (user_id) => {
  if (!user_id)
    return Promise.reject({ status: 400, message: "No user_id supplied" });

  return checkUserExists(user_id).then(() => {
    return database.query(`DELETE FROM tokens WHERE user = ?;`, [user_id]);
  });
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
}

function storeToken(user_id, refreshToken) {
  return database
    .query(`SELECT * FROM tokens WHERE user = ? ORDER BY expires_at ASC;`, [
      user_id,
    ])
    .then((result) => {
      if (result[0].length > 2)
        return database.query(`DELETE FROM tokens WHERE token_id = ?;`, [
          result[0][0].token_id,
        ]);
      else return;
    })
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
