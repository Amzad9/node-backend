const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Name required"] },
    address: { type: String, default: null },
    landmark: { type: String, default: null },
    locality: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    pincode: { type: Number, default: null },
    location: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
    contact: { type: String, default: null },
    contactName: { type: String, default: null },
    deliveryCharge: { 
      baseCharge: {type: Number, default: 0},
      isFree: {type: Boolean, default: false},
      chargePerKm: {type: Number, default: 0},
      freeDeliveryTill: {type: Number, default: 0},
     },
    hoursConfiguration: { type: Array, default: [] },
    deliveryStatus: { type: Boolean, default: false },
    pickupStatus: { type: Boolean, default: false },
    image: { type: String, default: null },
    minCartAmount: { type: Number, default: 0 },
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
    deletedBy: { type: String, default: null },
    logs: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

Schema.index({ createdAt: -1 });

module.exports = mongoose.model("branch", Schema);
