<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'Mailer/PHPMailer.php';
require 'Mailer/SMTP.php';
require 'Mailer/Exception.php';

$mail = new PHPMailer(true);

$response = ['status' => '', 'message' => ''];

try {
  // Server settings
  $mail->isSMTP();
  $mail->Host = 'smtp.gmail.com';
  $mail->SMTPAuth = true;
  $mail->Username = 'smt.test.php@gmail.com'; 
  $mail->Password = 'tggmsaouyluoqhog';      
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port = 587;

  // Validate POST data
  if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    throw new Exception('Invalid email address.');
  }
  if (empty($_POST['name']) || empty($_POST['subject']) || empty($_POST['message'])) {
    throw new Exception('All fields are required.');
  }

  // Sender and recipient
  $mail->setFrom($_POST['email'], htmlspecialchars($_POST['name']));
  $mail->addAddress('sumeshfake1@gmail.com'); 

  // Content
  $mail->isHTML(false);
  $mail->Subject = htmlspecialchars($_POST['subject']);
  $mail->Body    = "From: " . htmlspecialchars($_POST['name']) . "\nEmail: " . $_POST['email'] . "\n\n" . htmlspecialchars($_POST['message']);

  $mail->send();
  $response['status'] = 'success';
  $response['message'] = 'Your message has been sent successfully!';
} catch (Exception $e) {
  $response['status'] = 'error';
  $response['message'] = "Message could not be sent. Error: " . $e->getMessage();
}

// Return response as JSON
header('Content-Type: application/json');
echo json_encode($response);
