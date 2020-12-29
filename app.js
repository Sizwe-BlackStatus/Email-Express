const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");
const quotes = require("../Email/quotes");
const quoteList = quotes.inspirationQuotes;
const randomQuote = quoteList[Math.floor(Math.random() * quoteList.length)];
require("dotenv").config();

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("handle", { layout: false });
});
app.post("/send", (req, res) => {
  let recipientEmail = req.body.emailadd;
  let recipientName = req.body.firstName;
  let transporter = nodemailer.createTransport({
    service: "sendinblue",
    auth: {
      user: process.env.SMTP_LOGIN,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var mailOptions = {
    from: "sizwezakhe.masemola@umuzi.org",
    to: recipientEmail,
    subject: "Inspirational",
    text: randomQuote,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.render("handle", {
        successMsg: `Email successfully sent to ${recipientName}`,
        layout: false,
      });
    }
  });
});
app.listen(3000, () => console.log("Server initiated..."));
