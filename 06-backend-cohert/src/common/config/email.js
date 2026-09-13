import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "your-email@example.com",
    pass: "your-email-password",
  },
});

const sendMail = async (to, subject, text, html) => {
  await transporter.sendMail({
    from: `${process.env.EMAIL_FROM}`,
    to,
    subject,
    text,
    html,
  });
};

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const subject = "Email Verification";
  const text = `Please verify your email by clicking the following link: ${verificationLink}`;
  const html = `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">${verificationLink}</a></p>`;
  await sendMail(email, subject, text, html);
};

export { sendMail, sendVerificationEmail };
