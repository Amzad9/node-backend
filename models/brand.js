const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is missing."] },
    description: { type: String, default: null },
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
  },
  {
    timestamps: true,
  }
);

Schema.index({ createdAt: -1 });

module.exports = mongoose.model("brand", Schema);
