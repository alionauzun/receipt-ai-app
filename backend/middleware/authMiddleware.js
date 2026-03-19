const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey";

module.exports = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // inject user dans la requête
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }

};