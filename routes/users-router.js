const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUserId,
  postUser,
  postUserLogin,
  patchUserByUserId,
} = require("../controllers/users.controllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:user_id", getUserByUserId);

usersRouter.post("/", postUser);

usersRouter.post("/login", postUserLogin);

usersRouter.patch("/:user_id", patchUserByUserId);

module.exports = { usersRouter };
