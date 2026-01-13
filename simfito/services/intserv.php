<?php

// 
// gestione DA simfitolab a simfito
// 
require_once("../../etc/db_config.php");
require_once("crud.php");

function set_risultato($hostcode,$pestcode,$simfito_code,$result)
{
	global $db;
	
	$sql0="SELECT b_code as code 
		  FROM t_baycode
		  INNER JOIN t_bayname on t_baycode.codeid=t_bayname.codeid
		  WHERE t_bayname.nameid=$hostcode";
	$h_code=$db->FetchRow($sql0);
	$sql1="SELECT b_code as code
		  FROM t_baycode
		  INNER JOIN t_bayname on t_baycode.codeid=t_bayname.codeid
		  WHERE t_bayname.nameid=$pestcode";
	$p_code=$db->FetchRow($sql1);
	
	$sql="UPDATE osservazioni SET risultato='$result' WHERE campionecode='$simfito_code' AND hostcode='$h_code[code]' AND pestcode='$p_code[code]'";
	if(!$db->SQL($sql))
		errore("Errore nella query");
}

function set_rejected($reason_rejection,$simfito_code)
{
	global $db;
	//se è rigettata nel campo parent_code, viene copiato il codice campione che sarà, a sua volta, copiato nella nuova osservazione presa da questa.
	$sql="UPDATE osservazioni SET risultato='Rigettata per: $reason_rejection', parent_code='$simfito_code', rigettata=true WHERE campionecode='$simfito_code'";
	if(!$db->SQL($sql))
		errore("Errore nella query");
	/*$sql0="UPDATE scheda SET stato=-1, \"motivo-rigetto\"='Campione $simfito_code non idoneo' where idscheda in (select idscheda from osservazioni where campionecode='$simfito_code')";
	if(!$db->SQL($sql0))
		errore("Errore nella query");*/
}

global $connection;
$f = fopen('/tmp/simfito.log','a');
fwrite($f,"-------\n");

$db=new CRUD($connection);
if(!$db->connect())
	echo "errore di connessione";

$key="slab!2014";

$requestURI=$_SERVER['REQUEST_URI'];

fwrite($f,"requestURI:\n");
fwrite($f,$requestURI . "\n");
	
$parts = explode('/', $requestURI);
$partsLen=count($parts);

fwrite($f,"partslen=" . $partsLen . "\n");

if ($partsLen>0){
	$token=$parts[$partsLen-1];
	$payload=file_get_contents('php://input');
	
	$data = json_decode($payload,true);	

	$hash=md5($data['simfitoCode'].$key);
	fwrite($f,"payload=" . $payload . "; simfitoCode=" . $data['simfitoCode'] . "; hash=" . $hash . " - token=" . $token . "\n");
	if ($hash==$token){
		fwrite($f,"ok\n");
		//Azioni di esempio
		/*file_put_contents("payload.json",$payload);
		$object = print_r($data, true);
		file_put_contents("object.dump",$object);*/
		
		if(!$data['suitable'])
			set_rejected($data['reasonRejection'], $data['simfitoCode']);
		else {
			foreach($data["guestSimfitoList"] as $list){
				$hostcode=$list["codeidBayer"];
				foreach($list["parasiteSimfitoList"] as $response){
					$result='negativo';
					if($response['positive'])
						$result='positivo';
					set_risultato($hostcode, $response['codeidBayer'], $data['simfitoCode'],$result);
				}
			}
		}		
		echo "success";
	}else{
		fwrite($f,"error A\n");
		echo "Not Authorized! A";
	}
}else{
	fwrite($f,"error B\n");
	echo "Not Authorized! B";
}

?>
