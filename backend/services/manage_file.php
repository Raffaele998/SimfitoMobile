<?php
require_once("../etc/db_config.php");
require_once("crud.php");

function delete($dir,$file)
{
	global $att_path;
	global $db;

	$deldir = "$att_path$dir/";
	$delfile = "$deldir$file";

	if (unlink($delfile)) {
		$result= json_encode(['success'=>true]);
		$db->SQL("UPDATE scheda SET numattach=numattach-1 WHERE idscheda=$dir AND numattach>0");
	} else {
		$result=json_encode(['success'=>false, 'reason'=>"Errore nell'eliminazione del file"]);
	}
	return $result;
}

function zip($dir)
{
	global $att_path;
	$zipdir = "$att_path$dir";
	$backupFile="/tmp/scheda$dir.zip";
	@unlink($backupFile);
	exec("zip -j $backupFile $zipdir/*");

	header("Content-type: application/zip");
	header("Content-Disposition: attachment; filename=scheda$dir.zip");
	header("Content-Description: Backup");
	header("Content-Length: ".filesize($backupFile));
	readfile($backupFile);
}

/********** MAIN **********/
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

	$db=new CRUD($connection);
	$db->connect();
	$db->SQL("SET search_path TO public, simfito, eppo");

	$mode=$_REQUEST['mode'];

	switch($mode){
		case 'delete':
			$result=delete($_REQUEST['dir'],$_REQUEST['file']);
		break;
		case 'zip':
			$result=zip($_REQUEST['dir']);
		break;
		default:
			$result=json_encode(['success'=>false, 'reason'=>"Errore generico"]);
		break;
	}
	echo $result;
}
?>
