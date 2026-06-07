const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const User = require("../models/User");
const Expense = require("../models/Expense");

/*
==================================
DASHBOARD SUMMARY
==================================
*/
router.get("/summary", protect, async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

   const expenses =
  await Expense.find({
    userId: req.user._id,
    expenseType: "personal",
  }).sort({
    createdAt: -1,
  });

    const totalSpent =
      expenses.reduce(
        (sum, expense) =>
          sum + expense.amount,
        0
      );

    const remainingBudget =
      user.monthlyBudget - totalSpent;

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

    const recentExpenses =
      expenses.slice(0, 5);

    /*
    ==================================
    BUDGET WARNING
    ==================================
    */

    let budgetWarning = null;

    if (usagePercentage >= 100) {
      budgetWarning =
        "🚨 Budget exceeded.";
    } else if (
      usagePercentage >= 90
    ) {
      budgetWarning =
        "⚠ Critical: You have used over 90% of your budget.";
    } else if (
      usagePercentage >= 75
    ) {
      budgetWarning =
        "⚠ Warning: You have used over 75% of your budget.";
    }

    /*
    ==================================
    TOP CATEGORY
    ==================================
    */

    const categoryTotals = {};

    expenses.forEach((expense) => {
      const category =
        expense.category || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        expense.amount;
    });

    let topCategory =
      "No Expenses Yet";

    let highestAmount = 0;

    Object.entries(
      categoryTotals
    ).forEach(
      ([category, amount]) => {
        if (
          amount > highestAmount
        ) {
          highestAmount =
            amount;

          topCategory =
            category;
        }
      }
    );

    /*
    ==================================
    AI RECOMMENDATION
    ==================================
    */

    let aiRecommendation =
      "Your spending looks healthy.";

   if (topCategory === "Food & Dining") {
  aiRecommendation =
    "Food & Dining is your highest spending category. Consider reducing restaurant expenses.";
} else if (topCategory === "Shopping") {
  aiRecommendation =
    "Shopping expenses are dominating your budget. Consider delaying non-essential purchases.";
} else if (topCategory === "Transportation") {
  aiRecommendation =
    "Transportation costs are high. Consider using more cost-effective travel options.";
} else if (topCategory === "Entertainment") {
  aiRecommendation =
    "Entertainment spending is high. Review subscriptions and leisure expenses.";
} else if (topCategory === "Investment") {
  aiRecommendation =
    "Investment is currently your highest spending category. Continue investing while maintaining adequate savings.";
} else if (topCategory === "Education") {
  aiRecommendation =
    "Education spending is contributing to your long-term growth and skill development.";
} else if (topCategory === "Bills") {
  aiRecommendation =
    "Bills are consuming a significant portion of your budget. Monitor recurring expenses carefully.";
}

    res.status(200).json({
      success: true,

      monthlyBudget:
        user.monthlyBudget,

      totalSpent,

      remainingBudget,

      usagePercentage,

      expenseCount:
        expenses.length,

      recentExpenses,

      budgetWarning,

      topCategory,

      aiRecommendation,
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