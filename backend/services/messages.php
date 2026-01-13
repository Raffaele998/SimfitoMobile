<?php

require_once('phpMailer_v2.3/class.phpmailer.php');
// require_once('./lib-mobytsms.inc.php'); // DISABILITATO - Problemi di compatibilità PHP
require_once('../etc/db_config.php');

if(!function_exists('ereg'))            { function ereg($pattern, $subject, &$matches = []) { return preg_match('/'.$pattern.'/', $subject, $matches); } }
if(!function_exists('eregi'))           { function eregi($pattern, $subject, &$matches = []) { return preg_match('/'.$pattern.'/i', $subject, $matches); } }
if(!function_exists('ereg_replace'))    { function ereg_replace($pattern, $replacement, $string) { return preg_replace('/'.$pattern.'/', $replacement, $string); } }
if(!function_exists('eregi_replace'))   { function eregi_replace($pattern, $replacement, $string) { return preg_replace('/'.$pattern.'/i', $replacement, $string); } }
if(!function_exists('split'))           { function split($pattern, $subject, $limit = -1) { return preg_split('/'.$pattern.'/', $subject, $limit); } }
if(!function_exists('spliti'))          { function spliti($pattern, $subject, $limit = -1) { return preg_split('/'.$pattern.'/i', $subject, $limit); } }

function echo_debug($text) {
	$debug = false;
	if ($debug)
		echo $text;
}

function simfito_sendmail($dest,$subject,$mailbody) {
	global $smtpport,$smtpserver,$smtpfrom;
	global $smtpauth,$smtpusername,$smtppassword;

	if (isset($smtpport))
		$port = $smtpport;
	else
		$port = 25;

	$f = fopen("log/messages.log","a");
	@chmod("log/messages.log",0777);
	$date = date(DATE_ATOM);
	fwrite($f,"-- $date -- : SMTPPORT:$smtpport,PORT:$port,SMTPSERVER:$smtpserver,SMPTFROM:$smtpfrom,SMTPAUTH:$smtpauth,USERNAME:$smtpusername,PASSOWRD:$smtppassword,DEST:$dest,SUBJ:$subject\n");

	echo_debug( '<h3>Send mail</h3>' );
    echo_debug(  "To: $dest<br>" );
    echo_debug(  "From: $smtpfrom<br>" );
    echo_debug(  "Server: $smtpserver<br>" );
    echo_debug(  "Port:  $port<br>" );
	$mail = new PHPMailer();
	$mail->IsSMTP();  // telling the class to use SMTP
	$mail->Host = $smtpserver; // SMTP server
    	$mail->Port = $port;
    	if ($smtpauth!=0) {
      		echo_debug( "Auth mode<br>" );
      		echo_debug( "Username: $smtpusername<br>" );
      		echo_debug( "Password: $smtppassword<br>" );
      		$mail->SMTPAuth = TRUE;
      		$mail->Username = $smtpusername;
      		$mail->Password = $smtppassword;
    	} else {
      		echo_debug( "No auth<br>" );
    	}
	$mail->From     = $smtpfrom;
	$mail->FromName = $smtpfrom;
	$mail->AddAddress($dest);
	$mail->Subject  = $subject;
	$mail->Body     = $mailbody;
	$mail->WordWrap = 50;
	if(!$mail->Send()) {
		fwrite($f,"SEND ERR\n");
		echo_debug( "Il messaggio NON e' stato inviato correttamente.<br>" );
		echo_debug( 'Mailer error: ' . $mail->ErrorInfo );
		return array(false,"La mail NON e' stata inviata correttamente, Mailer error: " . $mail->ErrorInfo)  ;
	} else {
		fwrite($f,"SEND OK\n");
		echo_debug( "Il messaggio e' stato inviato correttamente." );
		return array(true,"La mail e' stata inviata correttamente.");
	}
}

function simfito_sendsms($dest,$smsbody) {
	global $mobytmittente;
	global $mobytlogin,$mobytpasswd;
	echo_debug( '<h3>Send sms</h3>' );
	echo_debug( "To : $dest<br>" );
	echo_debug( "From : $mobytmittente<br>" );
	echo_debug( "Messaggio : '$smsbody'<br>" );
	echo_debug( "Login/Pwd : $mobytlogin $mobytpasswd<br>" );
	$sms = new mobytSms($mobytlogin,$mobytpasswd);
	$sms->setFrom($mobytmittente);
	$result = $sms->sendSms($dest, $smsbody);
	if (substr($result, 0, 2) == 'OK') {
		echo_debug( "Il messaggio e' stato inviato correttamente" );
		return array(true,"Il messaggio e' stato inviato correttamente");
	}
	else {
		echo_debug( "Il messaggio NON e' stato inviato correttamente $result<br>" );
		return array(false,"Il messaggio NON e' stato inviato correttamente $result");
 	}
}

?>
