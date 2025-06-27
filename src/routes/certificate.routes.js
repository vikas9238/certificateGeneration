import { Router } from "express";
import { downloadCertificate, getAllCertificates, generateCertificate } from "../controllers/certificate.controllers.js";

const router = Router()

router.route("/generate")
    .post(generateCertificate);

router.route("/download/:id")
    .get(downloadCertificate);

router.route("/list")
    .get(getAllCertificates);

export default router