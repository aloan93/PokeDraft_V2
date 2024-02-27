require("dotenv").config({ path: `${__dirname}/../.env` });
const database = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkUserExists } = require("./model.utils");

exports.loginModel = (username, password) => {
  return database
    .query(`SELECT password FROM users WHERE username = ?;`, [username])
    .then((result) => {
      if (result[0].length === 0)
        return Promise.reject({ status: 404, message: "User not found" });

      return bcrypt.compare(password, result[0][0].password);
    })
    .then((isMatch) => {
      if (!isMatch)
        return Promise.reject({
          status: 401,
          message: "Password is incorrect",
        });
      else {
        const user = { name: username };
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

        return Promise.all([
          accessToken,
          refreshToken,
          storeToken(username, refreshToken),
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
  const query = database.query(`SELECT token from users WHERE user_id = ?`, [
    user_id,
  ]);
  return Promise.all([query, doesUserExist])
    .then((results) => {
      if (!results[0][0][0].token)
        return Promise.reject({
          status: 401,
          message: "User does not have token",
        });
      return bcrypt.compare(token, results[0][0][0].token);
    })
    .then((isMatch) => {
      if (!isMatch)
        return Promise.reject({ status: 403, message: "Invalid token" });

      let accessToken;
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return Promise.reject({
            status: 403,
            message: "Token generation error",
          });
        accessToken = generateAccessToken({ name: user.name });
      });

      return { accessToken };
    });
};

exports.logoutModel = (user_id) => {
  if (!user_id)
    return Promise.reject({ status: 400, message: "No user_id supplied" });

  return checkUserExists(user_id).then(() => {
    return database.query(`UPDATE users SET token = null WHERE user_id = ?`, [
      user_id,
    ]);
  });
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
}

function storeToken(username, refreshToken) {
  return bcrypt.hash(refreshToken, 10).then((hashedToken) => {
    return database.query(`UPDATE users SET token = ? WHERE username = ?`, [
      hashedToken,
      username,
    ]);
  });
}
