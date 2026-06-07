const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

const Family = require("../models/Family");
const User = require("../models/User");
const Expense = require("../models/Expense");

/*
==================================
CREATE FAMILY
==================================
*/
router.post("/create", protect, async (req, res) => {
  try {
    const { familyName, familyBudget } = req.body;

    if (!familyName) {
      return res.status(400).json({
        success: false,
        message: "Family name is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (user.familyId) {
      return res.status(400).json({
        success: false,
        message:
          "You are already a member of a family",
      });
    }

    const inviteCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const family = await Family.create({
      familyName,
      familyBudget: familyBudget || 0,
      ownerId: req.user._id,
      inviteCode,
      members: [req.user._id],
    });

    user.familyId = family._id;

    await user.save();

    res.status(201).json({
      success: true,
      message: "Family created successfully",
      family,
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
JOIN FAMILY
==================================
*/
router.post("/join", protect, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const family = await Family.findOne({
      inviteCode,
    });

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite code",
      });
    }

    const user = await User.findById(req.user._id);

    if (user.familyId) {
      return res.status(400).json({
        success: false,
        message:
          "You already belong to a family",
      });
    }

    family.members.push(user._id);

    await family.save();

    user.familyId = family._id;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Joined family successfully",
      family,
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
GET MY FAMILY
==================================
*/
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user.familyId) {
      return res.status(404).json({
        success: false,
        message:
          "You are not part of any family",
      });
    }

    const family = await Family.findById(
      user.familyId
    )
      .populate(
        "members",
        "name email"
      )
      .populate(
        "ownerId",
        "name email"
      );

    res.status(200).json({
      success: true,
      family,
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
FAMILY DASHBOARD
==================================
*/
router.get(
  "/dashboard",
  protect,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      if (!user.familyId) {
        return res.status(404).json({
          success: false,
          message:
            "You are not part of any family",
        });
      }

      const family =
        await Family.findById(
          user.familyId
        )
          .populate(
            "members",
            "name email"
          )
          .populate(
            "ownerId",
            "name email"
          );

      const familyExpenses =
        await Expense.find({
          familyId:
            user.familyId,
          expenseType:
            "family",
        })
          .populate(
            "userId",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      const totalSpent =
        familyExpenses.reduce(
          (sum, expense) =>
            sum +
            expense.amount,
          0
        );

      const remainingBudget =
        family.familyBudget -
        totalSpent;

      res.status(200).json({
        success: true,

        familyName:
          family.familyName,

        familyBudget:
          family.familyBudget,

        totalSpent,

        remainingBudget,

        inviteCode:
          family.inviteCode,

        members:
          family.members,

        expenses:
          familyExpenses,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);
module.exports = router;