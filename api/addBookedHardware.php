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

        // Check if the part number exists
        $tsql_check_part = "SELECT id, currentStatus FROM BookedHardware WHERE partNumber = ?;";
        $params_check_part = array($data["partNumber"]);
        $stmt_check_part = sqlsrv_query($conn, $tsql_check_part, $params_check_part);

        if ($stmt_check_part === false) {
            echo json_encode(array("error" => "Error in retrieving part number.", "details" => sqlsrv_errors()));
            exit;
        }

        $row = sqlsrv_fetch_array($stmt_check_part, SQLSRV_FETCH_ASSOC);
        
        if ($row) {
            // Part number exists, check current status
            if ($row['currentStatus'] === 'Out' && $data["currentStatus"] === 'Out') {
                echo json_encode(array("error" => "Already BookedOut."));
                exit;
            } elseif ($row['currentStatus'] === 'In' && $data["currentStatus"] === 'In') {
                echo json_encode(array("error" => "Already BookedIN."));
                exit;
            }
            // Here, implement the logic for updating the record if needed.
        } else {
            // If part number does not exist, add new record
            // First, get the next ID for the new entry
            $tsql_get_max_id = "SELECT MAX(id) AS MaxID FROM BookedHardware;";
            $stmt_max_id = sqlsrv_query($conn, $tsql_get_max_id);

            if ($stmt_max_id === false) {
                echo json_encode(array("error" => "Error in retrieving the maximum ID.", "details" => sqlsrv_errors()));
                exit;
            }

            $row_id = sqlsrv_fetch_array($stmt_max_id, SQLSRV_FETCH_ASSOC);
            $max_id = $row_id['MaxID'];
            $new_id = $max_id ? $max_id + 1 : 1;

            $tsql_insert = "INSERT INTO BookedHardware (id, partDefinitionsId, quantity, created_at, currentStatus, partNumber, serialNumber) VALUES (?, ?, ?, GETDATE(), ?, ?, ?);";
            $params_insert = array(
                $new_id, 
                $data["partDefinitionsId"], 
                $data["quantity"], 
                $data["currentStatus"],
                $data["partNumber"],
                $data["serialNumber"]
            );

            $stmt_insert = sqlsrv_prepare($conn, $tsql_insert, $params_insert);

            if (!$stmt_insert) {
                echo json_encode(array("error" => "Error in statement preparation.", "details" => sqlsrv_errors()));
                exit;
            }

            if (sqlsrv_execute($stmt_insert) === false) {
                echo json_encode(array("error" => "Error in statement execution.", "details" => sqlsrv_errors()));
                exit;
            } else {
                echo json_encode(array("success" => "Record added successfully."));
            }

            sqlsrv_free_stmt($stmt_insert);
        }

        sqlsrv_free_stmt($stmt_check_part); // Free the statement
    } else {
        echo json_encode(array("error" => "Invalid request method. Please use POST."));
    }
    sqlsrv_close($conn); // Close the database connection
} catch (Exception $e) {
    logError($e); // Log error
    echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
}
?>
