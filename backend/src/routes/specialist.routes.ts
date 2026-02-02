import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { createSpecialist, publishSpecialist } from "../controllers/specialist.controller";
import { validate } from "../middlewares/validation.middleware";
import { createSpecialistSchema, publishSpecialistSchema } from "../validators/specialist.validator";

const router = Router();

router
    .route("/create")
    .post(verifyToken, upload.array("images", 3), validate(createSpecialistSchema), createSpecialist);

router.route("/publish").post(verifyToken, validate(publishSpecialistSchema), publishSpecialist);

export default router;
