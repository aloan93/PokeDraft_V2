const database = require("../connection");

const seed = () => {
  console.log("in seed");
  return database
    .query(`DROP TABLE IF EXISTS users;`)
    .then(() => {
      console.log("in after drop");
      return database.query(`
            CREATE TABLE users(
                user_id SERIAL NOT NULL,
                username VARCHAR(20) NOT NULL UNIQUE,
                email VARCHAR(319) NOT NULL UNIQUE,
                created_at DATE,
                PRIMARY KEY (user_id)
            )`);
    })
    .catch((err) => console.log(err));
};

module.exports = seed;
