const mongoose = require("mongoose");

const BranchCustomPrice = {
  _id: false,
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "branch" },
  price: { type: Number, default: null },
  isActive: { type: Boolean, default: true },
  inStock: { type: Boolean, default: true },
};

const Schema = mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant_setting",
    },
    modifier: { type: mongoose.Schema.Types.ObjectId, ref: "modifier" },
    branches: [BranchCustomPrice],
    name: { type: String, required: [true, "Bad request"] },
    nameLocalized: { type: String, default: "" },
    sku: { type: String, default: "" },
    price: { type: Number, default: 0 },
    costingMethod: { type: Number, default: 1 },
    calories: { type: Number, default: 0 },
    selected: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
    logs: { type: String },
  },
  {
    timestamps: true,
  }
);
Schema.index({ restaurant: 1, modifier: -1 });

module.exports = mongoose.model("modifierOptions", Schema);
