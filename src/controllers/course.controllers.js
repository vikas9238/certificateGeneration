import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Course } from "../models/course.models.js";

const addCourse = asyncHandler(async (req, res) => {
    const { title, description, duration, startDate, endDate, courseType } = req.body;

    if (!title || !duration || !startDate || !endDate) {
        throw new ApiError(400, "Title, duration, start date, and end date are required.");
    }
    if (new Date(startDate) >= new Date(endDate)) {
        throw new ApiError(400, "Start date must be before end date.");
    }
    const course = await Course.create({
        title,
        description,
        duration,
        startDate,
        endDate,
        courseType,
    });

    if (!course) {
        throw new ApiError(500, "Failed to create course.");
    }

    res.status(201).json(new ApiResponse(201, course, "Course created successfully"));
});

const getAllCourse = asyncHandler(async (req, res) => {
    const courses = await Course.find();
    if (!courses || courses.length === 0) {
        throw new ApiError(404, "No courses found.");
    }
    res.status(200).json(new ApiResponse(200, courses, "Courses retrieved successfully"));
});

const getCourseDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
        throw new ApiError(404, "Course not found.");
    }
    res.status(200).json(new ApiResponse(200, course, "Course details retrieved successfully"));
});

const updateCourseDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, duration, startDate, endDate, status } = req.body;

    const course = await Course.findByIdAndUpdate(
        id,
        { title, description, duration, startDate, endDate, status },
        { new: true }
    );

    if (!course) {
        throw new ApiError(404, "Course not found.");
    }

    res.status(200).json(new ApiResponse(200, course, "Course updated successfully"));
});
export {
    addCourse,
    getAllCourse,
    getCourseDetails,
    updateCourseDetails
};