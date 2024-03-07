<?php
require_once("./functions.php"); // Ensure this path is correct.

// Set headers for CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3500"); // Only allow requests from this origin
header("Access-Control-Allow-Credentials: true"); // Crucial for cookies, authorization headers with credentials
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow only POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With"); // Ensure Content-Type and X-Requested-With are allowed

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Pre-flight request. Respond with OK status and exit
    header("HTTP/1.1 204 No Content");
    exit;
}

try {
    // Create the database connection
    $conn = createConnection();

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Decode the JSON from the request body
        $data = json_decode(file_get_contents('php://input'), true);

        if ($conn) {
            // Retrieve data from the decoded JSON
            $itemID = $data['ItemID'] ?? null;
            $userName = $data['UserName'] ?? null;
            $status = $data['Status'] ?? null;

            // Validate input
            if (!$itemID || !$userName || !$status) {
                echo json_encode(array("error" => "Invalid data provided."));
                exit;
            }

            // Generate the current time in a format suitable for SQL Server
            $time = date('Y-m-d H:i:s');  // Adjust the format if needed

            // Prepare to get the maximum HistoryID (auto-generate HistoryID)
            $tsql_max_id = "SELECT MAX(HistoryID) as MaxID FROM History";
            $stmt_max_id = sqlsrv_query($conn, $tsql_max_id);

            if ($stmt_max_id === false) {
                echo json_encode(array("error" => "Error in retrieving maximum HistoryID.", "details" => sqlsrv_errors()));
                exit;
            }

            $row = sqlsrv_fetch_array($stmt_max_id, SQLSRV_FETCH_ASSOC);
            $max_id = $row['MaxID'];
            $new_id = $max_id ? $max_id + 1 : 1;

            // SQL query to insert data
            $tsql = "INSERT INTO History (HistoryID, ItemID, UserName, Time, Status) VALUES (?, ?, ?, ?, ?)";

            // Prepare the statement with parameters
            $stmt = sqlsrv_prepare($conn, $tsql, array(&$new_id, &$itemID, &$userName, &$time, &$status));

            // Execute the query
            if (!sqlsrv_execute($stmt)) {
                echo json_encode(array("error" => "Error in statement execution.", "details" => sqlsrv_errors()));
                exit;
            }

            // If everything is okay, send a success message
            echo json_encode(array("success" => "History record added successfully with ID " . $new_id));

            // Free the statement resources
            sqlsrv_free_stmt($stmt);
            sqlsrv_free_stmt($stmt_max_id);

        } else {
            echo json_encode(array("error" => "Connection could not be established.", "details" => sqlsrv_errors()));
            exit;
        }

        // Close the connection
        sqlsrv_close($conn);
    } else {
        echo json_encode(array("error" => "Invalid request method. Please use POST."));
    }

} catch (Exception $e) {
    logError($e);  // Ensure you have a function to log errors
    echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
}

?>
