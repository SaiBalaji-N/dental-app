<?php
header('Content-Type: application/json');
require 'dbh.php'; // Ensure this path is correct

$input = json_decode(file_get_contents('php://input'), true);
$doctorId = $input['doctorid'];

if (!$doctorId) {
    echo json_encode(['success' => false, 'message' => 'Doctor ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare('SELECT patient_name, teeth_measurements, teeth_material, operation_date FROM operation WHERE doctorid = :doctorid ORDER BY operation_date DESC');
    $stmt->bindParam(':doctorid', $doctorId, PDO::PARAM_INT);
    $stmt->execute();
    $operations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'operations' => $operations]);
} catch (PDOException $e) {
    error_log("Error fetching operations: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error fetching operations']);
}
?>
