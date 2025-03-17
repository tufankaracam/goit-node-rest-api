import bcrypt from "bcrypt";
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const avatarPath = path.join("public", "avatars");

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

export async function uploadAvatar(req, res) {
  const { id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  await authServices.updateAvatar(id, newPath);

  res.status(200).json({
    avatarURL: newPath,
  });
}

export async function verify(req, res) {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await user.update({ verificationToken: null, verify: true });

  res.status(200).json({
    message: "Verification successful",
  });
}

export async function resendVerify(req, res) {
  const { email } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verificationToken = uuidv4();

  await user.update({ verificationToken });
  await authServices.resendVerify(email, verificationToken);

  res.status(200).json({
    message: "Verification email sent",
  });
}
