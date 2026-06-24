<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$db_file = 'wishes.json';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Function to get wishes
function get_wishes($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

// If it's a GET request, just return existing wishes
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $wishes = get_wishes($db_file);
    // Sort descending by timestamp
    usort($wishes, function($a, $b) {
        return strcmp($b['timestamp'], $a['timestamp']);
    });
    echo json_encode(['status' => 'success', 'data' => $wishes]);
    exit;
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get POST data (JSON or form-urlencoded)
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }

    $nama = isset($input['nama']) ? trim(strip_tags($input['nama'])) : '';
    $kehadiran = isset($input['kehadiran']) ? trim(strip_tags($input['kehadiran'])) : '';
    $ucapan = isset($input['ucapan']) ? trim(strip_tags($input['ucapan'])) : '';

    if (empty($nama) || empty($kehadiran) || empty($ucapan)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Semua field (Nama, Kehadiran, Ucapan) harus diisi!']);
        exit;
    }

    $wishes = get_wishes($db_file);

    // Create new wish entry
    $new_wish = [
        'id' => uniqid(),
        'nama' => $nama,
        'kehadiran' => $kehadiran, // 'hadir', 'tidak_hadir', 'ragu'
        'ucapan' => $ucapan,
        'timestamp' => date('Y-m-d H:i:s')
    ];

    $wishes[] = $new_wish;

    // Save back to file
    if (file_put_contents($db_file, json_encode($wishes, JSON_PRETTY_PRINT))) {
        // Sort descending by timestamp for the response
        usort($wishes, function($a, $b) {
            return strcmp($b['timestamp'], $a['timestamp']);
        });
        echo json_encode(['status' => 'success', 'data' => $wishes]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan data ucapan.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
?>
