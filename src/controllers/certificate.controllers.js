import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { Certificate } from '../models/certificate.models.js';
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Course } from '../models/course.models.js';
import { Student } from '../models/student.models.js';
import { CourseEnroled } from '../models/courseEnroled.models.js';

const generateCertificate = asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    throw new ApiError(400, "Student ID and Course ID are required");
  }
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }
  if (student.isEmailVerified === false) {
    throw new ApiError(400, "Student email is not verified");
  }
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  const courseEnroled = await CourseEnroled.findOne({ studentId, courseId });
  if (!courseEnroled) {
    throw new ApiError(404, "Student is not enrolled in this course");
  }

  const existingCertificate = await Certificate.findOne({ studentId, courseId });
  if (existingCertificate) {
    throw new ApiError(400, "Certificate already exists for this student and course");
  }

  if (course.status !== 'completed') {
    throw new ApiError(400, "Course must be completed to generate a certificate");
  }

  const certificate = await Certificate.create({
    studentId,
    courseId,
    certificateUrl: `certificates/${Date.now()}-${studentId}-${courseId}.pdf`
  });

  // Create PDF
  const pdfDir = path.resolve("certificates");
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
  }
  const pdfPath = path.join(pdfDir, `${certificate.certificateNumber}.pdf`);

  const width = 672;
  const height = 520;
  const doc = new PDFDocument({ size: [width, height], margin: 0 });

  doc.pipe(fs.createWriteStream(pdfPath));
  let bgPath;
  if (course.courseType === 'online') {
    bgPath = path.resolve('./certificates/template2.jpg');
  } else {
    bgPath = path.resolve('./certificates/template1.jpg');
  }
  doc.image(bgPath, 0, 0, { width, height });
  doc.fontSize(16)
    .fillColor("#333333")
    .text(`Certificate No: ${certificate.certificateNumber}`, 40, 20, { align: 'center' });
  doc.fontSize(48)
    .fillColor("#224488")
    .text('CERTIFICATE', 0, 100, { align: 'center', characterSpacing: 2 });

  doc.fontSize(24)
    .fillColor("#666666")
    .text('OF COMPLETION', 0, 150, { align: 'center', characterSpacing: 2 });

  doc.fontSize(16)
    .fillColor("#666666")
    .text('This is to certify that', 0, 220, { align: 'center' });
  doc.fontSize(32)
    .fillColor('#224488')
    .text(student.name, 0, 250, { align: 'center' });

  const nameWidth = doc.widthOfString(student.name, { fontSize: 32 });
  const nameX = (width - nameWidth) / 2;
  doc.save()
    .moveTo(nameX, 285)
    .lineTo(nameX + nameWidth, 285)
    .lineWidth(2)
    .strokeColor('#224488')
    .stroke()
    .restore();

  doc.fontSize(16)
    .fillColor('#666666')
    .text('has successfully completed the course', 0, 300, { align: 'center' });

  doc.fontSize(24)
    .fillColor('#3366CC')
    .text(course.title, 0, 330, { align: 'center' });

  const formattedEndDate = course.endDate
    ? new Date(course.endDate).toLocaleDateString('en-IN') : '';
  doc.fontSize(14)
    .fillColor('#4b4848')
    .text(formattedEndDate, 80, height - 80);
  doc.fontSize(14)
    .fillColor('#666666')
    .text('Certified on', 80, height - 65);

  // Instructor signature line
  doc.save()
    .moveTo(width - 250, height - 90)
    .lineTo(width - 80, height - 90)
    .lineWidth(1)
    .strokeColor('#666666')
    .stroke()
    .restore();

  // Instructor name
  doc.fontSize(12)
    .fillColor('#666666')
    .text('Rakesh Kumar', width - 200, height - 80, { width: 120, align: 'center' });

  doc.fontSize(10)
    .fillColor('#666666')
    .text('Instructor', width - 200, height - 65, { width: 120, align: 'center' });

  doc.end();


  certificate.certificateUrl = pdfPath;
  await certificate.save();

  res.status(201).json(new ApiResponse(201, certificate, "Certificate generated successfully"));
});

const downloadCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id);
  if (!certificate) {
    throw new ApiError(404, "Certificate not found");
  }
  const pdfPath = certificate.certificateUrl;
  if (!fs.existsSync(pdfPath)) {
    throw new ApiError(404, "Certificate PDF not found");
  }
  res.download(pdfPath, `${certificate.certificateNumber}.pdf`, (err) => {
    if (err) {
      throw new ApiError(500, "Error downloading certificate");
    }
  });

});

const getAllCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find().populate("studentId", "name email").populate("courseId", "title description");
  if (!certificates || certificates.length === 0) {
    throw new ApiError(404, "No certificates found");
  }

  return res.status(200).json(new ApiResponse(200, certificates, "Certificates retrieved successfully"));
});




export {
  generateCertificate,
  getAllCertificates,
  downloadCertificate
};
