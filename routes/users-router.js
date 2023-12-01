const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUserId,
  postUser,
} = require("../controllers/users.controllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:user_id", getUserByUserId);

usersRouter.post("/", postUser);

module.exports = { usersRouter };
