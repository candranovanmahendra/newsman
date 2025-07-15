const { Telegraf } = require("telegraf");
const BOT_TOKEN = "7525794586:AAH9YlfXazDX1zzx1ss23q8RuIqyMJcVzZI"; // ← Ganti dengan token bot kamu
const DOMAIN = "https://articleman-nine.vercel.app"; // ← Ganti dengan domain kamu

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("👋 Kirim perintah:\n\n`/create <link>`\n\nContoh:\n`/create https://youtube.com/embed/abc123`", {
    parse_mode: "Markdown"
  });
});

bot.command("create", (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);
  const link = args.join(" ");
  const uid = ctx.from.id;

  if (!link || !link.startsWith("http")) {
    return ctx.reply("⚠️ Format salah. Gunakan:\n`/create https://youtube.com/embed/...`", {
      parse_mode: "Markdown"
    });
  }

  const encodedUrl = encodeURIComponent(link);
  const finalUrl = `${DOMAIN}/article?url=${encodedUrl}&uid=${uid}`;

  ctx.reply(`✅ Halaman kamu siap:\n${finalUrl}`);
});

bot.launch();
console.log("🤖 Bot aktif!");
