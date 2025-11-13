<?php
// Email configuration
$to = "contact@diaas.in"; // Replace with your email
$from_email = "noreply@diaas.in"; // Replace with your sender email
$from_name = "Diaas Website";

// Get form data
$name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? htmlspecialchars($_POST['subject']) : '';
$message = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '';

// Validate inputs
$errors = array();

if (empty($name)) {
    $errors[] = "Name is required";
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Valid email is required";
}

if (empty($subject)) {
    $errors[] = "Subject is required";
}

if (empty($message)) {
    $errors[] = "Message is required";
}

// If there are errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Create email headers
$headers = "From: " . $from_name . " <" . $from_email . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// Create email body
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
        .header { background-color: #1e40af; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background-color: white; padding: 20px; }
        .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #666; }
        .field { margin-bottom: 15px; }
        .field-label { font-weight: bold; color: #1e40af; }
        .field-value { color: #333; margin-top: 5px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='field-label'>Name:</div>
                <div class='field-value'>" . $name . "</div>
            </div>
            <div class='field'>
                <div class='field-label'>Email:</div>
                <div class='field-value'><a href='mailto:" . $email . "'>" . $email . "</a></div>
            </div>
            <div class='field'>
                <div class='field-label'>Subject:</div>
                <div class='field-value'>" . $subject . "</div>
            </div>
            <div class='field'>
                <div class='field-label'>Message:</div>
                <div class='field-value'>" . nl2br($message) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>This is an automated email from your website contact form.</p>
        </div>
    </div>
</body>
</html>
";

// Send email
if (mail($to, "Contact Form: " . $subject, $email_body, $headers)) {
    // Send confirmation email to user
    $user_headers = "From: " . $from_name . " <" . $from_email . ">\r\n";
    $user_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    $user_email_body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
            .header { background-color: #1e40af; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background-color: white; padding: 20px; }
            .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Thank You for Contacting Us</h2>
            </div>
            <div class='content'>
                <p>Dear " . $name . ",</p>
                <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
                <p><strong>Your Message Details:</strong></p>
                <ul>
                    <li><strong>Subject:</strong> " . $subject . "</li>
                    <li><strong>Message:</strong> " . nl2br($message) . "</li>
                </ul>
                <p>Our team will review your inquiry and contact you shortly.</p>
                <p>Best regards,<br>Diaas Team</p>
            </div>
            <div class='footer'>
                <p>© 2025 Diaas. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    mail($email, "We received your message - Thank you!", $user_email_body, $user_headers);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email sent successfully!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later.']);
}
?>
