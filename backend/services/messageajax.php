<?php

require_once("../etc/db_config.php");
require_once("crud.php");
require_once('messages.php');

	function errore($error_reason)
	{
		$result["succes"]=false;
		$result["errors"]["reason"]=$error_reason;
		echo json_encode($result);
		exit;
	}

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
		case 'mail':
			$res=simfito_sendmail($_REQUEST['to'],$_REQUEST['subject'],$_REQUEST['body']);
			if ($res[0])
				$result["success"] = true;
			else
				errore($res[1]);
		break;
		case 'sms':
			$res=simfito_sendsms($_REQUEST['to'],$_REQUEST['body']);
			if ($res[0])
				$result["success"] = true;
			else
				errore($res[1]);
		break;
		case 'mailtecnici':
			//var_dump($_REQUEST);
			//exit(0);
			$all = (isset($_REQUEST['all']) ? true : false );
			$toid = (isset($_REQUEST['to']) ? json_decode($_REQUEST['to'],true) : '');
			$subject = $_REQUEST['subject'];
			$body = $_REQUEST['msg'];
			if ($all) {
				$sql = "SELECT id_tecnico,email,cognome || ' ' || nome as tecnico FROM tecnici WHERE idtipo_tecnico>1 AND email<>'' and not cancellato";
			}
			else {
				$tolist = implode(',',$toid);
				$sql = "SELECT id_tecnico,email,cognome || ' ' || nome as tecnico FROM tecnici WHERE id_tecnico in ($tolist) AND email<>'' and not cancellato";
			} 
			$db->Read($sql);
			$sentmail=0;
			while($r = $db->fetch_assoc()) {
				$res = simfito_sendmail($r['email'],$subject,$body);
				$resx[$r[id_tecnico]] = array('tecnico'=> $r['tecnico'] , 'result' => $res);
				$sentmail++;
			}
			$result['success'] = true;
			$result['all'] = ($all ? 'true' : 'false');
			$result['to'] = $toid;
			$result['subject'] = $subject;
			$result['msg'] = $body;
			$result['sentmail'] = $sentmail;
			$result['sql'] = $sql;
			$result['report'] = $resx;
		break;
		case 'mailtecnici1':
			//var_dump($_REQUEST);
			$all = false;
			$togroup = (isset($_REQUEST['toGroup']) ? json_decode($_REQUEST['toGroup'],true) : '' );
			$toid = (isset($_REQUEST['to']) ? json_decode($_REQUEST['to'],true) : '');
			$subject = $_REQUEST['subject'];
			$body = $_REQUEST['msg'];

			if ( in_array(-2,$togroup) && count($toid)>0 ) {
				$tecnicisel = 'id_tecnico in (' . implode(',',$toid) . ')';
			}
			else
				$tecnicisel = 'false';
			$tecnicisel .= ' or ';

			if ( in_array(-1,$togroup) ) {
				$tecnicisel .= 'true';
			}
			else if (count($togroup)>0) {
				$tecnicisel .= 'idtipo_tecnico in (' . implode(',',$togroup) . ')';
			}
			else {
				$tecnicisel .= 'false';
			}
			$sql = "SELECT distinct id_tecnico,email,cognome || ' ' || nome as tecnico FROM tecnici WHERE ($tecnicisel) AND email<>'' and not cancellato";

			$db->Read($sql);
			$sentmail=0;
			while($r = $db->fetch_assoc()) {
				$res = simfito_sendmail($r['email'],$subject,$body);
				$resx[$r[id_tecnico]] = array('tecnico'=> $r['tecnico'] , 'result' => $res);
				$sentmail++;
			}
			$result['success'] = true;
			$result['to'] = $toid;
			$result['togroup'] = $togroup;
			$result['subject'] = $subject;
			$result['msg'] = $body;
			$result['sentmail'] = $sentmail;
			$result['sql'] = $sql;
			$result['report'] = $resx;

		break;
		default:
			$result['success'] = true;
			$result['error'] = "mode sconosciuto";		
		break;
	}
	
	echo json_encode($result);
}

?>
