const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    monthlyBudget: {
      type: Number,
      default: 0,
    },

    budgetSetupCompleted: {
      type: Boolean,
      default: false,
    },
    familyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      default: null,
    },
    currency: {
      type: String,
      default: "INR",
    },

    preferences: {
      theme: {
        type: String,
        default: "light",
      },

      notifications: {
        type: Boolean,
        default: true,
      },

      language: {
        type: String,
        default: "en",
      },
    },

    loginHistory: [
      {
        timestamp: Date,
        ip: String,
        device: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);