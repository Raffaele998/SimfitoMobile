<?php
require_once("../etc/db_config.php");
require_once("crud.php");

function save_file($idscheda)
{
	global $att_path;
	global $_FILES;
	global $db;
	@mkdir("$att_path$idscheda",0777);
	$uploaddir = "$att_path$idscheda/";
	$uploadfile = $uploaddir . $_FILES['file']['name'];

	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
		$result=Array("success"=>true,"file"=>$_FILES['file']['name']);
		$db->SQL("UPDATE scheda SET numattach=numattach+1 WHERE idscheda=$idscheda");
	} else {
		$result=Array("success"=>false,"errors"=>Array("reason"=>"Errore nel caricamento dell'allegato"));
	}
	return $result;
}
/********** MAIN **********/
session_start();

/*if(!isset($_SESSION["id"])){
	header("location:index.html");
}*/
global $att_path;

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

	$result=save_file($_REQUEST['scheda']);

	echo json_encode($result);
}
?>
