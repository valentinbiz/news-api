const {
  getUsers,
  getUserByUsername,
} = require("../controllers/controllers.users");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);
userRouter.route("/:username").get(getUserByUsername);

module.exports = userRouter;
