const database = require("../database/connection");
const bcrypt = require("bcrypt");

exports.fetchUsers = () => {
  return database.query(`SELECT * FROM users`).then((result) => {
    return { total: result[0].length, users: result[0] };
  });
};

exports.fetchUserByUserId = (user_id) => {
  return database
    .query(`SELECT * FROM users WHERE user_id=?;`, [user_id])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "User not found" });
      }
      return result[0][0];
    });
};

exports.createUser = (username, email, password) => {
  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return database.query(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?);`,
        [username, email, hashedPassword]
      );
    })
    .then(() => {
      return database.query(
        `SELECT * FROM users WHERE user_id = LAST_INSERT_ID()`
      );
    })
    .then((result) => {
      return result[0][0];
    });
};

exports.createUserLogin = (username, password) => {
  return database
    .query(`SELECT password FROM users WHERE username = ?;`, [username])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "User not found" });
      }
      return bcrypt.compare(password, result[0][0].password);
    })
    .then((isMatch) => {
      if (!isMatch) return { status: 401, message: "Password is incorrect" };
      else return { status: 200, message: "Successfully logged in" };
    });
};
