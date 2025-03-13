import express from "express";
import {
  registerUser,
  loginUser,
  getCurrent,
  logoutUser
} from "../controllers/authController.js";

import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema),controllerWrapper(registerUser));

authRouter.post('/login', validateBody(loginSchema), controllerWrapper(loginUser));

authRouter.get('/current', authenticate, controllerWrapper(getCurrent));

authRouter.post('/logout', authenticate, controllerWrapper(logoutUser));

export default authRouter;