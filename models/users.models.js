const database = require("../database/connection");
const bcrypt = require("bcrypt");

exports.checkUserExists = (user_id) => {
  return database
    .query(`SELECT * FROM users WHERE user_id = ?;`, [user_id])
    .then((result) => {
      if (result[0].length === 0) {
        return Promise.reject({ status: 404, message: "User not found" });
      }
    });
};

exports.fetchUsers = () => {
  return database.query(`SELECT * FROM users`).then((result) => {
    return { total: result[0].length, users: result[0] };
  });
};

exports.fetchUserByUserId = (user_id) => {
  const doesUserExist = this.checkUserExists(user_id);
  const query = database.query(`SELECT * FROM users WHERE user_id=?;`, [
    user_id,
  ]);
  return Promise.all([query, doesUserExist]).then((results) => {
    return results[0][0][0];
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

exports.updateUserByUserId = (
  user_id,
  username,
  email,
  password,
  avatar_url
) => {
  if (!username && !email && !password && !avatar_url) {
    return Promise.reject({
      status: 400,
      message: "At least one field must be selected for update",
    });
  }

  return this.checkUserExists(user_id)
    .then(() => {
      if (password) return bcrypt.hash(password, 10);
      else return;
    })
    .then((hashedPassword) => {
      let query = `UPDATE users SET`;
      const queryValues = [];
      let count = 0;

      if (username) {
        queryValues.push(username);
        query += ` username = ?`;
        count++;
      }

      if (email) {
        queryValues.push(email);
        if (count === 0) query += ` email = ?`;
        else query += `, email = ?`;
        count++;
      }

      if (hashedPassword) {
        queryValues.push(hashedPassword);
        if (count === 0) query += ` password = ?`;
        else query += `, password =?`;
        count++;
      }

      if (avatar_url) {
        queryValues.push(avatar_url);
        if (count === 0) query += ` avatar_url = ?`;
        else query += `, avatar_url =?`;
      }

      query += ` WHERE user_id = ?;`;
      queryValues.push(user_id);

      return database.query(query, queryValues);
    })
    .then(() => {
      return this.fetchUserByUserId(user_id);
    })
    .then((user) => user);
};
