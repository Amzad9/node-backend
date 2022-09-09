const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    restaurantId: {
      type: String,
      unique: true,
      required: [true, "Restaurant ID is required"],
    },
    restaurantName: {
      type: String,
      required: [true, "Restaurant Name is required"],
    },
    themeColor: { type: String },
    cuisine: { type: String },
    tax: { type: Number },
    deliveryTax: { type: Number },
    cancellationTime: { type: Number },
    avgPreparationTime: { type: Number },
    chatbotNumber: { type: String },
    dialCode: { type: String },
    rejectionNotes: { type: [mongoose.Schema.Types.Mixed] },
    complaintReason: { type: [mongoose.Schema.Types.Mixed], default: [] },
    customMessage: { type: mongoose.Schema.Types.Mixed, default: {} },
    coverImages: {
      type: [mongoose.Schema.Types.Mixed],
      ref: "imagekit",
      default: [],
    },
    logoImage: { type: String },
    coverImage: { type: String },
    status: { type: Boolean, default: true },
    onlinePayment: {
        type: Boolean, default: true
    },
    acceptOnlinePayment: {
        type: Boolean, default: true
    },
    tag: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive",
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imagekit",
      default: null,
    },
    cover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imagekit",
      default: null,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    uiSetting: { type: { bestseller: String } },
    integration: [{ type: mongoose.Schema.Types.ObjectId, ref: "integration" }],
    paymentMethod: [
      {
        slug: {
          type: String,
          lowercase: true,
          enum: ["method1", "method2"],
          unique: true,
          required: [true, "Payment method name is required"],
        },
        isActive: { type: Boolean, default: false },
        metaData: { type: mongoose.Schema.Types.Mixed, default: null },
      },
    ],
    appThemeColors: {
      primary: { type: String, default: "#323643" },
      secondary: { type: String, default: "#fe724c" },
      tertiary: { type: String, default: "#828282" },
      text: { type: String, default: "#515151" },
      button: { type: String, default: "#fe724c" },
      success: { type: String, default: "#2dd36f" },
      failure: { type: String, default: "#eb445a" },
      disabled: { type: String, default: "#5b5b5e" },
    },
  },
  {
    timestamps: true,
  }
);

Schema.index({ restaurantId: 1 });

module.exports = mongoose.model("restaurant_setting", Schema);
