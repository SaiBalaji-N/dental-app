<?php
require 'dbh.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Handle preflight request
    http_response_code(200);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

try {
    // Fetch doctor data
    $stmt = $conn->prepare("SELECT * FROM doctorsignup WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $doctor = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($doctor) {
        error_log('Doctor record: ' . json_encode($doctor));  // Debugging statement
        // Check if the password matches
        if ($password === $doctor['password']) {
            // Remove password from response for security reasons
            unset($doctor['password']);
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'doctor' => $doctor
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Email or password is incorrect']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Email or password is incorrect']);
    }
} catch (PDOException $e) {
    // Log the error
    error_log($e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while logging in']);
}
?>
