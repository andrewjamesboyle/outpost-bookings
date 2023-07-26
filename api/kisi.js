require("dotenv").config();
const axios = require("axios");
const moment = require("moment-timezone");

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
    console.error(error);
    throw error;
  }
}

module.exports = generateAccessLinkWithKisi;
