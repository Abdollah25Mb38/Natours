const express = require("express");
const {getAllUser, createUser, deleteUser, editUser} = require("./../controllers/userController");
const {signup, login, forgotPassword} = require("./../controllers/authController");
const userRouter = express.Router();

userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/resetPassword/:token")

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login)
userRouter.route("/:id").delete(deleteUser).patch(editUser);

module.exports = userRouter;