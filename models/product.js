const mongoose = require("mongoose");

const BranchCustomPrice = {
  _id: false,
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "branch" },
  price: { type: Number, default: null },
  isActive: { type: Boolean, default: true },
  inStock: { type: Boolean, default: true },
};

const Modifiers = {
  _id: false,
  modifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "modifier",
    required: [true, "Modifier is required"],
  },
  pivot: { 
    minimum_options: {type: Number, default: 1},
    maximum_options: {type: Number, default: 1},
    index: {type: Number, default: 0},
    free_options: {type: Number, default: 0},
    default_options_ids: {type: mongoose.Schema.Types.Mixed, default: []},
    excluded_options_ids: {type: mongoose.Schema.Types.Mixed, default: []},
    is_splittable_in_half: {type: Boolean, default: false},
    unique_options: {type: Boolean, default: false},
   },
};

const menuSchema = mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category is missing."],
    },
    name: { type: String, required: [true, "Name is missing."] },
    maximumPrice: { type: Number, required: [true, "Maximum price is missing"] },
    sellingPrice: { type: Number, required: [true, "Selling price is missing"] },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    imageKit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imagekit",
      default: null,
    },
    coverImageKit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imagekit",
      default: null,
    },
    sellingMethod: { type: Number, enum: [1, 2], default: 1 }, // 1 for Unit, 2 for Weight
    costingMethod: { type: Number, enum: [1, 2], default: 1 }, // 1 for Fixed, 2 for Ingredients
    bestSeller: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    sizes: { type: mongoose.Schema.Types.ObjectId, ref: "size" },
    colors: { type: mongoose.Schema.Types.ObjectId, ref: "color" },
    brands: { type: mongoose.Schema.Types.ObjectId, ref: "brand" },
    coupons: { type: mongoose.Schema.Types.ObjectId, ref: "coupon" },
    materials: { type: mongoose.Schema.Types.ObjectId, ref: "material" },
    reviews: { type: mongoose.Schema.Types.ObjectId, ref: "review" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
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

menuSchema.index({ restaurant: 1, group: 1 });

module.exports = mongoose.model("product", menuSchema);
