const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, default: null },
    contact: {
      type: String,
      unique: true,
      required: [true, "Phone number required"],
    },
    type: {
      type: String,
      enum: ["super_admin", "admin", "support"],
    },
    password: { type: String, required: [true, "Password cannot be empty."] },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

Schema.index({ contact: 1, createdAt: -1 });

module.exports = mongoose.model("admin", Schema);
