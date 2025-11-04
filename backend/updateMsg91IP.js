import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function getMyIP() {
  const r = await axios.get("https://api.ipify.org?format=json");
  return r.data.ip;
}

async function updateWhitelist(ip) {
  // Illustrative; many MSG91 accounts don't expose this API.
  const url = "https://control.msg91.com/api/v5/authkey/whitelist";
  try {
    const res = await axios.post(
      url,
      { ip_addresses: [ip] },
      { headers: { authkey: process.env.MSG91_AUTH_KEY } }
    );
    console.log("Whitelist update response:", res.data);
  } catch (err) {
    console.warn("Could not update whitelist programmatically:", err.response?.data || err.message);
  }
}

async function main() {
  if (process.env.ALLOW_ALL_IPS === "true") {
    console.log("ALLOW_ALL_IPS=true, skipping automatic whitelist update.");
    return;
  }

  try {
    const ip = await getMyIP();
    console.log("Detected outgoing IP:", ip);
    await updateWhitelist(ip);
  } catch (err) {
    console.error("updateMsg91IP error:", err.message);
  }
}

if (require.main === module) {
  main();
}

export default main;
