import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import basicAuth from "basic-auth";
import User from "./models/User.js";
import { sendWhatsAppText } from "./services/msg91.js";
dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err.message));

function requireAdmin(req, res, next) {
  const user = basicAuth(req);
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASS || "changeme";
  if (!user || user.name !== adminUser || user.pass !== adminPass) {
    res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).send("Authentication required.");
  }
  return next();
}

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/myip", async (req, res) => {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook payload:", JSON.stringify(req.body).slice(0, 1000));
    const body = req.body;
    const mobile = body.mobile || body.sender || (body.payload && body.payload.sender) || (body.data && body.data.from);
    const text =
      (body.message && (body.message.text || body.message.body)) ||
      (body.payload && body.payload.text) ||
      (body.data && body.data.message);

    if (!mobile) {
      console.warn("Webhook: no mobile detected");
      return res.sendStatus(200);
    }

    const phone = mobile.replace(/\D/g, "");

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, step: 1 });
      await user.save();
      await sendWhatsAppText(phone, "Hello, may I know your name please?");
      return res.sendStatus(200);
    }

    const incoming = (text || "").trim();

    if (user.step === 1) {
      user.name = incoming || "N/A";
      user.step = 2;
      await user.save();
      await sendWhatsAppText(phone, "Where are you arriving in Hyderabad?");
      return res.sendStatus(200);
    }

    if (user.step === 2) {
      user.arrivalCity = incoming || "N/A";
      user.step = 3;
      await user.save();
      await sendWhatsAppText(phone, "May I please know your arrival date and time?");
      return res.sendStatus(200);
    }

    if (user.step === 3) {
      user.arrivalDateTime = incoming || "N/A";
      user.step = 4;
      await user.save();
      await sendWhatsAppText(phone, "May I please know your departure date and time?");
      return res.sendStatus(200);
    }

    if (user.step === 4) {
      user.departureDateTime = incoming || "N/A";
      user.step = 5;
      await user.save();
      await sendWhatsAppText(phone, "May I please know your method of departure?");
      return res.sendStatus(200);
    }

    if (user.step === 5) {
      user.departureMethod = incoming || "N/A";
      user.step = 6;
      await user.save();
      await sendWhatsAppText(phone, `Thank you, ${user.name}! Your details have been recorded ✅`);
      return res.sendStatus(200);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.sendStatus(500);
  }
});

app.get("/api/submissions", requireAdmin, async (req, res) => {
  try {
    const results = await User.find({ step: { $gte: 6 } }).sort({ createdAt: -1 }).lean();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + "/public"));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/webhook") || req.path === "/health" || req.path === "/myip") return next();
  res.sendFile(__dirname + "/public/index.html");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
