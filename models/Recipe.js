import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["desayuno", "comida", "cena"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ingredients: [String],
  notes: String,
});

const daySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  meals: [mealSchema],
});

const weeklyRecipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekStart: {
      type: Date,
      required: true,
    },
    weekEnd: {
      type: Date,
      required: true,
    },
    days: [daySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.WeeklyRecipe ||
  mongoose.model("WeeklyRecipe", weeklyRecipeSchema);
