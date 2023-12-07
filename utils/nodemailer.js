const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.APP_PASS,
    },
  });

  const mailOptions = {
    from: {
      name: "Cafe Manager",
      address: process.env.USER_EMAIL,
    },
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

module.exports = { sendEmail };
