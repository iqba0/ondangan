<?php
// get_rsvp.php
header("Content-Type: application/json");

$file = "data/rsvp.csv";
$data = [];

// Cek kalau file ada dan bisa dibaca
if (file_exists($file)) {
    $rows = array_map("str_getcsv", file($file));
    $header = array_shift($rows); // ambil header
    foreach ($rows as $row) {
        $data[] = array_combine($header, $row);
    }
}

echo json_encode($data);
?>
