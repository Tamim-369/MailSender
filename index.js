import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.post("/api/sendmail", (req, res) => {
  const { name, from, message } = req.body;

  // Check if all required fields are provided
  if (!name || !from || !message) {
    return res.status(400).send("Name, from, and message are required.");
  }

  const mailOptions = {
    from: "ashiqurrahmantamim369@gmail.com", // sender address
    to: "ashiqurrahmantamim369@gmail.com", // list of receivers
    subject: `${name} sent a message from ${from}`, // Subject line
    html: `<pre>${message}</pre>`, // html body
  };

  const transporter = nodemailer.createTransport({
    service: "Gmail", // e.g., 'Gmail', 'Yahoo', 'Outlook'
    auth: {
      user: "ashiqurrahmantamim369@gmail.com", // your email
      pass: "lirf mmzf xgvm dzlz", // your email password or app-specific password
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error sending email");
    }
    console.log("Message sent: " + info.response);
    res.status(200).send("Email sent successfully");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
