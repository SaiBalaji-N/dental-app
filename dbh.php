<?php
$host = "localhost";
$username = "root";
$password = "zaq1xsw2cde3vfr4bgt5nhy6mju7ki8lo9p0";
$dbname = "dental";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Log error to a file
    error_log("Connection failed: " . $e->getMessage());
    // Return JSON error response
    echo json_encode(['success' => false, 'message' => 'Connection failed']);
    exit;
}
?>
