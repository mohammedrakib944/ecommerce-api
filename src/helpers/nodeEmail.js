const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");
const createError = require("http-errors");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

// send email
const sendEmailWithNodeMailer = async (emailData) => {
  const { email, subject, html } = emailData;
  try {
    const mailOptions = {
      from: smtpUsername, // sender address
      to: email,
      subject: subject,
      html,
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("Response: ", response);
  } catch (err) {
    console.log("Nodemailer: ", err);
    throw createError("Cann't send mail!");
  }
};

module.exports = sendEmailWithNodeMailer;
