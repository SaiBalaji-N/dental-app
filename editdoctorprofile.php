<?php
require_once 'dbh.php';

$doctorid = $_POST['doctorid'];
$name = $_POST['name'];
$specialization = $_POST['specialization'];
$email = $_POST['email'];
$contactno = intval($_POST['contactno']);
$experience = intval($_POST['experience']);

$response = array();

try {
    $sql = "UPDATE doctorsignup SET name = :name, specialization = :specialization, email = :email, contactno = :contactno, experience = :experience WHERE doctorid = :doctorid";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':specialization', $specialization);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':contactno', $contactno, PDO::PARAM_INT);
    $stmt->bindParam(':experience', $experience, PDO::PARAM_INT);
    $stmt->bindParam(':doctorid', $doctorid);

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
