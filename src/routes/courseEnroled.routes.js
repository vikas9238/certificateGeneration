import { Router } from "express";
import { addEnrolment, getAllEnrolment, getEnrolmentDetails, updateEnrolmentDetails, getAllParticularCourseDetails } from "../controllers/courseEnroled.controllers.js";
const router = Router();

router.route("/add").post(addEnrolment);
router.route("/list").get(getAllEnrolment);
router.route("/:id").get(getEnrolmentDetails);
router.route("/:id").put(updateEnrolmentDetails);
router.route("/course/:courseId").get(getAllParticularCourseDetails);


export default router;
