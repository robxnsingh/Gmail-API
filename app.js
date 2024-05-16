const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

async function sendMail() {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "web.studybuddy@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: "StudyBuddy <web.studybuddy@gmail.com>",
      to: "robin007hill@gmail.com",
      subject: "Hello from gmail using API ✔",
      text: "Hello from gmail email using google APIs",
      html: "<h1>Hello from gmail email using google APIs </h1>",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    // Check if the error is due to non-existent email
    if (
      error &&
      error.responseCode === 550 &&
      error.response.includes("Mailbox not found")
    ) {
      console.error("Email does not exist");
      throw new Error("Email does not exist");
    } else {
      console.error("Error sending email:", error);
      throw error; // throw other errors
    }
  }
}

sendMail()
  .then((result) => console.log("Email sent...", result))
  .catch((error) => console.log(error.message));
