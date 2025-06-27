import { Student } from "../models/student.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import crypto from "crypto";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail.js";

const registerStudent = asyncHandler(async (req, res) => {
  const { email, name, mobile } = req.body;

  const checkStudent = await Student.findOne({ email });

  if (checkStudent) {
    throw new ApiError(400, "Student already exists");
  }

  const student = await Student.create({
    email,
    name,
    mobile
  });

  const token = student.generateTemporaryToken();
  student.emailVerificationToken = token.hashedToken;
  student.emailVerificationExpiry = token.tokenExpiry;
  await student.save();

  if (!student) {
    throw new ApiError(500, "Failed to register student");
  }

  await sendEmail({
    email,
    subject: "Email Verification",
    mailgenContent: emailVerificationMailgenContent(
      name,
      `${process.env.BASE_URL}/api/v1/students/verify/${token.unHashedToken}`
    )
  });

  const createdStudent = await Student.findById(student._id).select(
    "-emailVerificationToken -emailVerificationExpiry"
  );

  if (!createdStudent) {
    throw new ApiError(500, "Failed to retrieve created student details");
  }

  return res.status(201).json(new ApiResponse(201, createdStudent, "Student registered successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(404, "Invalid token.");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const student = await Student.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!student) {
    throw new ApiError(403, "Invalid token or Link Expire.");
  }

  student.emailVerificationToken = undefined;
  student.emailVerificationExpiry = undefined;
  student.isEmailVerified = true;
  await student.save();

  return res.status(201).json(new ApiResponse(201, "You verified successfully."));


});

const getAllStudent = asyncHandler(async (req, res) => {
  const students = await Student.find().select("-emailVerificationToken -emailVerificationExpiry");

  if (!students || students.length === 0) {
    throw new ApiError(404, "No students found");
  }

  return res.status(200).json(new ApiResponse(200, students, "Students retrieved successfully"));
});

const getStudentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id).select("-emailVerificationToken -emailVerificationExpiry");

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res.status(200).json(new ApiResponse(200, student, "Student details retrieved successfully"));
});

const updateStudentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email, name, mobile } = req.body;

  const checkStudent = await Student.findOne({ email });

  if (checkStudent) {
    throw new ApiError(400, "Email already exists");
  }

  const student = await Student.findByIdAndUpdate(id, { email, name, mobile }, { new: true, runValidators: true });
  if (!student) {
    throw new ApiError(404, "Student not found");
  }
  return res.status(200).json(new ApiResponse(200, student, "Student details updated successfully"));
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findByIdAndDelete(id);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "Student deleted successfully"));
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const student = await Student.findOne({ email });

  if (!student) {
    throw new ApiError(401, "Email is not register, Please sign up.");
  }

  if (student.isEmailVerified) {
    throw new ApiError(400, "Your email are already verified, please login");
  }
  const token = student.generateTemporaryToken();
  student.emailVerificationToken = token.hashedToken;
  student.emailVerificationExpiry = token.tokenExpiry;

  await student.save();

  await sendEmail({
    email,
    subject: "Verify Your Email",
    mailgenContent: emailVerificationMailgenContent(
      student.name,
      `${process.env.BASE_URL}/api/v1/students/verify/${token.unHashedToken}`,
    )
  });

  return res.status(200).json(new ApiResponse(200, "Verification Email Send."))


});

export {
  registerStudent,
  verifyEmail,
  getAllStudent,
  getStudentDetails,
  updateStudentDetails,
  deleteStudent,
  resendEmailVerification
};
