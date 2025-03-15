import express from "express";
import {
  registerUser,
  loginUser,
  getCurrent,
  logoutUser,
  uploadAvatar,
  verify,
  resendVerify,
} from "../controllers/authController.js";
import { upload } from "../middlewares/upload.js";

import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema, verifySchema } from "../schemas/authSchema.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  controllerWrapper(registerUser)
);

authRouter.post(
  "/login",
  validateBody(loginSchema),
  controllerWrapper(loginUser)
);

authRouter.get("/current", authenticate, controllerWrapper(getCurrent));

authRouter.post("/logout", authenticate, controllerWrapper(logoutUser));

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  controllerWrapper(uploadAvatar)
);

authRouter.get('/verify/:verificationToken', controllerWrapper(verify));

authRouter.post('/verify', validateBody(verifySchema), controllerWrapper(resendVerify));

export default authRouter;
