const express = require("express");

const router = express.Router();

const User = require("../models/User");
const protect = require("../middleware/auth");

/*
====================================
SETUP MONTHLY BUDGET
====================================
*/
router.put("/setup-budget", protect, async (req, res) => {
  try {
    const { monthlyBudget } = req.body;

    if (!monthlyBudget) {
      return res.status(400).json({
        success: false,
        message: "Monthly budget is required",
      });
    }

    if (monthlyBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be greater than 0",
      });
    }

    const user = await User.findById(req.user._id);

    user.monthlyBudget = Number(monthlyBudget);
    user.budgetSetupCompleted = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Budget setup completed",
      monthlyBudget: user.monthlyBudget,
      budgetSetupCompleted: user.budgetSetupCompleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
====================================
GET USER PROFILE
====================================
*/
router.get("/me", protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;