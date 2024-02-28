const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUserId,
  postUser,
  patchUserByUserId,
  deleteUserByUserId,
} = require("../controllers/users.controllers");
const { authenticateToken } = require("../middleware");

usersRouter.get("/", authenticateToken, getUsers);

usersRouter.get("/:user_id", getUserByUserId);

usersRouter.post("/", postUser);

usersRouter.patch("/:user_id", patchUserByUserId);

usersRouter.delete("/:user_id", deleteUserByUserId);

module.exports = { usersRouter };
