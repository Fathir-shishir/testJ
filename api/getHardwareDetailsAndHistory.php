<?php
require_once("./functions.php");  // Ensure this path is correct.

$allowed_origin = 'http://localhost:3500';

header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Recursive function to convert date objects to strings
function convertDateTimeToString($data) {
    if (is_array($data) || is_object($data)) {
        foreach ($data as $key => &$value) {
            $value = convertDateTimeToString($value); // Recurse into arrays or objects
        }
    } elseif (isset($data->date) && isset($data->timezone)) {
        // Check if the object is a date object and convert it to a string
        return $data->date;
    }
    return $data;
}

try {
    // Create the database connection
    $conn = createConnection();

    if ($conn && isset($_GET['id'])) {
        $id = $_GET['id'];

        // Query for the hardware details with JOIN to part_definitions table
        $tsql_hardware = "SELECT bh.*, pd.part_number, pd.part_description 
                          FROM BookedHardware AS bh
                          JOIN common_test.dbo.part_definitions AS pd 
                          ON bh.partDefinitionsId = pd.id 
                          WHERE bh.id = ?";
        $stmt_hardware = sqlsrv_query($conn, $tsql_hardware, array($id));

        if ($stmt_hardware === false) {
            echo json_encode(array("error" => "Error in statement execution.", "details" => sqlsrv_errors()));
            exit;
        }

        // Fetch the hardware details
        $hardwareDetails = sqlsrv_fetch_array($stmt_hardware, SQLSRV_FETCH_ASSOC);

        // Free the statement resource
        sqlsrv_free_stmt($stmt_hardware);

        // Convert DateTime objects to strings in the response (if needed)
        $hardwareDetails = convertDateTimeToString($hardwareDetails);

        // Return the hardware details along with part_number and part_description
        echo json_encode(array("hardwareDetails" => $hardwareDetails));

    } else {
        echo json_encode(array("error" => "Connection could not be established or ID not provided."));
        exit;
    }

    // Close the connection
    sqlsrv_close($conn);

} catch (Exception $e) {
    echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
}
?>
