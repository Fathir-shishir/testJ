<?php
session_start();
require_once("./functions.php");

// Specify the allowed origin for your frontend application
$allowed_origin = 'http://localhost:3500';

// Set headers for CORS
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Respond to preflight request and exit
}

try {
    $conn = createConnection(); // Establish database connection

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        error_log("Received data: " . print_r($data, true));

        // Proceed with adding the new part in BookedHardware without checking serial number and quantities
        $tsql_get_max_id = "SELECT MAX(id) AS MaxID FROM BookedHardware;";
        $stmt_max_id = sqlsrv_query($conn, $tsql_get_max_id);

        if ($stmt_max_id === false) {
            echo json_encode(array("error" => "Error in retrieving the maximum ID.", "details" => sqlsrv_errors()));
            exit;
        }

        $row = sqlsrv_fetch_array($stmt_max_id, SQLSRV_FETCH_ASSOC);
        $max_id = $row['MaxID'];
        $new_id = $max_id ? $max_id + 1 : 1;

        $tsql = "INSERT INTO BookedHardware (id, partDefinitionsId, quantity, created_at, currentStatus) VALUES (?, ?, ?, ?, ?);";
        $currentDateTime = date('Y-m-d H:i:s');

        $params = array(
            $new_id, 
            $data["partDefinitionsId"], 
            $data["quantity"], 
            $currentDateTime, 
            $data["currentStatus"]
        );

        $stmt = sqlsrv_prepare($conn, $tsql, $params);

        if (!$stmt) {
            echo json_encode(array("error" => "Error in statement preparation.", "details" => sqlsrv_errors()));
            exit;
        }

        if (sqlsrv_execute($stmt) === false) {
            echo json_encode(array("error" => "Error in statement execution.", "details" => sqlsrv_errors()));
            exit;
        } else {
            echo json_encode(array("success" => "Record added successfully."));
        }

        sqlsrv_free_stmt($stmt);
    } else {
        echo json_encode(array("error" => "Invalid request method. Please use POST."));
    }
    sqlsrv_close($conn);
} catch (Exception $e) {
    logError($e);
    echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
}
?>
