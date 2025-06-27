import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { CourseEnroled } from "../models/courseEnroled.models.js";
import { Course } from "../models/course.models.js";
import { Student } from "../models/student.models.js";
import { asyncHandler } from "../utils/async-handler.js";

const addEnrolment = asyncHandler(async (req, res) => {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
        throw new ApiError(400, "Student ID and Course ID are required.");
    }

    const existingEnrolment = await CourseEnroled.findOne({ studentId, courseId });
    if (existingEnrolment) {
        throw new ApiError(400, "Student is already enrolled in this course.");
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
        throw new ApiError(404, "Course not found.");
    }

    const studentExists = await Student.findById(studentId);
    if (!studentExists) {
        throw new ApiError(404, "Student not found.");
    }

    const enrolment = await CourseEnroled.create({
        studentId,
        courseId,
        completionDate: courseExists.endDate,
    });

    if (!enrolment) {
        throw new ApiError(500, "Failed to create enrolment.");
    }

    res.status(201).json(new ApiResponse(201, enrolment, "Enrolment created successfully"));
});

const getAllEnrolment = asyncHandler(async (req, res) => {
    const enrolments = await CourseEnroled.find().populate('studentId courseId');

    if (!enrolments || enrolments.length === 0) {
        throw new ApiError(404, "No enrolments found.");
    }

    res.status(200).json(new ApiResponse(200, enrolments, "Enrolments retrieved successfully"));
});

const getEnrolmentDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const enrolment = await CourseEnroled.findById(id).populate('studentId courseId');
    if (!enrolment) {
        throw new ApiError(404, "Enrolment not found.");
    }
    res.status(200).json(new ApiResponse(200, enrolment, "Enrolment details retrieved successfully"));
});

const updateEnrolmentDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { courseId, status } = req.body;
    const enrolment = await CourseEnroled.findByIdAndUpdate(id, { courseId, status }, { new: true });

    if (!enrolment) {
        throw new ApiError(404, "Enrolment not found.");
    }
    res.status(200).json(new ApiResponse(200, enrolment, "Enrolment details updated successfully"));
});

const getAllParticularCourseDetails = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const enrolments = await CourseEnroled.find({ courseId }).populate('studentId');
    if (!enrolments || enrolments.length === 0) {
        throw new ApiError(404, "No enrolments found for this course.");
    }
    res.status(200).json(new ApiResponse(200, enrolments, "Enrolments for the course retrieved successfully"));
});

export {
    addEnrolment,
    getAllEnrolment,
    getEnrolmentDetails,
    updateEnrolmentDetails,
    getAllParticularCourseDetails
};