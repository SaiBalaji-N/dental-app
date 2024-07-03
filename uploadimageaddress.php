<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Ensure POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the raw POST data
    $rawPostData = file_get_contents("php://input");
    $postData = json_decode($rawPostData, true);

    // Validate the required fields
    if (isset($postData['doctorid']) && isset($postData['image_address'])) {
        $doctorId = $postData['doctorid'];
        $imageAddress = $postData['image_address'];

        // Database connection (adjust credentials as per your setup)
        $servername = "localhost";
        $username = "root";
        $password = "zaq1xsw2cde3vfr4bgt5nhy6mju7ki8lo9p0";
        $dbname = "dental";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Database connection failed: " . $conn->connect_error));
            exit();
        }

        // Prepare SQL statement
        $stmt = $conn->prepare("INSERT INTO deeplearningimages (doctorid, image_address) VALUES (?, ?)");
        
        if ($stmt === false) {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Prepare failed: " . $conn->error));
            exit();
        }

        // Bind parameters
        $bindResult = $stmt->bind_param("ss", $doctorId, $imageAddress);
        
        if ($bindResult === false) {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Binding parameters failed: " . $stmt->error));
            exit();
        }

        // Execute the query
        $executeResult = $stmt->execute();
        
        if ($executeResult === false) {
            // Log error to a file
            file_put_contents('error.log', date('Y-m-d H:i:s') . ' - Execute failed: ' . $stmt->error . PHP_EOL, FILE_APPEND);

            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Failed to save image address: " . $stmt->error));
            exit();
        }

        // Close the statement and connection
        $stmt->close();
        $conn->close();

        // If everything succeeds
        echo json_encode(array("success" => true, "message" => "Image address saved successfully"));
        
    } else {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Invalid input: " . json_encode($postData)));
    }
} else {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}
?>
