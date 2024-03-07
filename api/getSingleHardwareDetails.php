<?php

require_once("./functions.php");

$allowed_origin = 'http://localhost:3500';

header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['id'])) {
    try {
        $conn = createConnection();
        $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);

        $tsql = "SELECT * FROM BookedHardware WHERE id = ?;";
        $params = array($id);

        $stmt = sqlsrv_query($conn, $tsql, $params);
        if ($stmt === false) {
            echo json_encode(array("error" => "Error in executing query.", "details" => sqlsrv_errors()));
            exit;
        }

        $itemDetails = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
        if($itemDetails) {
            echo json_encode($itemDetails);
        } else {
            echo json_encode(array("error" => "Item not found."));
        }

        sqlsrv_free_stmt($stmt);
        sqlsrv_close($conn);

    } catch (Exception $e) {
        logError($e); // Ensure logError function is defined to handle and log errors
        echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
    }
} else {
    echo json_encode(array("error" => "Invalid request or missing ID."));
}
?>
