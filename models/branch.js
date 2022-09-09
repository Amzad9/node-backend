const mongoose = require("mongoose");

const branchSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    restaurantId: { type: String, required: [true, "RestaurantId required"] },
    name: { type: String, required: [true, "Branch name required"] },
    address: { type: String, required: [true, "Address required"] },
    landmark: { type: String },
    locality: { type: String, required: [true, "Locality required"] },
    city: { type: String, required: [true, "City required"] },
    state: { type: String, required: [true, "State required"] },
    country: { type: String, required: [true, "Country required"] },
    pincode: { type: String, required: [true, "Pincode required"] },
    location: { type: JSON, require: true },
    contactName: { type: String, require: false },
    deliveryCharge: { type: mongoose.Schema.Types.Mixed },
    createdOn: { type: Date, default: Date.now() },
    status: { type: String, default: "on" },
    hoursconfiguration: { type: Array, default: [] },
    disabled: { type: String },
    deliveryStatus: { type: Boolean, default: false },
    pickupStatus: { type: Boolean, default: false },
    branchImage: { type: String },
    minCartAmount: { type: String, default: "0" },
    maxCashAccepted: { type: Number },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imagekit",
      default: null,
    },
    contact: {
      type: String,
      unique: true,
      required: [true, "Phone number required"],
    },
    dialCode: { type: String, required: [true, "Dial code required"] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("branch", branchSchema);
