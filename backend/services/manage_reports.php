<?php
//
// gestione dei report[UE] salvati
//
session_start();

require_once("../etc/db_config.php");
require_once("crud.php");

function readJson($sql,$extra='')
{
	global $db;
	echo $db->ReadTableAsJson($sql,$extra);
}

function delete_file($id)
{
	global $db;
	$db->SQL("UPDATE simfito.reports_uff SET statoreport_id=4 WHERE id=$id;");
	$result = ['success'=>true];
	return $result;
}

// NON USATO
function zip_file($dir)
{
	global $reports_path;
	$zipdir = "$reports_path";
	$backupFile="/tmp/scheda$dir.zip";
	@unlink($backupFile);
	exec("zip -j $backupFile $zipdir/*");

	header("Content-type: application/zip");
	header("Content-Disposition: attachment; filename=scheda$dir.zip");
	header("Content-Description: Backup");
	header("Content-Length: ".filesize($backupFile));
	readfile($backupFile);
}

function get_file($id) {
	global $reports_path;
	global $db;
	$sql = "SELECT fullfilename FROM simfito.reports_uff WHERE id=$id";
	$r = $db->Fetchrow($sql);
	$fname = $r['fullfilename'];
	$fnamex = "$reports_path$id";
	header("Content-type: application/octet-stream");
	header("Content-Disposition: attachment; filename=$fname");
	header("Content-Description: Report");
	header("Content-Length: ".filesize($fnamex));
	readfile($fnamex);
}

function save_file() {
	global $reports_path;
//	global $_FILES;
	global $db;
	$uploaddir = $reports_path;
	$name = pg_escape_string('');
	$anno = $_REQUEST['year'];
	$owner = (isset($_REQUEST['uid']) ? $_REQUEST['uid'] : 3); //$_SESSION["id"]; NOTA BENE: la sessione non e' attiva
	$date = 'now()';
	$statoreport_id = 2;
	$fullfilename = pg_escape_string($_FILES['report']['name']);

	$values = "'$name',$anno,$owner,$date,$statoreport_id,'$fullfilename'";

	$sql = "INSERT INTO simfito.reports_uff(name,anno,owner,date,statoreport_id,fullfilename) VALUES($values) RETURNING id;";

	$idx = $db->ReadValueSQL($sql);
	$uploadfile = $uploaddir . $idx;
	if (move_uploaded_file($_FILES['report']['tmp_name'], $uploadfile)) {
		$result = ["success"=>true,"file"=>$_FILES['report']['name'] ];
	} 
	else {
		$result = [
			"success" => false,
			"errors" => ["reason"=>"Errore nel caricamento del report"]]; //,'sql' => $sql,'fname' => $uploadfile,'session'=>$_SESSION ] ];
	}
	return $result;
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
	$mode = ( isset($_REQUEST['mode']) ? $_REQUEST['mode'] : '' );

//	var_dump($_REQUEST);
//	exit(0);

	switch($mode){
		case'':
		case 'read':
			$sql = "SELECT reports_uff.*,tecnici.cognome || ' ' || tecnici.nome AS owner_name FROM simfito.reports_uff INNER JOIN simfito.tecnici ON tecnici.id_tecnico=reports_uff.owner WHERE statoreport_id=2";
			readJson($sql);
		break;
		case 'add':
			$res = save_file();
			echo json_encode($res);
		break;
		case 'delete':
			$res = delete_file($_REQUEST['id']);
			echo json_encode($res);
		break;
		case 'get':
		case 'download':
			get_file($_REQUEST['id']);
		break;
		case 'zip':
			zip_file($_REQUEST['dir']);
		break;
		default:
			echo json_encode(['success'=>false, 'reason'=>"Errore generico"]);
		break;
	}
}
?>
