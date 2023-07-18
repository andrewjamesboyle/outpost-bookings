require("dotenv").config();
const axios = require("axios");

async function generateAccessLinkWithKisi(bookingData) {
  try {
    const response = await axios.post(
      "https://api.kisi.io/group_links",
      {
        group_link: {
          name: bookingData.name,
          group_id: bookingData.group_id,
          valid_from: bookingData.start,
          valid_until: bookingData.end,
        },
      },
      {
        headers: {
          Authorization: `KISI-LOGIN ${process.env.KISI_API_KEY}`,
          "Content-Type": "application/json",
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
