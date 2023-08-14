const { generateAccessLinkWithKisi, handleError } = require("./kisi");
const { sendCustomEmailWithSendgrid } = require("./sendgrid");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
    return;
  }

  // TO DO: Add validation for incoming data

  // Parse incoming booking data
  const bookingData = req.body;
  console.log("bookingData", req.body);

  try {
    // Generate access link with Kisi API
    const accessLink = await generateAccessLinkWithKisi(bookingData);
    console.log("accessLink", accessLink);

    if (accessLink) {
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
      console.log("customEmailData", emailData);
      // Send response back to Optix
      res.status(200).send("Handled the booking!");
    } else {
      await handleError(error, "Failed to generate access link with Kisi");
      console.error("No access link generated. Email not sent.");
      return res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    // await handleError(error, "Error handling booking");
    return res.status(500).send("Internal Server Error");
  }
};
