import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { createSpecialist } from "../controllers/specialist.controller";
import { validate } from "../middlewares/validation.middleware";
import { createSpecialistSchema } from "../validators/specialist.validator";

const router = Router();

router.route("/create").post(upload.array("images", 3), validate(createSpecialistSchema), createSpecialist);

export default router;
