const mongoose = require("mongoose");

const imagekitSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    collectionId: { type: String, required: [true, "ItemId required"] },
    imagekit: {
      fileId: { type: String },
      name: { type: String },
      size: { type: Number },
      filePath: { type: String },
      url: { type: String },
      fileType: { type: String },
      height: { type: Number },
      width: { type: Number },
      orientation: { type: Number },
      thumbnailUrl: { type: String },
    },
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("imagekit", imagekitSchema);
