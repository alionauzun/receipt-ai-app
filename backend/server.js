require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); const receiptRoutes = require("./routes/receiptRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const insightRoutes = require("./routes/insightRoutes");
const aiRoutes = require("./routes/aiRoutes");
const advancedInsightsRoutes = require("./routes/advancedInsightsRoutes");
const basketRoutes = require("./routes/basketRoutes");
const comparisonRoutes = require("./routes/comparisonRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

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
app.use("/api/baskets", basketRoutes);
app.use("/api/comparisons", comparisonRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/notifications", notificationRoutes);


app.listen(3000, () => {
  console.log("Server running on port 3000");
});