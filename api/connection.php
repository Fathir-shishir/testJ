<?php
require_once("./functions.php");

try{

    // Create the database connection
    $conn = createConnection();

    if ($conn) {
        echo "Connected";

        // Your SQL query
        $tsql = "SELECT * FROM gender_table";

        // Execute the query
        $stmt = sqlsrv_query($conn, $tsql);

        if ($stmt === false) {
            echo "Error in statement execution.\n";
            die(print_r(sqlsrv_errors(), true));
        }

        // Process results
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            echo $row['gender'];
        }

        // Free the statement resource
        sqlsrv_free_stmt($stmt);

    } else {
        echo "Connection could not be established.\n";
        die(print_r(sqlsrv_errors(), true));
    }

    // Close the connection
    sqlsrv_close($conn);


} catch (Exception $e) {

    logError($e);

    echo getErrorResponse($e);
}

createConnection();


