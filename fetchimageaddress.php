<?php
include 'dbh.php';
header('Content-Type: application/json');

if (isset($_POST['doctorid'])) {
    $doctorid = $_POST['doctorid'];

    try {
        $stmt = $conn->prepare("SELECT image_address FROM deeplearningimages WHERE doctorid = :doctorid");
        $stmt->bindParam(':doctorid', $doctorid);
        $stmt->execute();

        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($images) {
            echo json_encode(['success' => true, 'images' => $images]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No images found']);
        }
    } catch (PDOException $e) {
        // Log error to a file
        error_log("Database error: " . $e->getMessage());
        // Return JSON error response
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
