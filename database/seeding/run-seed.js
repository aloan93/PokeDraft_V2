const seed = require("./seed");
const database = require("../connection");

const runSeed = () => {
  return seed()
    .then(() => database.end())
    .catch((err) => console.log(err));
};

runSeed();
