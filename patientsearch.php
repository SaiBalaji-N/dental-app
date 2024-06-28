<?php
require 'dbh.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$searchType = isset($_GET['searchType']) ? $_GET['searchType'] : '';
$searchValue = isset($_GET['searchValue']) ? $_GET['searchValue'] : '';

if (empty($searchType) || empty($searchValue)) {
    echo json_encode(['success' => false, 'message' => 'Search type and value are required']);
    exit;
}

try {
    if ($searchType === 'id') {
        $stmt = $conn->prepare("SELECT doctorid, name, email, gender, contactno, specialization, experience FROM doctorsignup WHERE doctorid LIKE :searchValue");
        $searchPattern = '%' . $searchValue . '%';
        $stmt->bindParam(':searchValue', $searchPattern, PDO::PARAM_STR);
    } else if ($searchType === 'name') {
        $searchPattern = '%' . strtolower($searchValue) . '%';
        $stmt = $conn->prepare("SELECT doctorid, name, email, gender, contactno, specialization, experience FROM doctorsignup WHERE LOWER(name) LIKE :searchValue");
        $stmt->bindParam(':searchValue', $searchPattern, PDO::PARAM_STR);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid search type']);
        exit;
    }

    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($results) {
        echo json_encode(['success' => true, 'results' => $results]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No results found']);
    }
} catch (PDOException $e) {
    error_log('PDOException: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while searching']);
} catch (Exception $e) {
    error_log('Exception: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred']);
}
?>
