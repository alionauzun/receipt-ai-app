const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", async (req, res) => {
    console.log("REGISTER HIT");
    return authController.register(req, res);
  });
  
  router.post("/login", async (req, res) => {
    console.log("LOGIN HIT");
    return authController.login(req, res);
  });
  
module.exports = router;