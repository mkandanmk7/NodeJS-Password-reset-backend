const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "muthutest789@gmail.com",
      pass: "MUTHUtest789**$",
    },
  });

  var mailOptions = {
    from: "muthutest789@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error in sending mail", error);
    } else {
      console.log("Email sent : " + info.response);
    }
  });
};

module.exports = sendMail;
