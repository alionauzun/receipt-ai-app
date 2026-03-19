const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey";

exports.register = async (req, res) => {

  const { email, password } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1,$2) RETURNING id,email",
      [email, hashedPassword]
    );

    res.json({
      message: "User created",
      user: result.rows[0]
    });

  } catch (err) {

    if (err.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ error: err.message });
  }

};
exports.login = async (req, res) => {
    console.log("BODY:", req.body);
    if (!req.body) {
        return res.status(400).json({ message: "Request body missing" });
      }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
  
    try {
  
      const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );
  
      if (result.rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }
  
      const user = result.rows[0];
  
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
  
      res.json({
        message: "Login success",
        token
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  
  };
  