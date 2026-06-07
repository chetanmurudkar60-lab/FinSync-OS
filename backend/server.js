const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const expenseRoutes = require("./routes/expenses");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const dashboardRoutes = require("./routes/dashboard");
const analyticsRoutes =
  require("./routes/analyticsRoutes");
const familyRoutes =
  require("./routes/familyRoutes");
// Connect MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Smart Finance Tracker Backend Running 🚀",
  });
});

app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(
  "/api/family",
  familyRoutes
);
app.use(
  "/api/analytics",
  analyticsRoutes
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});