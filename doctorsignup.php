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
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$contactNo = $data['contactNo'];
$specialization = $data['specialization'];
$experience = $data['experience'];

if (empty($name) || empty($email) || empty($password) || empty($contactNo) || empty($specialization) || empty($experience)) {
    echo json_encode(['message' => 'All fields are required']);
    exit;
}

try {
    // Generate a random 5-digit doctorid that is not already in use
    $doctorid = generateUniqueDoctorId($conn);

    // Insert new doctor
    $stmt = $conn->prepare("INSERT INTO doctorsignup (doctorid, name, email, password, contactno, specialization, experience) VALUES (:doctorid, :name, :email, :password, :contactno, :specialization, :experience)");
    $stmt->bindParam(':doctorid', $doctorid);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->bindParam(':contactno', $contactNo);
    $stmt->bindParam(':specialization', $specialization);
    $stmt->bindParam(':experience', $experience);
    $stmt->execute();

    echo json_encode(['message' => 'Doctor registered successfully']);
} catch (PDOException $e) {
    // Log the error
    error_log($e->getMessage());
    echo json_encode(['message' => 'Failed to register doctor: ' . $e->getMessage()]);
}

function generateUniqueDoctorId($conn) {
    $maxAttempts = 10; // Maximum attempts to generate a unique doctorid
    $existingIds = array();

    // Fetch existing doctorids from database
    $stmt = $conn->query("SELECT doctorid FROM doctorsignup");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $existingIds[] = $row['doctorid'];
    }

    // Attempt to generate a unique 5-digit doctorid
    for ($i = 0; $i < $maxAttempts; $i++) {
        $doctorid = mt_rand(10000, 99999); // Generate random 5-digit number
        if (!in_array($doctorid, $existingIds)) {
            return $doctorid;
        }
    }

    // If max attempts reached without finding a unique id, handle error (in production, this should be more robust)
    throw new Exception("Failed to generate unique doctorid");
}
?>
