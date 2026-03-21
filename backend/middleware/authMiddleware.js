const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey";

module.exports = (req, res, next) => {

  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {

    const token = authHeader.split(" ")[1];
    console.log("TOKEN EXTRACTED:", token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);
    // inject user dans la requête
    req.user = decoded;

    next();

  } catch (err) {
    console.error("Erreur d'authentification:", err.message);
    return res.status(401).json({ message: "Token invalide" });
  }

};