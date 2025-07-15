export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cat } = req.body;
  const { uid } = req.query;

  if (!cat || !uid) return res.status(400).json({ error: "Missing data" });

  const BOT_TOKEN = '7525794586:AAH9YlfXazDX1zzx1ss23q8RuIqyMJcVzZI';
  const chat_id = uid;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id,
        photo: cat
      })
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.description);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Failed to send:", err.message);
    res.status(500).json({ error: "Telegram send failed" });
  }
}
