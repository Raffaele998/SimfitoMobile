<?php
/**
 * SimFito Mobile Backend - Minimal Entry Point
 * Bypassa i problemi di compatibilità di lib-mobytsms
 */

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Route requests
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Route to appropriate service
if (strpos($request_uri, '/services/login.php') !== false) {
    include 'services/login.php';
} elseif (strpos($request_uri, '/services/ajax.php') !== false) {
    include 'services/ajax.php';
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
