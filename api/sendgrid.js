const sgMail = require("@sendgrid/mail");

async function sendCustomEmailWithSendgrid(emailData) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: emailData.to,
    from: emailData.from,
    template_id: emailData.template_id,
    dynamic_template_data: emailData.dynamic_template_data,
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

async function sendErrorEmail(errorMsg) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("Attempting to send error email with data:", errorMsg);
  try {
    const resp = await sgMail.send(errorMsg);
    console.log("response from SG", resp[0].statusCode);
    console.log("Error alert email sent!");
  } catch (error) {
    console.log("sendErrorEmail Could not send error alert email:", error);
  }
}

module.exports = { sendCustomEmailWithSendgrid, sendErrorEmail };
