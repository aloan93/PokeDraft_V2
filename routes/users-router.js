const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUserId,
  postUser,
  postUserLogin,
} = require("../controllers/users.controllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:user_id", getUserByUserId);

usersRouter.post("/", postUser);

usersRouter.post("/login", postUserLogin);

module.exports = { usersRouter };
