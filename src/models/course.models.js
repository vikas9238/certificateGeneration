import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const courseSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    courseType: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      default: "online",
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "on-hold"],
      default: "not-started",
    },
  },
  { timestamps: true },
);

export const Course = mongoose.model("Course", courseSchema);
