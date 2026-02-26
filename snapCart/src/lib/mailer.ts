import nodemailer from "nodemailer";

//const nodemailer = require("nodemailer");

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string,
) => {
  const info = await transporter.sendMail({
    from: `"SnapCart <${process.env.EMAIL}>`, //'"Maddison Foo Koch" <maddison53@ethereal.email>',
    to, //: , // "bar@example.com, baz@example.com",
    subject, //: "Hello ✔",
    text, // : "Hello world?", // Plain-text version of the message
    html, // : "<b>Hello world?</b>", // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};
