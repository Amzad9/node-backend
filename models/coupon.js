const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is missing."] },
    couponCode: { type: String, required: [true, "Coupon code is missing."]  },
    description: { type: String, default: '' },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date, default: null },
    discount: { type: Number, default: 0 },
    type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    applicableAmount: { 
        minimumAmount: {type: Number, default: 0},
        maximumAmount: {type: Number, default: null}
    },
    maximumApplyCount: { type: Number, default: 0 },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
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

Schema.index({ couponCode: 1, createdAt: -1 });

module.exports = mongoose.model("coupon", Schema);
