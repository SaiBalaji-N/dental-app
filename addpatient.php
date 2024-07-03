<?php
require 'dbh.php'; // Include your database connection script

header('Content-Type: application/json');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

// Ensure all variables are properly escaped to prevent SQL injection (though PDO prepared statements handle this)
$doctorid = $request->doctorid;
$patient_name = $request->patient_name;
$patient_age = $request->patient_age;
$patient_gender = $request->patient_gender;
$patient_problem = $request->patient_problem;
$appointment_date = $request->appointment_date;
$patient_mobile_number = $request->patient_mobile_number;
$patient_address = $request->patient_address;
$datetime = date('Y-m-d H:i:s'); // Get the current date and time

try {
    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO add_patient (doctorid, patient_name, patient_age, patient_gender, patient_problem, appointment_date, patient_mobile_number, patient_address, datetime)
                           VALUES (:doctorid, :patient_name, :patient_age, :patient_gender, :patient_problem, :appointment_date, :patient_mobile_number, :patient_address, :datetime)");
    
    // Bind parameters
    $stmt->bindParam(':doctorid', $doctorid);
    $stmt->bindParam(':patient_name', $patient_name);
    $stmt->bindParam(':patient_age', $patient_age);
    $stmt->bindParam(':patient_gender', $patient_gender);
    $stmt->bindParam(':patient_problem', $patient_problem);
    $stmt->bindParam(':appointment_date', $appointment_date);
    $stmt->bindParam(':patient_mobile_number', $patient_mobile_number);
    $stmt->bindParam(':patient_address', $patient_address);
    $stmt->bindParam(':datetime', $datetime); // Bind the current date and time
    
    // Execute the statement
    $stmt->execute();

    // Check if the query was successful
    if ($stmt->rowCount() > 0) {
        $response['success'] = true;
        $response['message'] = 'Patient added successfully.';
    } else {
        $response['success'] = false;
        $response['message'] = 'Failed to add patient.';
    }
} catch(PDOException $e) {
    // Log error to a file or console
    error_log("Error adding patient: " . $e->getMessage());
    // Return JSON error response
    $response['success'] = false;
    $response['message'] = 'An error occurred while adding the patient.';
}

echo json_encode($response);
?>
