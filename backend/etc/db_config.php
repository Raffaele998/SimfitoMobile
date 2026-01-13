<?php

	$hostpg  = '192.168.1.19';
	$connection="host=$hostpg port=5432 user=postgres password=ariespac3 dbname=simfito4";
	$user_tb="simfito.tecnici";  // Schema aggiunto
	$att_path="./uploads/";
	$reports_path = "./reports/";

	// supporto mail!!!
	$smtpauth     = 0;
	$smtpport     = 25;
	$smtpserver   = '192.168.10.10';

	$smtpfrom     = 'simfito@simfito.org';
	$smtpusername = '';
	$smtppassword = '';

	// supporto sms!!!
	$mobytmittente = 'SIMFITO';
	$mobytlogin = 'C09088_HQS';
	$mobytpasswd= 't47mngvj';
?>
