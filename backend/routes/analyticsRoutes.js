const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const User = require("../models/User");
const Expense = require("../models/Expense");

router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    const expenses =
      await Expense.find({
        userId: req.user._id,
        expenseType: "personal",
      });

    const totalSpent =
      expenses.reduce(
        (sum, expense) =>
          sum + expense.amount,
        0
      );

    const remaining =
      user.monthlyBudget -
      totalSpent;

    const usagePercentage =
      user.monthlyBudget > 0
        ? Number(
            (
              (totalSpent /
                user.monthlyBudget) *
              100
            ).toFixed(2)
          )
        : 0;

    // Category Breakdown

    const categoryMap = {};

    expenses.forEach((expense) => {
      const category =
        expense.category || "Other";

      categoryMap[category] =
        (categoryMap[category] || 0) +
        expense.amount;
    });

    const categoryBreakdown =
      Object.entries(
        categoryMap
      ).map(
        ([category, amount]) => ({
          category,
          amount,
        })
      );

    // Top Category

    let topCategory = {
      category:
        "No Expenses Yet",
      amount: 0,
    };

    categoryBreakdown.forEach(
      (item) => {
        if (
          item.amount >
          topCategory.amount
        ) {
          topCategory = item;
        }
      }
    );

    // AI Insights

    const aiInsights = [];

    if (
      topCategory.category !==
      "No Expenses Yet"
    ) {
      aiInsights.push(
        `${topCategory.category} is your highest spending category.`
      );
    }

    if (
      usagePercentage < 50
    ) {
      aiInsights.push(
        "Your budget usage is healthy."
      );
    }

    if (
      usagePercentage >= 75
    ) {
      aiInsights.push(
        "You are approaching your budget limit."
      );
    }

    res.status(200).json({
      success: true,

      budget:
        user.monthlyBudget,

      totalSpent,

      remaining,

      usagePercentage,

      topCategory,

      categoryBreakdown,

      aiInsights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
});

module.exports = router;