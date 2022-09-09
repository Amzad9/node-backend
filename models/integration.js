const mongoose = require("mongoose");

const integrationSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant_setting",
    },
    name: { type: String, required: [true, "Integration name required"] },
    apiKey: { type: String, default: null },
    clientId: { type: String, default: null },
    secretKey: { type: String, default: null },
    redirectUri: { type: String, default: null },
    state: { type: String, default: null },
    oauthToken: { type: String, default: null },
    tokenType: { type: String, default: null },
    expiresIn: { type: Number, default: null },
    slug: { type: String, required: [true, "Type is required"] },
    additionalData: [
      {
        key: { type: String, default: null },
        value: { type: mongoose.Schema.Types.Mixed, default: null },
      },
    ],
    isActive: { type: Boolean, default: false },
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("integration", integrationSchema);
