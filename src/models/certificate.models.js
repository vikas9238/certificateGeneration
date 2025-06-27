import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";

const certificateSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    studentId: {
      type: String,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: String,
      ref: "Course",
      required: true,
    },
    certificateNumber: {
      type: String,
      unique: true,
      trim: true,
      default: () => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}${mm}${dd}`;
        const alphanumeric = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `CERT-${dateStr}-${alphanumeric}`;
      }
    },
    certificateUrl: {
      type: String,
      required: true,
      trim: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// certificateSchema.post("save", async function (next) {
//   if (!this.isModified("certificateNumber")) return next();
//   const pdfDir = path.resolve("certificates");
//   if (!fs.existsSync(pdfDir)) {
//     fs.mkdirSync(pdfDir);
//   }
//   const pdfPath = path.join(pdfDir, `${this.certificateNumber}.pdf`);

//   // Create PDF
//   const docPdf = new PDFDocument();
//   docPdf.pipe(fs.createWriteStream(pdfPath));
//   docPdf.fontSize(20).text("Certificate of Completion", { align: "center" });
//   docPdf.moveDown();
//   docPdf.fontSize(14).text(`Certificate Number: ${this.certificateNumber}`);
//   docPdf.text(`Student ID: ${this.studentId}`);
//   docPdf.text(`Course ID: ${this.courseId}`);
//   docPdf.text(`Issued At: ${this.issuedAt}`);
//   docPdf.end();
//   next();
// });

export const Certificate = mongoose.model("Certificate", certificateSchema);
