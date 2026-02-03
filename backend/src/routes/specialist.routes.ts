import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
    createSpecialist,
    deleteSpecialist,
    getAllPublishedSpecialist,
    getAllSpecialist,
    getSpecialistById,
    publishSpecialist,
    updateSpecialist,
} from "../controllers/specialist.controller";
import { validate } from "../middlewares/validation.middleware";
import {
    createSpecialistSchema,
    publishSpecialistSchema,
    updateSpecialistSchema,
} from "../validators/specialist.validator";

const router = Router();
//Guest Route
router.route("/all-published").get(getAllPublishedSpecialist);

router
    .route("/")
    .get(getAllSpecialist)
    .post(verifyToken, upload.array("images", 3), validate(createSpecialistSchema), createSpecialist);
router
    .route("/:id")
    .delete(verifyToken, deleteSpecialist)
    .get(verifyToken, getSpecialistById)
    .put(
        verifyToken,
        upload.fields([
            { name: "image0", maxCount: 1 },
            { name: "image1", maxCount: 1 },
            { name: "image2", maxCount: 1 },
        ]),
        validate(updateSpecialistSchema),
        updateSpecialist
    );
router.route("/publish").post(verifyToken, validate(publishSpecialistSchema), publishSpecialist);

export default router;
