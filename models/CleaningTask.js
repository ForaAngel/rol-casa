import mongoose from "mongoose";

const cleaningTaskSchema = new mongoose.Schema({
  task: {
    type: String,
    enum: [
      "barrido",
      "trapeado",
      "estufa",
      "bano",
      "basura",
      "patio",
      "popo de perros",
    ],
    required: true,
  },
  assignedTo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models?.CleaningTask ||
  mongoose.model("CleaningTask", cleaningTaskSchema);
