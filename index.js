import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN, // Netlify domain
    methods: ["GET", "POST"],
  })
);

// Additional CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/api/sendmail", (req, res) => {
  const { name, from, message } = req.body;

  // Check if all required fields are provided
  if (!name || !from || !message) {
    return res.status(400).send("Name, from, and message are required.");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: process.env.EMAIL_USER, // list of receivers
    subject: `${name} sent a message from ${from}`, // Subject line
    html: `<pre>${message}</pre>`, // html body
  };

  const transporter = nodemailer.createTransport({
    service: "Gmail", // e.g., 'Gmail', 'Yahoo', 'Outlook'
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your email password or app-specific password
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("Error verifying email configuration", error);
      return res.status(500).send("Error verifying email configuration");
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email", error);
      return res.status(500).send("Error sending email");
    }
    console.log("Message sent: " + info.response);
    res.status(200).json({ message: "Email sent successfully", success: true });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
