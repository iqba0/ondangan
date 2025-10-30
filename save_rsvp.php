<?php
header("Content-Type: application/json; charset=UTF-8");

// Lokasi file CSV
$file = __DIR__ . "/data/rsvp.csv"; // pastikan folder data/ sudah ada

// Ambil data JSON
$input = json_decode(file_get_contents("php://input"), true);
if (!$input || !isset($input["nama"], $input["status"], $input["ucapan"])) {
    echo json_encode(["error" => "Invalid data"]);
    exit;
}

$nama = trim($input["nama"]);
$status = trim($input["status"]);
$ucapan = str_replace(["\n", "\r"], " ", trim($input["ucapan"]));
$tanggal = date("Y-m-d H:i:s");

// Buat header jika file belum ada
if (!file_exists($file)) {
    file_put_contents($file, "Nama,Status,Pesan,Tanggal\n");
}

// Tambahkan data
$fp = fopen($file, "a");
if ($fp) {
    fputcsv($fp, [$nama, $status, $ucapan, $tanggal]);
    fclose($fp);
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Gagal membuka file CSV"]);
}
?>
