<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'Mailer/PHPMailer.php';
require 'Mailer/SMTP.php';
require 'Mailer/Exception.php';

$response = ['success' => false, 'message' => ''];

try {
  // Verify reCAPTCHA
  $recaptchaSecret = '6LelPkUsAAAAAKjmcDLlP6mtVNCZNrx3pKN0ax4d';
  $recaptchaResponse = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
  if (empty($recaptchaResponse)) {
    throw new Exception('reCAPTCHA verification failed.');
  }

  $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
  $ch = curl_init($verifyUrl);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'secret' => $recaptchaSecret,
    'response' => $recaptchaResponse,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
  ]));
  $verifyResp = curl_exec($ch);
  curl_close($ch);

  if (!$verifyResp) {
    throw new Exception('reCAPTCHA verification request failed.');
  }

  $verifyData = json_decode($verifyResp, true);
  if (!isset($verifyData['success']) || $verifyData['success'] !== true) {
    throw new Exception('reCAPTCHA verification failed.');
  }
  // Validate POST data first
  if (!isset($_POST['email']) || !isset($_POST['name']) || !isset($_POST['subject']) || !isset($_POST['message'])) {
    throw new Exception('All fields are required.');
  }
  
  if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    throw new Exception('Invalid email address.');
  }
  // Rate limiting: allow max 3 sends per IP+browser in 24 hours (enforce before sending)
  $browserId = isset($_POST['browser_id']) && strlen($_POST['browser_id']) > 0 ? $_POST['browser_id'] : null;
  if (!$browserId) {
    $browserId = hash('sha256', $_SERVER['HTTP_USER_AGENT'] ?? 'unknown');
  }

  $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $storageFile = __DIR__ . '/ratelimit.json';
  $records = [];
  if (file_exists($storageFile)) {
    $raw = file_get_contents($storageFile);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) $records = $decoded;
  }

  $key = $ip . '|' . $browserId;
  $now = time();
  $window = 24 * 60 * 60; // 24 hours
  if (!isset($records[$key])) $records[$key] = [];
  // prune old entries
  $records[$key] = array_filter($records[$key], function($ts) use ($now, $window) {
    return ($ts >= ($now - $window));
  });

  if (count($records[$key]) >= 3) {
    throw new Exception('Rate limit exceeded. You can send up to 3 messages per 24 hours.');
  }

  $mail = new PHPMailer(true);
  
  // Server settings
  $mail->isSMTP();
  $mail->Host = 'smtp.gmail.com';
  $mail->SMTPAuth = true;
  $mail->Username = 'smt.test.php@gmail.com'; 
  $mail->Password = 'tggmsaouyluoqhog';      
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port = 587;

  // Sender and recipient
  $mail->setFrom($_POST['email'], 'Diaas Website');
  $mail->addAddress('sumesh.shaji@diaas.in'); 

  // Content
  $mail->isHTML(false);
  $mail->Subject = htmlspecialchars($_POST['subject']);
  $mail->Body    = "From: " . htmlspecialchars($_POST['name']) . "\nEmail: " . $_POST['email'] . "\n\n" . htmlspecialchars($_POST['message']);

  $mail->send();
  
  // Send reciprocate email to the sender
  $mail->clearAddresses();
  $mail->addAddress($_POST['email'], htmlspecialchars($_POST['name']));
  $mail->setFrom('sumesh.shaji@diaas.in', 'Diaas Team');
  $mail->Subject = 'We received your message - ' . htmlspecialchars($_POST['subject']);
  $mail->Body = "Hi " . htmlspecialchars($_POST['name']) . ",\n\nThank you for reaching out to us! We have received your message and will get back to you within 24 hours.\n\nYour Message:\n" . htmlspecialchars($_POST['message']) . "\n\nBest regards,\nDiaas Team\ncontact@diaas.in";
  
  $mail->send();

  // record this send in rate-limit storage
  $records[$key][] = $now;
  @file_put_contents($storageFile, json_encode($records));
  
  $response['success'] = true;
  $response['message'] = 'Your message has been sent successfully!';
  
} catch (Exception $e) {
  $response['success'] = false;
  $response['message'] = "Message could not be sent. Error: " . $e->getMessage();
}

// Return response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
