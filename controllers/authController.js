import bcrypt from "bcrypt";
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email: email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await authServices.registerUser({
    email,
    password: hashPassword,
  });

  res.status(201).json({
    email: result.email,
    subscription: result.subscription,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (checkPassword) {
    const token = createToken({ email });
    await user.update({ token });
    res.status(200).json({
      token,
    });
  } else {
    throw HttpError(401, "Email or password is wrong");
  }
};

export function getCurrent(req, res) {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
}

export async function logoutUser(req, res) {
  const { id } = req.user;
  await authServices.logoutUser(id);

  res.status(204).json({
    message: "Logged out",
  });
}
