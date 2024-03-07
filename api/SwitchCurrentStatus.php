<?php
// SwitchCurrentStatus.php

require_once("./functions.php"); // Ensure this path is correct.

$allowed_origin = 'http://localhost:3500';

// Set headers for CORS
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow only POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With"); // Explicitly allow Content-Type and X-Requested-With headers

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Pre-flight request. Respond with OK status and exit
    header("HTTP/1.1 204 No Content");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Create the database connection
    $conn = createConnection(); // Ensure this is your actual function to connect to the database.
    
    // Decode the JSON from the request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Sanitize input data
    $id = filter_var($data['id'], FILTER_SANITIZE_NUMBER_INT);
    
    // Prepare SQL statement to update the current status
    $tsql = "UPDATE BookedHardware SET CurrentStatus = 'BookedOut' WHERE id = ?;";
    $params = array($id);

    // Execute the query
    $stmt = sqlsrv_query($conn, $tsql, $params);
    if ($stmt === false) {
        echo json_encode(array("error" => "Error in executing query.", "details" => sqlsrv_errors()));
        exit;
    }

    // If everything is okay, send a success message
    echo json_encode(array("success" => "Status updated successfully."));
    
    // Free the statement resources
    sqlsrv_free_stmt($stmt);
    sqlsrv_close($conn);
}
?>
