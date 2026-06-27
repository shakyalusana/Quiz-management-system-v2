import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
  throw new Error("SMTP config missing in .env");
}

if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
  throw new Error("SMTP auth config missing in .env");
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
