import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, refreshTokenController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { signInSchema } from "../validators/auth.validator";

const router = Router();

router.route("/signin").post(validate(signInSchema), loginUser);
router.route("/session").get(getCurrentUser);
router.route("/refresh-session").post(refreshTokenController);
router.route("/logout").post(logoutUser);

export default router;
