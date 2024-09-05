const express = require("express");
const usersControllers = require("../Controllers/user-controller");
const routerUser = express.Router();
const { authenticateToken , verifyAdmin} = require("../routes/userAuth.js");

routerUser.post("/Signin", usersControllers.Signin);
routerUser.post("/Signup", usersControllers.Signup);
routerUser.get("/getUserInfo", authenticateToken, usersControllers.getUserInfo);

routerUser.post("/CreateUser", verifyAdmin,authenticateToken, usersControllers.CreateUser);
routerUser.post(
  "/CreateDeliveryMan",verifyAdmin,authenticateToken,usersControllers.CreateUser
);

// routerUser.get("/Users", usersControllers.getUsers);
// routerUser.get("/Users/:id", usersControllers.authenticateToken ,usersControllers.getUserById);
routerUser.put("/Users/:id", authenticateToken ,usersControllers.editUsers);
// routerUser.delete("/Users/:id", usersControllers.deleteUsers);

module.exports = routerUser;