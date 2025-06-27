import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const courseEnroledSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        studentId: {
            type: String,
            required: true,
            ref: "Student",
        },
        courseId: {
            type: String,
            required: true,
            ref: "Course",
        },
        enrollmentDate: {
            type: Date,
            default: Date.now,
        },
        completionDate: {
            type: Date,
        },
        certificateId: {
            type: String,
            ref: "Certificate",
        },
        certificateUrl: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["enrolled", "completed", "dropped"],
            default: "enrolled",
        },
        isCertificateIssued: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
export const CourseEnroled = mongoose.model("CourseEnroled", courseEnroledSchema);