const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUserId,
} = require("../controllers/users.controllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:user_id", getUserByUserId);

module.exports = { usersRouter };
