import { Router } from "express";
import { registerStudent, verifyEmail, getAllStudent, getStudentDetails, updateStudentDetails, deleteStudent, resendEmailVerification } from "../controllers/student.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { studentRegisterValidator } from "../validators/index.js";


const router = Router();

router.route("/register")
    .post(studentRegisterValidator(), validate, registerStudent);

router.route("/verify/:token")
    .get(verifyEmail);

router.route("/list")
    .get(getAllStudent);

router.route("/:id")
    .get(getStudentDetails);

router.route("/:id")
    .put(studentRegisterValidator(), validate, updateStudentDetails);

router.route("/:id")
    .delete(deleteStudent);

router.route("/resend-email")
    .post(resendEmailVerification);

export default router;
