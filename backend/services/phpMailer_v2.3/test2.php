<?php  
  
require("class.phpmailer.php");  
  
$mail = new PHPMailer();  
  
$mail->IsSMTP();  // telling the class to use SMTP  
$mail->Host     = "mail.unina.it"; // SMTP server  
  
$mail->From     = "progetto@unina.it";  
$mail->AddAddress("m.colandrea@informaticaserv.it");  
  
$mail->Subject  = "First PHPMailer Message";  
$mail->Body     = "Hi! \n\n This is my first e-mail sent through PHPMailer.";  
$mail->WordWrap = 50;  
  
if(!$mail->Send()) {  
  echo 'Message was not sent.';  
  echo 'Mailer error: ' . $mail->ErrorInfo;  
} else {  
  echo 'Message has been sent.';  
}  
?>  