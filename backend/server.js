const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const receiptRoutes = require("./routes/receiptRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});