const jwt = require("jsonwebtoken");
const Users = require("../Models/userModel");
const Role = require("../Models/roleModel");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, "bookStore2024", (err, user) => {
    if(!token){
        return res.status(403).send({
            message: "No token provided"
        });
    };

    if (err) {
      return res
        .status(403)
        .json({ message: "Token expired. Please sign in again" });
    }
    req.user = user;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  authenticateToken(req, res, async () => {
    const { authClaims } = req.user;
    const role = await Role.findById(authClaims[1].role[0]);
    const isAdmin = authClaims.some((claim) => role.name === "admin");

    if (isAdmin) {
      next(); 
    } else {
      res.status(403).json({ message: "You are not authorized!" }); 
    }
  });
};
module.exports = { authenticateToken, verifyAdmin };