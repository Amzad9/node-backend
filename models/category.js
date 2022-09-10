const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant_setting",
      required: [true, "Restaurant is missing."],
    },
    reference: { type: String, default: null },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    name: { type: String, required: [true, "Name is missing."] },
    nameLocalized: { type: String, default: null },
    description: { type: String, default: null },
    descriptionLocalized: { type: String, default: null },
    order: { type: Number },
    source: { type: Number, enum: [1, 2], default: 1 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null },
    logs: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

Schema.index({ restaurant: 1, createdAt: -1 });

module.exports = mongoose.model("category", Schema);
