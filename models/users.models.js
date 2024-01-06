const database = require("../database/connection");
const bcrypt = require("bcrypt");
const { checkUserExists } = require("./model.utils");

exports.fetchUsers = (
  sort_by = "join_date",
  order = "DESC",
  username,
  limit = 10,
  page = 1
) => {
  const validSortBys = { join_date: "join_date", username: "username" };

  if (!validSortBys[sort_by]) {
    return Promise.reject({ status: 400, message: "Invalid sort_by" });
  }

  if (order.toUpperCase() !== "DESC" && order.toUpperCase() !== "ASC") {
    return Promise.reject({ status: 400, message: "Invalid order" });
  }

  if (limit % 1 !== 0 || page % 1 !== 0 || limit < 1 || page < 1) {
    return Promise.reject({
      status: 400,
      message: "Invalid limit and/or page",
    });
  }

  let query = `SELECT user_id, username, email, avatar_url, join_date FROM users `;

  const queryValues = [];
  if (username) {
    queryValues.push(username);
    query += `WHERE username = ? `;
  }

  query += `ORDER BY ${validSortBys[sort_by]} ${order} `;

  const totalQuery = database.query(query, queryValues).then((result) => {
    return result[0].length;
  });

  query += `LIMIT ${limit} OFFSET ${(page - 1) * limit};`;

  const usersQuery = database.query(query, queryValues).then((result) => {
    return result[0];
  });

  return Promise.all([totalQuery, usersQuery]).then(([total, users]) => {
    return { total, users };
  });
};

exports.fetchUserByUserId = (user_id) => {
  const doesUserExist = checkUserExists(user_id);
  const query = database.query(
    `SELECT user_id, username, email, avatar_url, join_date FROM users WHERE user_id=?;`,
    [user_id]
  );
  return Promise.all([query, doesUserExist]).then((results) => {
    return results[0][0][0];
  });
};

exports.createUser = (username, email, password) => {
  if (
    !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
      email
    )
  ) {
    return Promise.reject({
      status: 400,
      message: "Please provide a valid email address",
    });
  }

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
        `SELECT user_id, username, email, avatar_url, join_date FROM users WHERE user_id = LAST_INSERT_ID()`
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

  return checkUserExists(user_id)
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
        if (
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
            email
          )
        ) {
          queryValues.push(email);
          if (count === 0) query += ` email = ?`;
          else query += `, email = ?`;
          count++;
        } else {
          return Promise.reject({
            status: 400,
            message: "Please provide a valid email address",
          });
        }
      }

      if (hashedPassword) {
        queryValues.push(hashedPassword);
        if (count === 0) query += ` password = ?`;
        else query += `, password =?`;
        count++;
      }

      if (avatar_url) {
        if (
          /^https?:\/\/(?:\w[%\.\-\/]?)+\.(?:jpg|gif|png)$/.test(avatar_url)
        ) {
          queryValues.push(avatar_url);
          if (count === 0) query += ` avatar_url = ?`;
          else query += `, avatar_url =?`;
        } else {
          return Promise.reject({
            status: 400,
            message: "Please provide a valid jpg, gif or png URL",
          });
        }
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

exports.removeUserByUserId = (user_id) => {
  const query = database.query(`DELETE FROM users WHERE user_id = ?;`, [
    user_id,
  ]);
  const doesUserExist = checkUserExists(user_id);
  return Promise.all([query, doesUserExist]).then((results) => {
    if (results[0][0].affectedRows === 0) {
      return Promise.reject({ status: 500, message: "Issue deleting user" });
    } else return;
  });
};
