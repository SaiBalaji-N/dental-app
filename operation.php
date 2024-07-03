<?php
// Database connection details
$servername = "localhost";
$username = "root";
$password = "zaq1xsw2cde3vfr4bgt5nhy6mju7ki8lo9p0";
$dbname = "dental";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve POST data from the React Native application
$data = json_decode(file_get_contents("php://input"), true);

// Extract data fields
$doctorid = $data['doctorid'];
$patient_name = $data['patient_name'];
$patient_age = $data['patient_age'];
$patient_gender = $data['patient_gender'];
$mobile_number = isset($data['patient_mobile_number']) ? $data['patient_mobile_number'] : null; // Ensure mobile_number is properly handled
$address = isset($data['patient_address']) ? $data['patient_address'] : null; // Ensure address is properly handled
$prediction = $data['prediction'];
$teeth_measurements = $data['teeth_measurements'];
$teeth_material = $data['teeth_material'];
$operation_description = $data['operation_description'];
$operation_date = $data['operation_date'];

// Prepare SQL statement
$sql = "INSERT INTO operation (doctorid, patient_name, patient_age, patient_gender, mobile_number, address, prediction, teeth_measurements, teeth_material, operation_description, operation_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("isssssdssss", $doctorid, $patient_name, $patient_age, $patient_gender, $mobile_number, $address, $prediction, $teeth_measurements, $teeth_material, $operation_description, $operation_date);

// Execute SQL statement
if ($stmt->execute()) {
    $response = array(
        "success" => true,
        "message" => "Operation details saved successfully."
    );
} else {
    $response = array(
        "success" => false,
        "message" => "Error: " . $stmt->error
    );
}

// Close statement and connection
$stmt->close();
$conn->close();

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
