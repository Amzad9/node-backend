const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    auth: { type: String, default: null },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      default: null,
    },
    settings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant_setting",
      default: null,
    },
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, default: null },
    contact: {
      type: String,
      unique: true,
      required: [true, "Phone number required"],
    },
    dialCode: { type: String, required: [true, "Dial code required."] },
    type: {
      type: String,
      enum: ["owner", "manager", "driver", "support"],
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

adminSchema.index({ settings: 1, createdAt: -1 });

module.exports = mongoose.model("admin", adminSchema);
