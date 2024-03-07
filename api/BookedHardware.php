<?php
require_once __DIR__ . "/vendor/autoload.php";
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
// Database credentials
$dbHost = $_ENV["DB_HOST"];
$dbUser = $_ENV["DB_USER"];
$dbPwd = $_ENV["DB_PWD"];


// Function to create a database connection
function createConnection($dbHost, $dbUser, $dbPwd, $dbName) {
    $connectionInfo = array("UID" => $dbUser, "PWD" => $dbPwd, "Database" => $dbName, "CharacterSet" => "UTF-8");
    $conn = sqlsrv_connect($dbHost, $connectionInfo);
    if($conn === false) {
        die(print_r(sqlsrv_errors(), true));
    }
    return $conn;
}

header("Access-Control-Allow-Origin: http://localhost:3500");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

try {
    // Create the database connection for e_jail
    $connEJail = createConnection($dbHost, $dbUser, $dbPwd, 'e_jail');

    if ($connEJail) {
        // Check if the 'status' query parameter is set
        $status = 'BookedIn'; // Default status
        if (isset($_GET['status'])) {
            $status = $_GET['status'] === 'All' ? 'All' : ($_GET['status'] === 'BookedOut' ? 'BookedOut' : 'BookedIn');
        }

        // SQL Query with JOINs
        $tsql = "SELECT 
            bh.id AS bh_id,
            pd.part_number AS bh_partNumber,
            bh.serialNumber AS bh_serialNumber,
            bh.quantity AS bh_quantity, 
            bh.created_at AS bh_created_at,
            bh.currentStatus AS bh_currentStatus,
            pd.price AS pd_price,
            pd.part_description AS part_description,
            pg.description AS pg_description,
            pg.bg_color AS pg_bg_color,
            pg.text_color AS pg_text_color
    FROM 
        e_jail.dbo.BookedHardware AS bh 
    JOIN 
    
        common_test.dbo.part_definitions AS pd 
        ON bh.partDefinitionsId = pd.id
    JOIN 
        common_test.dbo.part_groups AS pg 
        ON pd.part_group_id = pg.id";

        if ($status !== 'All') {
            $tsql .= " WHERE bh.CurrentStatus = ?";
            $stmt = sqlsrv_prepare($connEJail, $tsql, array(&$status));
        } else {
            $stmt = sqlsrv_prepare($connEJail, $tsql);
        }

        // Execute the query
        if (!sqlsrv_execute($stmt)) {
            echo json_encode(array("error" => "Error in statement execution.", "details" => sqlsrv_errors()));
            exit;
        }

        // Initialize an array to hold the results
        $hardware = array();

        // Process results
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $hardware[] = $row;
        }

        // Free the statement resource
        sqlsrv_free_stmt($stmt);

        // Output the results as JSON
        echo json_encode($hardware);

    } else {
        echo json_encode(array("error" => "Connection could not be established.", "details" => sqlsrv_errors()));
        exit;
    }

    // Close the connection
    sqlsrv_close($connEJail);

} catch (Exception $e) {
    // Error handling
    echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
}

?>
