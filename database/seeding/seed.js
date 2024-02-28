const database = require("../connection");
const pokemonData = require("../data/pokemon");

const seed = () => {
  return database
    .query(`DROP EVENT IF EXISTS auto_delete_expired_tokens;`)
    .then(() => {
      return database.query(`DROP TABLE IF EXISTS tokens;`);
    })
    .then(() => {
      return database.query(`DROP TABLE IF EXISTS leagues_pokemon;`);
    })
    .then(() => {
      return database.query(`DROP TABLE IF EXISTS pokemon;`);
    })
    .then(() => {
      return database.query(`DROP TABLE IF EXISTS teams;`);
    })
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
          league_image_url VARCHAR(1000) DEFAULT "https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-600nw-2179364083.jpg",
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
          team_image_url VARCHAR(1000) DEFAULT "https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-600nw-2179364083.jpg",
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
    .then(() => {
      return database.query(`
          CREATE TABLE pokemon(
          pokemon_name VARCHAR(30) NOT NULL,
          pokedex_no INT NOT NULL,
          speed_stat INT NOT NULL,
          type_1 VARCHAR(12) NOT NULL,
          type_2 VARCHAR(12) DEFAULT null,
          ability_1 VARCHAR(30) NOT NULL,
          ability_2 VARCHAR(30) DEFAULT null,
          ability_3 VARCHAR(30) DEFAULT null,
          PRIMARY KEY (pokemon_name)
          )
      `);
    })
    .then(() => {
      return database.query(`
          CREATE TABLE leagues_pokemon(
          leagues_pokemon_id SERIAL NOT NULL,
          league BIGINT UNSIGNED NOT NULL,
          pokemon VARCHAR(30) NOT NULL,
          tier VARCHAR(12) DEFAULT "untiered",
          drafted_by BIGINT UNSIGNED DEFAULT null,
          drafted_at DATETIME DEFAULT null,
          PRIMARY KEY (leagues_pokemon_id),
          FOREIGN KEY (pokemon)
            REFERENCES pokemon(pokemon_name)
            ON DELETE CASCADE,
          FOREIGN KEY (drafted_by)
            REFERENCES teams(team_id)
            ON DELETE SET null
          )
      `);
    })
    .then(() => {
      return database.query(`
          CREATE TABLE tokens(
          token_id SERIAL NOT NULL,
          token VARCHAR(72) NOT NULL,
          issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME NOT NULL,
          user BIGINT UNSIGNED NOT NULL,
          PRIMARY KEY (token),
          FOREIGN KEY (user)
            REFERENCES users(user_id)
            ON DELETE CASCADE
          )
      `);
    })
    .then(() => {
      const formattedPokemonData = pokemonData.map(
        ({
          name,
          pokedex_no,
          speed_stat,
          type_1,
          type_2,
          ability_1,
          ability_2,
          ability_3,
        }) => [
          name,
          pokedex_no,
          speed_stat,
          type_1,
          type_2,
          ability_1,
          ability_2,
          ability_3,
        ]
      );

      const query = `INSERT INTO pokemon (pokemon_name, pokedex_no, speed_stat, type_1, type_2, ability_1, ability_2, ability_3) VALUES ?;`;

      return database.query(query, [formattedPokemonData]);
    })
    .then(() => {
      return database.query(`
          CREATE EVENT auto_delete_expired_tokens
          ON SCHEDULE EVERY 1 HOUR
          STARTS CURRENT_TIMESTAMP
          DO
          DELETE FROM tokens
          WHERE expires_at < CURRENT_TIMESTAMP;
      `);
    })
    .catch((err) => console.log(err));
};

module.exports = seed;
