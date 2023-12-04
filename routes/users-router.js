const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUserId,
  postUser,
  postUserLogin,
  patchUserByUserId,
  deleteUserByUserId,
} = require("../controllers/users.controllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:user_id", getUserByUserId);

usersRouter.post("/", postUser);

usersRouter.post("/login", postUserLogin);

usersRouter.patch("/:user_id", patchUserByUserId);

usersRouter.delete("/:user_id", deleteUserByUserId);

module.exports = { usersRouter };
