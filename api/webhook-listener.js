const generateAccessLinkWithKisi = require("./kisi");
const sendCustomEmailWithSendgrid = require("./sendgrid");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  console.log("request body", req.body);

  // Parse incoming booking data
  //   const bookingData = req.body;

  // Generate access link with Kisi API
  //   const accessLink = await generateAccessLinkWithKisi(bookingData);

  // Send custom email with SendGrid API
  //   await sendCustomEmailWithSendgrid(bookingData, accessLink);

  // Send response back to Optix
  res.status(200).send("Handled the booking!");
};
