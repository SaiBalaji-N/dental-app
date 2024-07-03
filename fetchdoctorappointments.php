<?php
require 'dbh.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents("php://input"), true);

$doctorId = $data['doctorid'];
$appointmentType = $data['appointment_type'];

if (empty($doctorId) || empty($appointmentType)) {
    echo json_encode(['success' => false, 'message' => 'Doctor ID and appointment type are required']);
    exit;
}

try {
    $currentDate = date('Y-m-d');

    // Fetch all fields except doctorid for deeper processing in DeepLearning.js
    if ($appointmentType === 'upcoming') {
        $stmt = $conn->prepare("SELECT * FROM add_patient WHERE doctorid = :doctorid AND appointment_date >= :currentDate ORDER BY appointment_date ASC");
    } else {
        $stmt = $conn->prepare("SELECT * FROM add_patient WHERE doctorid = :doctorid AND appointment_date < :currentDate ORDER BY appointment_date DESC");
    }
    
    $stmt->bindParam(':doctorid', $doctorId, PDO::PARAM_INT);
    $stmt->bindParam(':currentDate', $currentDate, PDO::PARAM_STR);
    $stmt->execute();

    $appointments = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $appointments[] = $row;
    }

    echo json_encode(['success' => true, 'appointments' => $appointments]);
} catch(PDOException $e) {
    error_log("Error fetching appointments: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to fetch appointments']);
}
?>
