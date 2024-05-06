import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "a.semonenko@meta.ua",
    pass: process.env.META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

export const sendEmail = async (data) => {
  const email = {
    ...data,
    from: "a.semonenko@meta.ua",
  };
  await transporter.sendMail(email);
  return true;
};
