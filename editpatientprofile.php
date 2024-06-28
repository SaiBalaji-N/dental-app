<?php
require_once 'dbh.php';

$patientid = $_POST['patientid'];
$Name = $_POST['Name'];
$email = $_POST['email'];
$gender = $_POST['gender'];
$contactno = intval($_POST['contactno']);
$age = intval($_POST['age']);

$response = array();

try {
    $sql = "UPDATE patientsignup SET Name = :Name, email = :email, gender = :gender, contactno = :contactno, age = :age WHERE patientid = :patientid";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':Name', $Name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':contactno', $contactno, PDO::PARAM_INT);
    $stmt->bindParam(':age', $age, PDO::PARAM_INT);
    $stmt->bindParam(':patientid', $patientid);

    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['success'] = false;
        $response['message'] = "Error updating record.";
    }
} catch (PDOException $e) {
    $response['success'] = false;
    $response['message'] = "Error updating record: " . $e->getMessage();
}

echo json_encode($response);
?>
