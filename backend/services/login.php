<?php
// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

require_once("crud.php");
require_once("../etc/db_config.php");
require_once('messages.php');

$username = $_REQUEST["loginUsername"];
$password = $_REQUEST["loginPassword"];

function login_chk($user, $pas)
{
	global $connection;
	global $user_tb;
	$user_field="username";
	$password_field="pswrd";
	$user_db=new CRUD($connection);
	if (!$user_db->connect()) {
		error_log("LOGIN: Failed to connect to database");
		return ['chk' => false, 'error' => 'DB connection failed'];
	}
	error_log("LOGIN: Connected to DB, attempting login for user: $user");
	if (!$user_db->SQL("SET search_path TO public, simfito, eppo")) {
		error_log("LOGIN: Failed to set search_path");
		return ['chk' => false, 'error' => 'Failed to set search path'];
	}
	// After SET search_path, reference the table without schema prefix
	$sql="SELECT * FROM tecnici
	 	LEFT JOIN tipo_tecnico ON tipo_tecnico.idtipo_tecnico=tecnici.idtipo_tecnico
		WHERE \"$user_field\"='$user' AND \"$password_field\"='$pas' AND validated AND NOT cancellato";
	error_log("LOGIN: Executing query: $sql");
	$user_db->Read($sql);
	$result=$user_db->fetch_assoc();
	if($result) {
		error_log("LOGIN: User found: " . $result['username']);
		$result['chk']=true;
	} else {
		error_log("LOGIN: User not found or query failed");
		$result['chk']=false;
	}
	return $result;
}

function chk_user($field,$value,$upper)
{
	global $db;
	global $user_tb;
	$db->connect();
	$db->SQL("SET search_path TO public, simfito, eppo");
	if($upper)
		$where="where \"$field\"=upper('$value')";
	else
		$where="where \"$field\"='$value'";
	$sql="SELECT count(*) as number FROM \"$user_tb\" $where";
	$db->Read($sql);
	$result=$db->fetch_assoc();
	return $result['number'];
}

function chk_user2($field,$value,$field2,$value2)
{
	global $db;
	global $user_tb;
	$db->connect();
	$db->SQL("SET search_path TO public, simfito, eppo");
	if(true)
		$where="where \"$field\"=upper('$value') and $field2='$value2'";
	else
		$where="where \"$field\"='$value' and $field2='$value2'";
	$sql="SELECT count(*) as number FROM \"$user_tb\" $where";
	$db->Read($sql);
	$result=$db->fetch_assoc();
	return $result['number'];
}

function celchk($cellulare)
{
	if (substr_compare($cellulare,"+39",0,3)){
		if(!substr_compare($cellulare,"0039",0,4)){
			$tmp=ltrim($cellulare,"0");
			$tmp=ltrim($cellulare,"0");
			$cellulare="+$tmp";
		}else
			$cellulare="+39$cellulare";
	}
	return $cellulare;
}

function pg_str_escape($array)
{
	foreach ($array as $field=>$value)
		$return[$field]=pg_escape_string($value);
	return $return;
}

function errore($error_reason)
{
	$result["succes"]=false;
	$result["errors"]["reason"]=$error_reason;
	echo json_encode($result);
	exit;
}

function salva($sql)
{
	global $connection;
	$db=new CRUD($connection);
	if(!$db->connect())
		errore("errore di connessione");
	$db->SQL("SET search_path TO public, simfito, eppo");
	if(!$db->SQL($sql))
		errore("Errore nella query");
	$result["success"] = true;
	return $result;
}

function salva_user($sql,$nome,$cognome,$mail)
{
	global $connection;
	$db=new CRUD($connection);
	if(!$db->connect())
		errore("errore di connessione");
	$db->SQL("SET search_path TO public, simfito, eppo");
	$id=$db->SQLReturn($sql);
	if(!$id)
		errore("Errore nella query");
	$sql_seq="CREATE SEQUENCE idtecnico_$id
			INCREMENT 1
			MINVALUE 0
			MAXVALUE 9223372036854775807
			START 1
			CACHE 1;
		ALTER TABLE idtecnico_$id
			OWNER TO postgres";
	if(!$db->SQL($sql_seq))
		errore("Errore nella query");

	/*Invio mail alert (leggere da db)*/
	$body="$nome $cognome ha richiesto l'accreditamento a SIMFITO! $mail";
	simfito_sendmail('r.griffo@maildip.regione.campania.it','Nuova richiesta di credenziali',$body);

	$result["success"] = true;
	return $result;
}

function readJson($sql)
{
	global $db;
	$db->connect();
	$db->SQL("SET search_path TO public, simfito, eppo");
	echo $db->ReadTableAsJson($sql);
}

global $connection;
global $att_path;
$db=new CRUD($connection);
if($_SERVER['REQUEST_METHOD'] == "OPTIONS")
{
    header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
	header('Access-Control-Allow-Headers: X-PINGARUNER, X-Requested-With');
	header('Access-Control-Max-Age: 1728000');
	header("Content-Length: 0");
	header("Content-Type: text/plain");
}
else{
	header("Access-Control-Allow-Origin: *");
	/*header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: X-PINGOTHER, Content-Type");*/

	$mode=$_REQUEST['mode'];



	switch($_REQUEST['mode']){
		case 'simfito':
			$users=login_chk($username,$password);
			if($users['chk']){
				$result["success"] = true;
				$result["id"]=$users['id_tecnico'];
				$result["tipo"]=$users['idtipo_tecnico'];
				$result["provincia"]=$users['id_provincia'];
				$result["nome"]=$users['nome']." ".$users['cognome'];
				$result["tipotecnico"]=$users['tipotecnico'];
				$_SESSION["id"]=$users['id_tecnico'];
				$_SESSION["tipo"]=$users['idtipo_tecnico'];
			} else {
				$result["success"] = false;
				$result["errors"]["reason"] = "User name o password errata. Controllare i dati e riprovare, grazie.";
			}
			echo json_encode($result);
		break;
		case 'webgis':
			$result["success"] = true;
			$_SESSION["id"]=-999;
			$_SESSION["tipo"]='ospite';
			echo json_encode($result);
		break;
		case "tipotecnico":
			$sql="SELECT idtipo_tecnico, tipotecnico
				FROM tipo_tecnico
				ORDER BY idtipo_tecnico";
			readJson($sql);
		break;
		case "idprovince":
			$sql="SELECT id, sigla, denominazione
				FROM province
				ORDER BY sigla";
			readJson($sql);
		break;
		case "newuser":
			//echo chk_user('codicefiscale',$_REQUEST['codicefiscale'],true);
			if (($_REQUEST['idtipo_tecnico']==1)&&($_REQUEST['id']=='')){
				$result["success"]=false;
				$result["errors"]["reason"] = "Per l'amministratore Provinciale è necessario inserire la pronvicia!";
			}elseif(chk_user2('codicefiscale',$_REQUEST['codicefiscale'],'idtipo_tecnico',$_REQUEST['idtipo_tecnico'])){
				//echo '1';
				$result["success"]=false;
				$result["errors"]["reason"] = "Risulta gi&agrave; presente una richiesta relativa al codice fiscale $_REQUEST[codicefiscale] per il tipo tecnico selezionato.\n E' necessario attendere che l'amministratore autorizzi tale richiesta.\n Grazie.";
			}else{
				if($_REQUEST['data_inizio_att']=='')
					$data_inizio_att='01/01/0001';
				else
					$data_inizio_att=$_REQUEST['data_inizio_att'];
				if($_REQUEST['data_nascita']=='')
					$data_nascita='01/01/0001';
				else
					$data_nascita=$_REQUEST['data_nascita'];
				if ($_REQUEST['id']==''){
					$id_provinciaH="";
					$id_provinciaV="";
				}else{
					$id_provinciaH=",id_provincia";
					$id_provinciaV=",'$_REQUEST[id]'";
				}
				if($_REQUEST['mobile']!='')
					$mobile=celchk($_REQUEST['mobile']);
				else $mobile='';
				$toescape=Array("residenza_indirizzo"=>$_REQUEST['residenza_indirizzo'], "residenza_comune"=>$_REQUEST['residenza_comune'], "web"=>$_REQUEST['web'],"nome"=>$_REQUEST['nome'],"cognome"=>$_REQUEST['cognome'],"comune_nascita"=>$_REQUEST['comune_nascita']);
				$escaped=pg_str_escape($toescape);
				$username=trim($_REQUEST['username']);
				$psw=strrev(sprintf("%08X",time()+time()));
				$sql="INSERT INTO
					tecnici
						(idtipo_tecnico,nome,cognome,email,username,pswrd,ufficio,codicefiscale,data_inizio_att,data_nascita,sesso,comune_nascita,provincia_nascita,titolo,cap_ufficio $id_provinciaH,
						 residenza_comune, residenza_indirizzo,web,telefono,mobile,validated)
					VALUES
						('$_REQUEST[idtipo_tecnico]','$escaped[nome]','$escaped[cognome]','$_REQUEST[email]','$_REQUEST[codicefiscale]','$psw','$_REQUEST[ufficio]',upper('$_REQUEST[codicefiscale]'),
						to_date('$data_inizio_att','DD/MM/YYYY'),to_date('$data_nascita','DD/MM/YYYY'),'$_REQUEST[sesso]','$escaped[comune_nascita]','$_REQUEST[provincia_nascita]','$_REQUEST[titolo]',
						'$_REQUEST[cap_ufficio]' $id_provinciaV, '$escaped[residenza_comune]', '$escaped[residenza_indirizzo]', '$escaped[web]','$_REQUEST[telefono]','$mobile',false)
					RETURNING id_tecnico";
				$result=salva_user($sql,$_REQUEST['nome'],$_REQUEST['cognome'],$_REQUEST['email']);
			};
			echo json_encode($result);
		break;
		case "pswresend":
			$testo="";
			$sql="SELECT username,pswrd,email from tecnici where codicefiscale=upper('$_REQUEST[codicefiscale]') AND NOT cancellato";
			$db->connect();
			$db->SQL("SET search_path TO public, simfito, eppo");
			$db->Read($sql);
			if($db->RecNo()==0)
				errore("codice fiscale non registato");
			else {
				while($feature=$db->fetch_assoc()){
					$testo.="username: $feature[username] - password: $feature[pswrd]\n";
					$email=$feature['email'];
				}
				$body="Di seguidto troverà le credenziali per l'accesso a sinfito come da richiesta.\n".$testo;
				$body.="\nDistinti Saluti\n";
				simfito_sendmail($email,'Recupero credenziali',$body);
				echo json_encode(['success'=>true]);
			}
		break;
	}
}

?>
