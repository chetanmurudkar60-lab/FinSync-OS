const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");
const protect = require("../middleware/auth");

const User = require("../models/User");

const { categorizeExpense } = require("../services/aiCategorizer");
/*
==================================
GET ALL EXPENSES (CURRENT USER)
==================================
*/
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
==================================
GET SINGLE EXPENSE
==================================
*/
router.get("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
==================================
CREATE EXPENSE
==================================
/*
==================================
CREATE EXPENSE
==================================
*/
router.post("/", protect, async (req, res) => {
  try {
    const {
      amount,
      description,
      expenseType = "personal",
    } = req.body;

    if (!amount || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Amount and description are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Amount must be greater than 0",
      });
    }

    const aiResult =
      await categorizeExpense(
        description
      );

    const user =
      await User.findById(
        req.user._id
      );

    let familyId = null;

    if (expenseType === "family") {
      if (!user.familyId) {
        return res.status(400).json({
          success: false,
          message:
            "You are not part of any family",
        });
      }

      familyId = user.familyId;
    }

    const expense =
      await Expense.create({
        userId: req.user._id,

        familyId,

        expenseType,

        amount,

        description,

        category:
          aiResult.category || "Other",

        aiConfidence:
          aiResult.confidence || 0,

        aiInsight:
          aiResult.insight || "",
      });

    const expenses =
      await Expense.find({
        userId: req.user._id,
      });

    const totalSpent =
      expenses.reduce(
        (sum, item) =>
          sum + item.amount,
        0
      );

    const usagePercentage =
      user.monthlyBudget > 0
        ? (
            (totalSpent /
              user.monthlyBudget) *
            100
          ).toFixed(2)
        : 0;

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

    res.status(201).json({
      success: true,
      message:
        "Expense created successfully",

      expense,

      aiAnalysis: {
        category:
          aiResult.category,
        confidence:
          aiResult.confidence,
        insight:
          aiResult.insight,
      },

      budget: {
        monthlyBudget:
          user.monthlyBudget,
        totalSpent,
        usagePercentage,
        warning:
          budgetWarning,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
==================================
UPDATE EXPENSE
==================================
*/
router.put("/:id", protect, async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    let expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        amount,
        description,
        category,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
==================================
DELETE EXPENSE
==================================
*/
router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;