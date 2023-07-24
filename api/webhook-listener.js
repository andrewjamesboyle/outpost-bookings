const generateAccessLinkWithKisi = require("./kisi");
const sendCustomEmailWithSendgrid = require("./sendgrid");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // TO DO: Add validation for incoming data

  // Parse incoming booking data
  const bookingData = req.body;
  console.log("bookingData", req.body);

  // Generate access link with Kisi API
  const accessLink = await generateAccessLinkWithKisi(bookingData);
  console.log("accessLink", accessLink);

  // Build object to pass required info to SendGrid
  const emailData = {
    to: bookingData.member_email,
    from: "logan@outpost.hr",
    subject: "Booking Confirmation",
    text: `Hello ${bookingData.member_name}. Your booking has been confirmed. Use this access code to enter the space up to two hours before your booking. ${accessLink}`,
    html: `<p>Hello ${bookingData.member_name}. Your booking has been confirmed. Use this access code to enter the space up to two hours before your booking. ${accessLink}</p>`,
  };

  // Send custom email with SendGrid API
  await sendCustomEmailWithSendgrid(emailData);
  console.log("emailData", emailData);

  // Send response back to Optix
  res.status(200).send("Handled the booking!");
};
