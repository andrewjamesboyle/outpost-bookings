const sgMail = require("@sendgrid/mail");

async function sendCustomEmailWithSendgrid(emailData) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: emailData.to,
    from: emailData.from,
    subject: emailData.subject,
    text: emailData.text,
    html: emailData.html,
  };

  try {
    const resp = await sgMail.send(msg);
    console.log("response from SG", resp[0].statusCode);
    console.log("Email sent");
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

module.exports = sendCustomEmailWithSendgrid;
