<?php
/**
 * Database Configuration for SimFito Mobile Backend
 */

// PostgreSQL Connection String
$hostpg = "192.168.1.19";
$portpg = "5432";
$userdb = "postgres";
$passworddb = "ariespac3";
$namedb = "simfito4";

// Connection string per PHP-PostgreSQL
$connection = "host=$hostpg port=$portpg user=$userdb password=$passworddb dbname=$namedb";

// Table names
$user_tb = "simfito.tecnici";

// Email Configuration (optional)
$smtpusername = '';
$smtppassword = '';

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Global database instance
$db = null;

/**
 * Function to get database connection
 */
function get_db_connection() {
    global $connection;
    return pg_connect($connection);
}
?>
