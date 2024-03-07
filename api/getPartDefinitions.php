<?php
header("Access-Control-Allow-Origin: http://localhost:3500");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header('Content-Type: application/json'); // Set the Content-Type to application/json

function createConnection($dbHost = null, $dbUser = null, $dbPwd = null)
{
    $dbHost = "FRI1-SV00134";
    $dbUser = "fashishir";
    $dbPwd = "YNb0Hn{O7]}}_m6X";
    // Update the database name to 'common_test'
    $connInfo = array("UID" => $dbUser, "PWD" => $dbPwd, "Database" => "common_test", "CharacterSet" => "UTF-8");

    $conn = sqlsrv_connect($dbHost, $connInfo);

    if (!$conn) {
        throw new Exception(sqlsrv_errors()[0]["message"], sqlsrv_errors()[0]["code"]);
    }

    return $conn;
}

function getPartDefinitions($conn)
{
    $sql = "SELECT * FROM dbo.part_definitions"; // SQL query to get data from the table
    $stmt = sqlsrv_query($conn, $sql);

    if ($stmt === false) {
        throw new Exception(sqlsrv_errors()[0]["message"], sqlsrv_errors()[0]["code"]);
    }

    $result = array();
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $result[] = $row;
    }

    sqlsrv_free_stmt($stmt);

    return $result;
}

try {
    $conn = createConnection(); // Establish connection
    $partDefinitions = getPartDefinitions($conn); // Get data from part_definitions table

    // Output $partDefinitions as JSON
    echo json_encode($partDefinitions);
} catch (Exception $e) {
    // If there is an error, return it as JSON
    echo json_encode(["error" => $e->getMessage()]);
}

?>
