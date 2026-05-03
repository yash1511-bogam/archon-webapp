import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import type { ReactElement } from "react";

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: Number(process.env.PORT) || 587,
  secure: Number(process.env.PORT) === 465,
  auth: { user: process.env.USER, pass: process.env.PASSWORD },
});

export async function sendEmail({ to, subject, template }: { to: string; subject: string; template: ReactElement }) {
  const html = await render(template);
  const text = await render(template, { plainText: true });
  return transporter.sendMail({
    from: '"Archon" <noreply@efficientai.in>',
    replyTo: "hello@yashbogam.me",
    to,
    subject,
    html,
    text,
  });
}
