require("dotenv").config({ path: `${__dirname}/../.env` });
const database = require("../database/connection");
const bcrypt = require("bcrypt");

exports.loginModel = (username, password) => {
  return database
    .query(`SELECT password FROM users WHERE username = ?;`, [username])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "User not found" });
      }
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
        return user;
      }
    });
};
