require("dotenv").config();
const axios = require("axios");

async function generateAccessLinkWithKisi(bookingData) {
  // Parse the datetime string into a Date object.
  let checkInDate = new Date(bookingData.check_in_datetime);

  // Subtract 2 hours from the check in date.
  checkInDate.setHours(checkInDate.getHours() - 2);

  try {
    const response = await axios.post(
      "https://api.kisi.io/group_links",
      {
        group_link: {
          name: bookingData.member_name,
          group_id: 64450,
          valid_from: checkInDate.toISOString(), // Convert the Date object back to a string.
          valid_until: bookingData.check_out_datetime,
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
