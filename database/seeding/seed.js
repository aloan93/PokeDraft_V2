const database = require("../connection");

const seed = () => {
  return database
    .query(`DROP TABLE IF EXISTS teams;`)
    .then(() => {
      return database.query(`DROP TABLE IF EXISTS leagues;`);
    })
    .then(() => {
      return database.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return database.query(`
          CREATE TABLE users(
          user_id SERIAL NOT NULL,
          username VARCHAR(20) NOT NULL UNIQUE,
          email VARCHAR(319) NOT NULL UNIQUE,
          password VARCHAR(72) NOT NULL,
          avatar_url VARCHAR(1000) DEFAULT "https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
          join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id)
          )`);
    })
    .then(() => {
      return database.query(`
          CREATE TABLE leagues(
          league_id SERIAL NOT NULL,
          league_name VARCHAR(50) NOT NULL UNIQUE,
          owner BIGINT UNSIGNED NOT NULL,
          notes VARCHAR(1000),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (league_id),
          FOREIGN KEY (owner)
            REFERENCES users(user_id)
            ON DELETE CASCADE
          )`);
    })
    .then(() => {
      return database.query(`
          CREATE TABLE teams(
          team_id SERIAL NOT NULL,
          team_name VARCHAR(30) NOT NULL,
          coach BIGINT UNSIGNED NOT NULL,
          league BIGINT UNSIGNED NOT NULL,
          notes VARCHAR(100),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (team_id),
          FOREIGN KEY (coach)
            REFERENCES users(user_id)
            ON DELETE CASCADE,
          FOREIGN KEY (league)
            REFERENCES leagues(league_id)
            ON DELETE CASCADE
          )`);
    })
    .catch((err) => console.log(err));
};

module.exports = seed;
