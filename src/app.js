import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router imports
import studentRouter from "./routes/student.routes.js";
import certificateRouter from "./routes/certificate.routes.js";
import { globalErrorHandler } from "./middlewares/error-handler.middleware.js";
import courseRouter from "./routes/course.routes.js";
import courseEnroledRouter from "./routes/courseEnroled.routes.js";


// Routes
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/certificates", certificateRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/enrolment", courseEnroledRouter);

app.use(globalErrorHandler);

export default app;
