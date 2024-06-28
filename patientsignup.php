<?php
require 'dbh.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];
$email = $data['email'];
$password = $data['password'];  // Store password as plain text
$contactNo = $data['contactNo'];
$age = $data['age'];
$gender = $data['gender'];

if (empty($name) || empty($email) || empty($password) || empty($contactNo) || empty($age) || empty($gender)) {
    echo json_encode(['message' => 'All fields are required']);
    exit;
}

try {
    // Generate a random 5-digit patientid that is not already in use
    $patientid = generateUniquePatientId($conn);

    // Insert new patient
    $stmt = $conn->prepare("INSERT INTO patientsignup (patientid, name, email, password, contactno, age, gender) VALUES (:patientid, :name, :email, :password, :contactno, :age, :gender)");
    $stmt->bindParam(':patientid', $patientid);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);  // Bind plain text password
    $stmt->bindParam(':contactno', $contactNo);
    $stmt->bindParam(':age', $age);
    $stmt->bindParam(':gender', $gender);
    $stmt->execute();

    echo json_encode(['message' => 'Patient registered successfully']);
} catch (PDOException $e) {
    // Log the error
    error_log($e->getMessage());
    echo json_encode(['message' => 'Failed to register patient: ' . $e->getMessage()]);
}

function generateUniquePatientId($conn) {
    $maxAttempts = 10; // Maximum attempts to generate a unique patientid
    $existingIds = array();

    // Fetch existing patientids from database
    $stmt = $conn->query("SELECT patientid FROM patientsignup");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $existingIds[] = $row['patientid'];
    }

    // Attempt to generate a unique 5-digit patientid
    for ($i = 0; $i < $maxAttempts; $i++) {
        $patientid = mt_rand(10000, 99999); // Generate random 5-digit number
        if (!in_array($patientid, $existingIds)) {
            return $patientid;
        }
    }

    // If max attempts reached without finding a unique id, handle error (in production, this should be more robust)
    throw new Exception("Failed to generate unique patientid");
}
?>
