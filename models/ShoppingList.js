import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  unit: {
    type: String,
    default: "pza",
  },
});

const shoppingListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: () => `Lista ${new Date().toLocaleDateString()}`,
    },
    products: [productSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.ShoppingList ||
  mongoose.model("ShoppingList", shoppingListSchema);
