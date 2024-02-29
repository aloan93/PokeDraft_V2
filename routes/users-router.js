const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUserId,
  postUser,
  patchUserByUserId,
  deleteUserByUserId,
} = require("../controllers/users.controllers");
const { authenticateToken } = require("../middleware");

usersRouter.get("/", getUsers);

usersRouter.get("/:user_id", getUserByUserId);

usersRouter.post("/", postUser);

usersRouter.patch("/:user_id", authenticateToken, patchUserByUserId);

usersRouter.delete("/:user_id", authenticateToken, deleteUserByUserId);

module.exports = { usersRouter };
