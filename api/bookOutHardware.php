<?php
session_start();
require_once("./functions.php");

header("Access-Control-Allow-Origin: http://localhost:3500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Allow pre-flight requests
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $conn = createConnection(); // Ensure this function successfully creates a DB connection.
    if (!$conn) {
        echo json_encode(["error" => "Failed to connect to the database"]);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data["serialNumber"])) {
        echo json_encode(["error" => "Serial number is required"]);
        exit;
    }

    // Query to check serialNumber and join with quantities table
    $query = "SELECT bh.id, bh.currentStatus, bh.partDefinitionsId, bh.quantity, q.totalQuantity 
              FROM BookedHardware bh
              LEFT JOIN quantities q ON bh.partDefinitionsId = q.partDefinitionsId 
              WHERE bh.serialNumber = ?";
    $params = [$data["serialNumber"]];
    $stmt = sqlsrv_prepare($conn, $query, $params);

    if (!sqlsrv_execute($stmt)) {
        echo json_encode(["error" => "Error in executing query.", "details" => sqlsrv_errors()]);
        exit;
    }

    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

    if ($row) {
        if ($row['currentStatus'] === 'Out') {
            echo json_encode(["error" => "Part already checked out."]);
            exit;
        }

        // Update currentStatus in BookedHardware
        $updateQuery1 = "UPDATE BookedHardware SET currentStatus = 'Out' WHERE id = ?";
        $updateParams1 = [$row['id']];
        $updateStmt1 = sqlsrv_prepare($conn, $updateQuery1, $updateParams1);
        if (!sqlsrv_execute($updateStmt1)) {
            echo json_encode(["error" => "Error updating part status.", "details" => sqlsrv_errors()]);
            exit;
        }

        // Subtract quantity from totalQuantity in quantities
        if ($row['currentStatus'] === 'In') {
            $updateQuery2 = "UPDATE quantities SET totalQuantity = totalQuantity - ? WHERE partDefinitionsId = ?";
            $updateParams2 = [$row['quantity'], $row['partDefinitionsId']];
            $updateStmt2 = sqlsrv_prepare($conn, $updateQuery2, $updateParams2);
            if (!sqlsrv_execute($updateStmt2)) {
                echo json_encode(["error" => "Error updating quantity.", "details" => sqlsrv_errors()]);
                exit;
            }
        }

        echo json_encode(["success" => "Part status updated to 'Out'"]);
    } else {
        echo json_encode(["error" => "Part does not exist. Please Booked In first"]);
    }

    sqlsrv_free_stmt($stmt);
    if (isset($updateStmt1)) {
        sqlsrv_free_stmt($updateStmt1);
    }
    if (isset($updateStmt2)) {
        sqlsrv_free_stmt($updateStmt2);
    }
    sqlsrv_close($conn);
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
?>
