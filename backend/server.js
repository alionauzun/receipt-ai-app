require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); const receiptRoutes = require("./routes/receiptRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const insightRoutes = require("./routes/insightRoutes");
const aiRoutes = require("./routes/aiRoutes");
const advancedInsightsRoutes = require("./routes/advancedInsightsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/advanced-insights", advancedInsightsRoutes);


app.listen(3000, () => {
  console.log("Server running on port 3000");
});