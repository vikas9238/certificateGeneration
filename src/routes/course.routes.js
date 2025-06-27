import { Router } from "express";
import { addCourse, getAllCourse, getCourseDetails, updateCourseDetails } from "../controllers/course.controllers.js";
const router = Router();

router.route("/add").post(addCourse);
router.route("/list").get(getAllCourse);
router.route("/:id").get(getCourseDetails);
router.route("/:id").put(updateCourseDetails);

export default router;
