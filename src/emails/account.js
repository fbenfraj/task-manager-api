const sgMail = require("@sendgrid/mail");

const sendGridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "orugaknight@gmail.com",
    subject: "Welcome to TaskApp!",
    text: `Welcome to TaskApp, ${name}! Let me know how you get along with it!`,
    // html: ''
  });
};

const sendGoodByeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "orugaknight@gmail.com",
    subject: "We're sad to see you go :(",
    text: `We're sad to see you go, ${name}... is there anything we could've done to keep you on board?`,
  });
};

module.exports = { sendWelcomeEmail, sendGoodByeEmail };
