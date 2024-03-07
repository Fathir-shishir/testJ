<?php
session_start();
require_once("../functions.php");
$allowed_origin = 'http://localhost:3500';

header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Rest of your PHP script...

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request with necessary headers
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
    exit(0);
}



// Simulated check, replace with your actual session check logic
if (isset($_SESSION['user_id'])) {
    // Session is valid
    echo json_encode(array('isSessionValid' => true, 'sessionData' => $_SESSION));
} else {
    // Session is not valid
    echo json_encode(array('isSessionValid' => false));
}
