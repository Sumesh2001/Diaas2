<?php
class PHP_Email_Form {
  public $to = '';
  public $from_name = '';
  public $from_email = '';
  public $subject = '';
  public $ajax = false;
  public $smtp = false;

  private $messages = [];

  public function add_message($content, $label = '', $priority = 10) {
    $this->messages[] = "$label: $content\n";
  }

  public function send() {
    $message_body = implode("\n", $this->messages);

    $headers = "From: $this->from_name <$this->from_email>\r\n";
    $headers .= "Reply-To: $this->from_email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if ($this->smtp) {
      return "SMTP is configured, but not implemented.";
    } else {
      if (mail($this->to, $this->subject, $message_body, $headers)) {
        return 'Message sent successfully!';
      } else {
        return 'Message could not be sent. Please try again later.';
      }
    }
  }
}
?>
