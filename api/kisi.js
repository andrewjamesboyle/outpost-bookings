require("dotenv").config();
const axios = require("axios");
const moment = require("moment-timezone");
const { sendErrorEmail } = require("./sendgrid");

async function generateAccessLinkWithKisi(bookingData) {
  // Parse the datetime string into a Date object.
  let checkInDate = moment
    .tz(bookingData.check_in_datetime, "America/Los_Angeles")
    .subtract(2, "hours");

  let checkOutDate = moment.tz(
    bookingData.check_out_datetime,
    "America/Los_Angeles"
  );

  try {
    const response = await axios.post(
      "https://api.kisi.io/group_links",
      {
        group_link: {
          name: bookingData.member_name,
          group_id: 148832,
          valid_from: checkInDate.toISOString(), // Convert the Date object back to a string.
          valid_until: checkOutDate.toISOString(),
        },
      },
      {
        headers: {
          Authorization: `KISI-LOGIN ${process.env.KISI_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.data && response.data.secret) {
      const accessLink = `https://web.kisi.io/grouplinks/${response.data.secret}`;
      return accessLink;
    } else {
      throw new Error("Failed to generate access link with Kisi");
    }
  } catch (error) {
    await handleError(error, "Failed to generate access link with Kisi");
  }
}

async function handleError(error, message) {
  console.error("Entering handleError function with message:", message);

  // Construct an error email object
  const errorEmailData = {
    to: ["andrewboylecodes@gmail.com", "logan@outpost.hr"],
    from: "logan@outpost.hr",
    subject: "Outpost-Bookings Server Error Alert",
    text: `${message}: ${error.message}\n${error.stack}`,
  };

  // Send the error email
  await sendErrorEmail(errorEmailData);
}

module.exports = { generateAccessLinkWithKisi, handleError };
