<?php
// Include database connection
require_once 'dbh.php';

// Retrieve POST data
$doctor_email = isset($_POST['doctor_email']) ? $_POST['doctor_email'] : null;
$patient_name = isset($_POST['patient_name']) ? $_POST['patient_name'] : null;
$patient_age = isset($_POST['patient_age']) ? $_POST['patient_age'] : null;
$patient_gender = isset($_POST['patient_gender']) ? $_POST['patient_gender'] : null;
$patient_problem = isset($_POST['patient_problem']) ? $_POST['patient_problem'] : null;
$appointment_date = isset($_POST['appointment_date']) ? $_POST['appointment_date'] : null;
$patient_mobile_number = isset($_POST['patient_mobile_number']) ? $_POST['patient_mobile_number'] : null;
$patient_address = isset($_POST['patient_address']) ? $_POST['patient_address'] : null;

try {
    // Check database connection
    if ($conn == null) {
        throw new Exception('Failed to connect to the database.');
    }

    // Fetch doctorid using doctor_email from the doctorsignup table
    $sql = "SELECT doctorid FROM doctorsignup WHERE email = :doctor_email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':doctor_email', $doctor_email, PDO::PARAM_STR);
    $stmt->execute();
    $doctor = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$doctor) {
        throw new Exception('Doctor not found.');
    }

    $doctorid = $doctor['doctorid'];

    // Prepare and execute the SQL query to add a patient
    $sql = "INSERT INTO add_patient (doctorid, patient_name, patient_age, patient_gender, patient_problem, appointment_date, patient_mobile_number, patient_address) 
            VALUES (:doctorid, :patient_name, :patient_age, :patient_gender, :patient_problem, :appointment_date, :patient_mobile_number, :patient_address)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':doctorid', $doctorid, PDO::PARAM_INT);
    $stmt->bindParam(':patient_name', $patient_name, PDO::PARAM_STR);
    $stmt->bindParam(':patient_age', $patient_age, PDO::PARAM_INT);
    $stmt->bindParam(':patient_gender', $patient_gender, PDO::PARAM_STR);
    $stmt->bindParam(':patient_problem', $patient_problem, PDO::PARAM_STR);
    $stmt->bindParam(':appointment_date', $appointment_date, PDO::PARAM_STR);
    $stmt->bindParam(':patient_mobile_number', $patient_mobile_number, PDO::PARAM_INT);
    $stmt->bindParam(':patient_address', $patient_address, PDO::PARAM_STR);

    if ($stmt->execute()) {
        $response = array("success" => true, "message" => "Patient added successfully");
    } else {
        throw new Exception('Failed to execute the insert query.');
    }

    // Return response
    echo $response['message'];
} catch (Exception $e) {
    // Log error for debugging
    error_log("Error: " . $e->getMessage());
    // Return error message
    echo 'An error occurred while adding the patient: ' . $e->getMessage();
}

// Close statement and connection
$stmt = null;
$conn = null;
?>
