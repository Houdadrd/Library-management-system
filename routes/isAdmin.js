const Users = require("../Models/userModel"); 


// Middleware pour vérifier le rôle d'administrateur
const isAdmin = async (req, res, next) => {
  try {
    // Assurez-vous que le token est authentifié avant d'atteindre ce middleware
    // if (!req.user || !req.user.id) {
    //   return res.status(401).json({ message: "Authentication required" });
    // }

    // Récupérer les détails de l'utilisateur en utilisant l'ID extrait du token
    const user = await Users.findById(req.user.id).populate("roles");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Vérifier si l'utilisateur a le rôle d'administrateur
    const isAdmin = user.roles.some((role) => role.name === "admin");
    if (!isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = isAdmin;
