<?php

require_once("../etc/db_config.php");
require_once("crud.php");

$lifetime=3600;
session_start();
setcookie(session_name(),session_id(),time()+$lifetime);

if($_SERVER['REQUEST_METHOD'] == "OPTIONS"){
    header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
	header('Access-Control-Allow-Headers: X-PINGARUNER, X-Requested-With');
	header('Access-Control-Max-Age: 1728000');
	header("Content-Length: 0");
	header("Content-Type: text/plain");
}
else{
	header("Access-Control-Allow-Origin: *");

	$destid = (isset($_REQUEST['destid']) ? $_REQUEST['destid'] : '');
	$srcid = (isset($_REQUEST['srcid']) ? $_REQUEST['srcid'] : '' );

	if ($destid=='' || $srcid=='') {
		exit(0);
		echo json_encode(['success'=>false]);
	}

	global $connection;
	global $att_path;
	$db=new CRUD($connection);
	$db->connect();
	if (true) {
		$db->SQL("SET search_path TO public, simfito, eppo");

		$sql = "SELECT partita_iva FROM azienda WHERE id_azienda=$destid";
		$r = $db->FetchRow($sql);
		$destiva = $r['partita_iva'];

		$sql = "SELECT partita_iva FROM azienda WHERE id_azienda=$srcid";
		$r = $db->FetchRow($sql);
		$srciva = $r['partita_iva'];

		$sql = "UPDATE siti SET piva_azienda='$destiva' WHERE piva_azienda='$srciva'";
		$db->SQL($sql); 

		$db->SQL("DELETE FROM azienda WHERE id_azienda=$srcid"); 
	}

		echo json_encode(['success'=>true]);

}

?>
