<?php
$host = "localhost";
$username = "root";
$password = "zaq1xsw2cde3vfr4bgt5nhy6mju7ki8lo9p0";
$dbname = "dental";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>