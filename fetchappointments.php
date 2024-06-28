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

$doctorId = $data['doctor_id'];
$appointmentType = $data['appointment_type']; // 'upcoming' or 'completed'

if (empty($doctorId) || empty($appointmentType)) {
    echo json_encode(['success' => false, 'message' => 'Doctor ID and appointment type are required']);
    exit;
}

try {
    // Determine current date
    $currentDate = date('Y-m-d');

    // Prepare statement to fetch appointments based on doctor id and appointment type
    if ($appointmentType === 'upcoming') {
        $stmt = $conn->prepare("SELECT patient_name, patient_gender, appointment_date, patient_problem FROM add_patient WHERE doctorid = :doctorid AND appointment_date >= :currentDate ORDER BY appointment_date ASC");
    } else {
        $stmt = $conn->prepare("SELECT patient_name, patient_gender, appointment_date, patient_problem FROM add_patient WHERE doctorid = :doctorid AND appointment_date < :currentDate ORDER BY appointment_date DESC");
    }
    
    $stmt->bindParam(':doctorid', $doctorId);
    $stmt->bindParam(':currentDate', $currentDate);
    $stmt->execute();

    // Fetch appointments
    $appointments = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $appointments[] = [
            'patient_name' => $row['patient_name'],
            'patient_gender' => $row['patient_gender'],
            'appointment_date' => $row['appointment_date'],
            'patient_problem' => $row['patient_problem']
            // Add more fields as needed
        ];
    }

    echo json_encode(['success' => true, 'appointments' => $appointments]);
} catch(PDOException $e) {
    // Log the error
    error_log("Error fetching appointments: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to fetch appointments']);
}
?>
