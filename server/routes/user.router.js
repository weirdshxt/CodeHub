const express = require("express");
const userContro = require("../controllers/userContro");

const userRouter = express.Router();

userRouter.get("/allUsers", userContro.getAllUsers);
userRouter.post("/signup", userContro.signUp);
userRouter.post("/login", userContro.login);
userRouter.get("/profile/:id", userContro.getUserProfile);
userRouter.put("/profile/:id", userContro.updateUserProfile);
userRouter.delete("/profile/delete/:id", userContro.deleteUserProfile);

module.exports = userRouter;