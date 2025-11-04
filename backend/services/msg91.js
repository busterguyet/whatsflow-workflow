import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MSG91_BASE = "https://api.msg91.com/api/v5/whatsapp";

export async function sendWhatsAppText(toMobile, text) {
  try {
    const payload = {
      integrated_number: process.env.MSG91_WHATSAPP_NUMBER,
      content_type: "text",
      message: text,
      recipients: [{ mobile: toMobile }]
    };

    const res = await axios.post(
      `${MSG91_BASE}/whatsapp-outbound-message/`,
      payload,
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );
    return res.data;
  } catch (err) {
    console.error("MSG91 send error:", err.response?.data || err.message);
    throw err;
  }
}
