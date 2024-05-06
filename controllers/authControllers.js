import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { User } from "../models/userModel.js";
import { nanoid } from "nanoid";

dotenv.config();
const { SECRET_KEY } = process.env;

const __dirname = dirname(fileURLToPath(import.meta.url));
const avatarsPath = path.join(__dirname, "..", "public", "avatars");

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Email verification",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click to verify your email</a>`,
    };
    await sendEmail(verifyEmail);

    res.status(201).json({
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "",
    });

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(400, "Missing required field email");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      subject: "Email verification",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click to verify your email</a>`,
    };
    await sendEmail(verifyEmail);

    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(201).json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const { path: tmpUpload, originalname } = req.file;

    const image = await Jimp.read(tmpUpload);
    await image.resize(250, 250);

    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsPath, filename);

    await image.writeAsync(resultUpload);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
