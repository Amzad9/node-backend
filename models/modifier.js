const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant_setting",
      required: [true, "Restaurant is missing."],
    },
    options: [{ type: mongoose.Schema.Types.ObjectId, ref: "modifierOptions" }],
    reference: { type: String, default: null },
    name: { type: String, required: [true, "Modifier name is missing."] },
    nameLocalized: { type: String, default: null },
    source: { type: Number, enum: [1, 2], default: 1 },
    order: { type: Number },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
    logs: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);
Schema.index({ restaurant: 1, createdAt: -1 });

module.exports = mongoose.model("modifier", Schema);
