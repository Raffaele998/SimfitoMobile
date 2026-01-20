<?php
require_once("crud.php");
require_once("../etc/db_config.php");
require_once('messages.php');

function errore($error_reason)
{
	$result["succes"]=false;
	$result["errors"]["reason"]=$error_reason;
	echo json_encode($result);
	exit;
}

function errore_confirm($error_msg)
{
	$result["succes"]=false;
	$result["errors"]["reason"]="confirm";
	$result["errors"]["msg"]=$error_msg;
	echo json_encode($result);
	exit;
}

function salva($sql)
{
	global $db;
	if(!$db->SQL($sql))
		errore("Errore nella query: ".$sql);
	$result["success"] = true;
	//$result["sql"] = $sql;
	return $result;
}

// esegue una query di "inserimento" che ritorna l'id 
function salva_return($sql,$fld) {
	global $db;
	$db->Read($sql);
	$r = $db->fetch_assoc();
	$result[$fld] = $r[$fld];
	$result["success"] = true;
	//$result["sql"] = $sql;
	return $result;
}

function conferma_user($id_tecnico)
{
	global $db;
	$sql="UPDATE tecnici SET validated=true WHERE id_tecnico='$id_tecnico'";
	if(!$db->SQL($sql))
		errore("Errore nella query: ".$sql);
	$sql2="SELECT nome,cognome,username,pswrd,email
			FROM tecnici
			WHERE id_tecnico='$id_tecnico'";
	send_confirm($sql2);
	$result["success"] = true;
	return $result;
}

function salva_user($sql)
{
	global $db;
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
	$result["success"] = true;
	$sql3="SELECT nome,cognome,username,pswrd,email
		FROM tecnici
		WHERE id_tecnico='$id'";
	send_confirm($sql3);
	return $result;
}

function salva_scheda($sql)
{
	global $db;
	$query_res=$db->SQLReturn($sql);
	if(!$query_res){
		errore("Errore nella query: ".$sql);
	}
	return $query_res;
}

function salva_scheda_return($sql)
{
	global $db;
	$return=$db->SQLReturn($sql);
	if(!$return)
		errore("Errore nella query: $sql");
	$result["returned"]=$return;
	return $result;
}

function list_gen($id_org)
{
	$lista="(";
	$tmp=str_replace("[\"","",$id_org);
	$tmp=str_replace("\"]","",$tmp);
	$str_v=explode("\",\"",$tmp);
	for ($i=0;$i<count($str_v);$i++){
		if($i!=0) $virgola=",";
		else $virgola="";
		$lista.="$virgola $str_v[$i]";
	}
	$lista.=")";
	return $lista;
}

function chk($presente, $nome_intensity, $nome_grado)
{
	$return=array($presente,$nome_intensity,$nome_grado);
	global $db;

	$db->Read("select id_intensity from intensity where nome_intensity='$nome_intensity'");
	while($res=$db->fetch_assoc()){
		$return[1]=$res['id_intensity'];
	}

	$db->Read("select id_grado from grado_attacco where nome_grado='$nome_grado'");
	while($res=$db->fetch_assoc()){
		$return[2]=$res['id_grado'];
	}
	foreach ($return as $posizione => $valore)
		if($valore=="")
			$return[$posizione]=0;
	/*switch ($return[1]){
		case "Nullo":
			$return[1]="0";
		break;
		case "Basso":
			$return[1]="1";
		break;
		case "Medio":
			$return[1]="2";
		break;
		case "Alto":
			$return[1]="3";
		break;
	}
	switch ($return[2]){
		case "Nullo":
			$return[2]="0";
		break;
		case "Pianta Singola":
			$return[2]="1";
		break;
		case "Gruppi di Pianta":
			$return[2]="2";
		break;
		case "Impianti":
			$return[2]="3";
		break;
		case "Pieno Campo":
			$return[2]="4";
		break;
		case "Serra":
			$return[2]="5";
		break;
	}*/
	return $return;
}

function pg_str_escape($array)
{
	foreach ($array as $field=>$value)
		$return[$field]=pg_escape_string($value);
	return $return;
}

function save_file($idscheda)
{
	global $db;
	$uploaddir = '/var/www/simfito-test/uploads/';
	$uploadfile = $uploaddir . $_FILES['file']['name'];

	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
		$result['succes']=true;
		//$db->SQL("UPDATE shceda SET numattach=numattach+1 WHERE idscheda=$idscheda");
	} else {
		$result['succes']=false;
		$result["errors"]["reason"] = "Errore nel caricamento dell'allegato -".$_FILES['file']['tmp_name'];
	}
	return $result;
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

function send_confirm($sql)
{
	global $db;
	$db->Read($sql);
	while ($risultato=$db->fetch_assoc()){
		$nome=$risultato['nome'];
		$cognome=$risultato['cognome'];
		$username=$risultato['username'];
		$pswrd=$risultato['pswrd'];
		$email=$risultato['email'];
	}
	$body="Gentile $nome $cognome, la Sua richiesta di accesso al sistema S.I.M.Fito e' stata accettata.\n";
	$body.="Potrà effettuare il login all'indirizzo www.simfito.org utilizzando le seguneti credenziali:\n";
	$body.="username=$username;\npassword=$pswrd.\n";
	$body.="Credenziale che, comunque, potrà modificare utilizzando il tasto \"Dati Utente\" in alto a destra della pagina personale.\nGrazie!";
	simfito_sendmail($email,"Credenziali per l'accesso a S.I.M.Fito",$body);
}

function duplica($idScheda,$nuova_data,$nuovo_protocollo,$motivo,$idtecnico='')
{
	global $db;
	if($idtecnico==''){
		$idtecnico='id_tecnico';
	}
	$sql0="INSERT INTO scheda (idtipo_visita,id_tecnico,stato,data_sopralluogo,gid_sito,protocollo)
			SELECT $motivo, $idtecnico, '0', to_date('$nuova_data','DD/MM/YYYY'), gid_sito, '$nuovo_protocollo'
			FROM scheda
			WHERE idscheda=$idScheda
			RETURNING idscheda";
	$idnew=$db->SQLReturn($sql0);
	if(!$idnew)
		errore("Errore nella query");
	else{
		//se l'osservazione viene da una rigettata in parent_code è stato memorizato il codice del campione precedente.
		$sql1="INSERT INTO osservazioni (idscheda,hostcode,pestcode,rilevato,sospetti,stato,attacco_int,attacco_grado,fase_fenologica,n_osservate,organi,
					pericolosita,data_impianto,appezzamento,dens_piante,piante_camp_vis,id_fase_fenologica, parent_code,the_geom,
					unita,unita_chk,peso,peso_chk,lotti,lotti_chk,lotti_camp,tipologiacontrollata_id,provenienza)
				SELECT '$idnew',hostcode,pestcode,rilevato,sospetti,'0',attacco_int,attacco_grado,fase_fenologica,n_osservate,organi,
					pericolosita,data_impianto,appezzamento,dens_piante,piante_camp_vis,id_fase_fenologica, parent_code,the_geom,
					unita,unita_chk,peso,peso_chk,lotti,lotti_chk,lotti_camp,tipologiacontrollata_id,provenienza
				FROM osservazioni
				WHERE idscheda='$idScheda' AND visiva";
		if(!$db->SQL($sql1))
			errore("Errore nella query");
		else {
            $result["success"] = true;
        }
	}

	return $result;
}

function chk_pr($pest,$host)
{
	global $db;
	$toReturn=false;
	$sql="select validato from ordinari where pest='$pest' AND host='$host'";
	$db->Read($sql);
	while($result=$db->fetch_assoc()){
		if($result['validato']=='t')
			errore("La corrispondenza organismo-ospite &egrave; gi&agrave; presente");
		else if($result['validato']=='f')
			errore("Segnalazione gi&agrave; inviata");
	}
	return $toReturn;
}

function chk_azienda($piva)
{
	global $db;
	$toReturn=true;
	$sql="select rag_soc,partita_iva,id_azienda from azienda where partita_iva='$piva'";
	$db->Read($sql);
	while($result=$db->fetch_assoc()){
		if($result['rag_soc']!=''){
			$toReturn=false;
			errore("Azienda già presente: $result[rag_soc]");
		}
	}
	return $toReturn;
}

function chk_obs($idscheda)
{
	global $db;
	$toReturn=true;
	$sql = "SELECT count(*) AS cc FROM simfito.osservazioni WHERE (NOT completa OR tempo IS null OR tempo<=0) AND idscheda=$idscheda 
		AND (trappole_geometry_id is null OR trappole_geometry_id IN  (SELECT id FROM simfito.trappole_geometry))";
	//$sql="SELECT count(*) AS cc FROM simfito.osservazioni WHERE (NOT completa OR tempo IS null OR tempo<=0) AND idscheda=$idscheda AND trappole_geometry_id IN  (SELECT id FROM simfito.trappole_geometry)";
	$db->Read($sql);
	while($result=$db->fetch_assoc()){
		if($result['cc']>0){
			$toReturn=false;
		}
	}
	return $toReturn;
}

function chk_point($x,$y)
{
	global $db;
	global $my_prj;
	$toReturn=true;
	if(($x<396203)||($x>568580)||($y<4426787)||($y>4595428)) {
		$toReturn=false;
	} else {
		$sql="select st_transform(GeometryFromText('POINT($x $y)', $my_prj),4326) as chkpoint";
		if(!$db->SQL($sql)){
			$toReturn=false;
		}
	}
	return $toReturn;
}

function chk_sito_old($lon,$lat)
{
	global $db;
	$buffer=200;
	$list="";
	$sql="select denominaz as denominazione, siti.localita ,siti.indirizzo, comuni.nome as comune,rag_soc as azienda
		from siti
		left join azienda on piva_azienda=partita_iva
		left join comuni on comune_istat=istat
		where st_intersects(
			st_buffer(
				GeometryFromText('POINT($lon $lat)', 32633), $buffer
			),st_transform(siti.the_geom,32633)
		)";
	$db->Read($sql);
	while ($row=$db->fetch_assoc()){
		if($list!="") $list.=";<br>";
		$list.="Denominazione: '".$row['denominazione']."'; Comune: ".$row['comune']."; localit&agrave;: ".$row['localita']."; indirizzo: ".$row['indirizzo']." ";
		$list.="Azienda: ".$row['azienda'];
		$found=true;
	}
	if($list!=""){
		errore_confirm($list);
	}
}

function chk_sito_in_campania($geom) {
	global $db;
	$sql = "SELECT st_intersects(the_geom, st_transform(ST_GeomFromGeoJSON('$geom'),32633) as inside FROM campania";
	$db->Read($sql);
	return $db->fetch_assoc();
}

function getArea($idscheda)
{
    global $db;
    $sql="SELECT siti.superficie_ha AS area FROM scheda INNER JOIN siti ON scheda.gid_sito=siti.gid WHERE scheda.idscheda=$idscheda";
    $db->Read($sql);
    while ($row=$db->fetch_assoc()){
        $area=$row['area'];
    }
    return $area;
}

function getCampioneFromOsservazione($id)
{
	global $db;
	$campioniid=-1;
	$sqlA="SELECT coalesce(campioni_id,-1) AS campioniid FROM osservazioni WHERE idosservazioni=$id";
	$db->Read($sqlA);
	while($res=$db->fetch_assoc()){
		$campioniid=$res['campioniid'];
	}
	return $campioniid;
}

function countCampioniId($campioniid)
{
	global $db;
	$ccamp=0;
	$sqlCC="SELECT count(*) as cc from osservazioni WHERE campioni_id='$campioniid'";
	$db->Read($sqlCC);
	while($count=$db->fetch_assoc()){
		$ccamp=$count['cc'];
	}
	return $ccamp;
}

function obsupdateprepare($obsid,$newcid)
{
	global $db;
	$campioneid=getCampioneFromOsservazione($obsid);
	if($campioneid!=$newcid){
		if($campioneid>0){
				$ccamp=countCampioniId($campioneid);
				if($ccamp==1){
					salva("DELETE FROM campioni WHERE id='$campioneid'");
				}
		}
	}
}
/********** MAIN **********/
$lifetime=3600;
/*session_start();
setcookie(session_name(),session_id(),time()+$lifetime);*/

global $connection;
$db=new CRUD($connection);

if($_SERVER['REQUEST_METHOD'] == "OPTIONS"){
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
	header('Access-Control-Allow-Headers: X-PINGARUNER, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Max-Age: 1728000');
	header("Content-Length: 0");
	header("Content-Type: text/plain");
	exit(0);
}
else{
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-PINGARUNER, X-Requested-With, Content-Type, Accept');

	if(!$db->connect()){
		errore("errore di connessione");
	}
	$db->SQL("SET search_path TO public, simfito, eppo");
	/*if(!isset($_SESSION["id"])){
		errore("Sessione Scaduta! Si prega di riloggarsi!");
	}*/

	// Supporta sia 'fase' (legacy) che 'mode' (nuovo standard)
	$fase = isset($_REQUEST['mode']) ? $_REQUEST['mode'] : $_REQUEST['fase'];
	$my_prj=32633;

	switch($fase){
		case "changelogread":
			$sql="update tecnici set read=true where id_tecnico=$_REQUEST[uid]";
			$result=salva($sql);
		break;
		case "hide-news":
			$newsid = $_REQUEST['id'];
			$sql = "UPDATE news SET deleted=not deleted WHERE id=$newsid";
			$result = salva($sql);
		break;
		case "delete-news":
			$newsid = $_REQUEST['id'];
			$sql = "DELETE FROM news WHERE id=$newsid";
			$result = salva($sql);
		break;
		case "update-news":
			$newsid = $_REQUEST['id'];
			$nn = pg_escape_literal($_REQUEST['news']);
			if ($newsid==-1) {
				$sql = "INSERT INTO news(news) VALUES($nn) RETURNING id";
			}
			else {
				$sql = "UPDATE news SET news=$nn WHERE id=$newsid RETURNING id";
			}
			$result = salva($sql);
		break;
		case "scheda-generale":
			$id_tecnico=$_REQUEST['idTecnico'];
			$escaped=pg_str_escape($_REQUEST);
			if(is_numeric($_REQUEST['id_sito'])){
				$id_sito=$_REQUEST['id_sito'];
			}
			else {
				$id_sito=-1;
			}
			$sql="INSERT INTO
					scheda (idtipo_visita,id_tecnico,data_sopralluogo,stato,gid_sito,protocollo,note)
				  VALUES
					($escaped[motivo],$id_tecnico,to_date('$_REQUEST[data]','DD/MM/YYYY'),0,$id_sito,'$escaped[protocollo]','$escaped[note]')
				  RETURNING idscheda";
			$result=salva_scheda_return($sql);
			$result["success"] = true;
		break;
		case "scheda-azienda":
			if(chk_azienda($_REQUEST['piva'])){
				$id_tecnico=$_REQUEST['idTecnico'];

				$escaped=pg_str_escape($_REQUEST);
				$sql="INSERT INTO
						azienda (partita_iva, rag_soc,istat_comune,indirizzo,cap,stato,referente,posizione_ref,telefono,fax,email,id_tecnico)
					  VALUES
						('$_REQUEST[piva]','$escaped[ragionesociale]','$_REQUEST[comune]','$escaped[indirizzo]','$_REQUEST[cap]',0,'$escaped[referente]','$escaped[posizione_ref]','$_REQUEST[telefono]','$_REQUEST[fax]','$_REQUEST[email]','$id_tecnico')
						RETURNING id_azienda";
				$result1=salva_scheda($sql);
				if($result1){
					if($_REQUEST[tipoazienda]!=''){
						$tipoazienda=json_decode($_REQUEST[tipoazienda]);
						for($i=0;$i<count($tipoazienda);$i++){
							$coma=($i==0)?"":",";
							$values.=$coma."($result1,$tipoazienda[$i])";
						}
						$sql="INSERT INTO azienda_tipoazienda (azienda_id, tipoazienda_id) VALUES $values";
						$result=salva($sql);
					}
				}
			}
			else{
				errore("Azienda Esistente");
			}
		break;
		case "scheda-azienda-old":
			if(chk_azienda($_REQUEST['piva'])){
				$id_tecnico=$_REQUEST['idTecnico'];
				$rup='f';
				$vivaio='f';
				$fito='f';
				if ((isset($_REQUEST['rup'])) && ($_REQUEST['rup']=='on'))
					$rup='t';
				if ((isset($_REQUEST['vivaio'])) && ($_REQUEST['vivaio']=='on'))
					$vivaio='t';
				if ((isset($_REQUEST['fito'])) && ($_REQUEST['fito']=='on'))
					$fito='t';
				$escaped=pg_str_escape($_REQUEST);
				$sql="INSERT INTO
						azienda (partita_iva, rag_soc, rup ,vivaio,istat_comune,indirizzo,cap,stato,fito,referente,posizione_ref,telefono,fax,email)
					  VALUES
						('$_REQUEST[piva]','$escaped[ragionesociale]', '$rup', '$vivaio','$_REQUEST[comune]','$escaped[indirizzo]','$_REQUEST[cap]',0,'$fito','$escaped[referente]','$escaped[posizione_ref]','$_REQUEST[telefono]','$_REQUEST[fax]','$_REQUEST[email]')";
				$result=salva_scheda($sql);
				$result["success"] = true;
			}
			else{
				$result["success"]=false;
			}
		break;
		case "update_protocollo":
			$idscheda = $_REQUEST['idscheda'];
			$protocollox = $_REQUEST['protocollo'];
			$protocollo = pg_escape_string($protocollox);
			$sql = "UPDATE scheda SET protocollo='$protocollo' WHERE idscheda=$idscheda";
			$result=salva($sql);
			$result["success"]=true;
		break;
		case "update-azienda":
			$id_tecnico=$_REQUEST['idTecnico'];
			$rup='f';
			$vivaio='f';
			$fito='f';
			if ((isset($_REQUEST['rup'])) && ($_REQUEST['rup']=='on'))
				$rup='t';
			if ((isset($_REQUEST['vivaio'])) && ($_REQUEST['vivaio']=='on'))
				$vivaio='t';
			if ((isset($_REQUEST['fito'])) && ($_REQUEST['fito']=='on'))
				$fito='t';
			$escaped=pg_str_escape($_REQUEST);
			$sql="UPDATE azienda SET partita_iva='$_REQUEST[piva]', rag_soc='$escaped[ragionesociale]', rup='$rup' ,vivaio='$vivaio',
					istat_comune='$_REQUEST[comune]',indirizzo='$escaped[indirizzo]',cap='$_REQUEST[cap]',fito='$fito',referente='$escaped[referente]',
					posizione_rigettoref='$escaped[posizione_ref]',telefono='$_REQUEST[telefono]',fax='$_REQUEST[fax]',email='$_REQUEST[email]'
				WHERE id_azienda='$_REQUEST[id_azienda]'";
			$result=salva_scheda($sql);
			$result["success"]=true;
		break;
		case "scheda-sito.old":
			if($_REQUEST['chk']=='true'){
				chk_sito($_REQUEST['lon'], $_REQUEST['lat']);
			}
			if(chk_point($_REQUEST['lon'], $_REQUEST['lat'])){
				//echo "$my_prj <br/>";
				$userid=$_REQUEST['userId'];
				//$nscheda=$_REQUEST['nscheda'];
				$superficie=$_REQUEST['superficie'];
				if ($_REQUEST['quota']=='')
					$quota=0;
				else $quota=$_REQUEST['quota'];
				$toescape=Array("denominazione"=>$_REQUEST['denominazione'], "indirizzo"=>$_REQUEST['indirizzo']);
				$escaped=pg_str_escape($toescape);
				$sql="INSERT INTO
						siti (the_geom, piva_azienda, denominaz, comune_istat, localita, superficie_ha, stato, quota)
					VALUES
						(st_transform(GeometryFromText('POINT($_REQUEST[lon] $_REQUEST[lat])', $my_prj),4326),'$_REQUEST[piva]','$escaped[denominazione]','$_REQUEST[comune]',
						'$escaped[indirizzo]', '$superficie' ,0, '$quota')";
				//echo $sql."<br/>";
				$result=salva_scheda($sql);
				$result["success"] = true;
			}else{ errore("Coordinate non valide");}
		break;
		case "scheda-sito":
			/*if($_REQUEST['chk']=='true'){
				chk_sito($_REQUEST['lon'], $_REQUEST['lat']);
			}
			if(chk_point($_REQUEST['lon'], $_REQUEST['lat'])){

			$r = chk_sito_in_campania($_REQUEST['geometry']);*/
			$r['inside']='t';
			if ($r['inside']=='t') {
				$userid=$_REQUEST['userId'];
				$superficie=$_REQUEST['superficie'];
				$quota=($_REQUEST['quota']=='') ? 0 : $_REQUEST['quota'];

				$toescape=Array("denominazione"=>$_REQUEST['denominazione'], "indirizzo"=>$_REQUEST['indirizzo']);
				$escaped=pg_str_escape($toescape);

				$geoJson=$_REQUEST['geometry'];

				$preSQL="SELECT st_isvalid(st_transform(ST_GeomFromGeoJSON('$geoJson'),4326)) as isvalid,
					st_isvalidreason(st_transform(ST_GeomFromGeoJSON('$geoJson'),4326)) as validreason";
				$r=$db->FetchRow($preSQL);
				if($r['isvalid']=='t'){
					$sql="INSERT INTO
							siti (the_geom, piva_azienda, denominaz, comune_istat, localita, superficie_ha, stato, quota, tipologiasito_id)
						VALUES
							(st_transform(ST_GeomFromGeoJSON('$geoJson'),4326),'$_REQUEST[piva]','$escaped[denominazione]','$_REQUEST[comune]','$escaped[indirizzo]', '$superficie' ,0,
							'$quota', $_REQUEST[tipologiasito_id])
						RETURNING gid";
					$result["gid"]=salva_scheda($sql);
					$result["success"] = true;
				}
				else{
					errore("<b>Errore nel disegno del poligono: </b><br/>".$r['validreason']);
				}
			}else{ errore("Il sito non &egrave; stato disegnato in Camapania");}
		break;
		case "scheda-sito-1":
			$userid=$_REQUEST['userId'];
			$superficie=$_REQUEST['superficie'];
			$quota=($_REQUEST['quota']=='') ? 0 : $_REQUEST['quota'];

			$toescape=Array("denominazione"=>$_REQUEST['denominazione'], "indirizzo"=>$_REQUEST['indirizzo']);
			$escaped=pg_str_escape($toescape);

			$geoJson=$_REQUEST['geometry'];
			$preSQL="SELECT st_isvalid(st_transform(ST_GeomFromGeoJSON('$geoJson'),4326)) as isvalid,
				st_isvalidreason(st_transform(ST_GeomFromGeoJSON('$geoJson'),4326)) as validreason";
			$r=$db->FetchRow($preSQL);
			if($r['isvalid']=='t'){
				$sql="INSERT INTO
						siti (the_geom, piva_azienda, denominaz, comune_istat, localita, superficie_ha, stato, quota)
					VALUES
						(st_transform(ST_GeomFromGeoJSON('$geoJson'),4326),'$_REQUEST[piva]','$escaped[denominazione]','$_REQUEST[comune]','$escaped[indirizzo]', '$superficie' ,0,
						'$quota')
					RETURNING gid";
				$gid=salva_scheda($sql);
				if($gid){
					$sql="UPDATE scheda SET gid_sito=$gid WHERE idscheda=$_REQUEST[idscheda]";
					$result=salva($sql);
				}
				else errore("Errore nella query: $sql");
			}
			else{
				errore("<b>Errore nel disegno del poligono: </b><br/>".$r['validreason']);
			}
		break;
		case "addsito2scheda":
			$sql="UPDATE scheda SET gid_sito=$_REQUEST[idsito] WHERE idscheda=$_REQUEST[idscheda]";
			$result= salva($sql);
		break;
		case "pestobs":
			$lista=list_gen($_REQUEST['id_pest']);
	        $areaSito=getArea($_REQUEST['idscheda']);
	        if($areaSito==null) $areaSito = "null";
	        //todo add a function to extract sito area! area=getArea($_REQUEST['idscheda']);
			$sql="INSERT INTO osservazioni (idscheda, hostcode, pestcode, stato, appezzamento)
				SELECT $_REQUEST[idscheda] ,a.b_code, b.b_code, 0, $areaSito
				FROM eppo.t_baycode AS a, eppo.t_baycode AS b
				WHERE a.codeid=$_REQUEST[host] AND b.codeid IN $lista";
			$result=salva($sql);
		break;
		case "pestobscatture":
			$host=$_REQUEST['hostcode'];
			$pest=$_REQUEST['pestcode'];
			$trappole_geometry_id = $_REQUEST['trappole_geometry_id'];
    		$appezzamento = $_REQUEST['appezzamento'];
    		$sup_vis = $_REQUEST['sup_vis'];
    		$unita_chk = $_REQUEST['unita_chk'];
	        //todo add a function to extract sito area! area=getArea($_REQUEST['idscheda']);
			$sql="INSERT INTO osservazioni (idscheda, hostcode, pestcode, stato, trappole_geometry_id,appezzamento,sup_vis,unita_chk,visiva)
				VALUES ($_REQUEST[idscheda] ,'$host','$pest',0,$trappole_geometry_id,nullif('$appezzamento','')::real,nullif('$sup_vis','')::real,nullif('$unita_chk','')::integer,false)";
			$res=salva($sql);
			$result["success"]=true;
		break;
		case "hostobs":
			$lista=list_gen($_REQUEST['id_host']);
			$sql="INSERT INTO osservazioni (idscheda, hostcode, pestcode, stato)
				SELECT $_REQUEST[idscheda] ,a.b_code, b.b_code, 0
				FROM t_baycode AS a, t_baycode AS b
				WHERE b.codeid=$_REQUEST[pest] AND a.codeid IN $lista";
			$res=salva_scheda($sql);
			$result["success"]=true;
		break;
		case "obsupdate":
			$returned=chk($_REQUEST['rilevato'],$_REQUEST['nome_intensity'],$_REQUEST['nome_grado']);
			if($_REQUEST['campione']=='on'){
				$campione='t';
				$campionecode="";
			}else{
				$campione='f';
				$campionecode="campionecode='',";
			}
			$piante_camp_vis=$_REQUEST['piante_camp_vis'];
			$piante_infest=$_REQUEST['piante_infest'];
			$sup_vis=$_REQUEST['sup_vis'];
			$sup_infest=$_REQUEST['sup_infest'];
	        $n_abbattute=$_REQUEST['n_abbattute'];
	        $n_osservate=$_REQUEST['n_osservate'];
	        if($n_osservate=='') $n_osservate='null';
			if(($piante_camp_vis=='')||($piante_camp_vis=='-1'))
				$piante_camp_vis='null';
			if(($piante_infest=='')||($piante_infest=='-1'))
				$piante_infest='null';
			if(($sup_vis=='')||($sup_vis=='-1'))
				$sup_vis='null';
			if(($sup_infest=='')||($sup_infest=='-1'))
				$sup_infest='null';
			$to_escape=array('sospetti'=>$_REQUEST['sospetti'],'fase_fenologica'=>$_REQUEST['fase_fenologica'],'organi'=>$_REQUEST['organi'],'varieta'=>$_REQUEST['varieta'],'eta'=>$_REQUEST['eta']);//, 'pericolosita'=>$_REQUEST['pericolosita']);
			$escaped=pg_str_escape($to_escape);
			$sql="
				BEGIN;
				UPDATE osservazioni
	                SET rilevato=$returned[0], sospetti='$escaped[sospetti]', campione='$campione', $campionecode
					attacco_int=$returned[1], attacco_grado=$returned[2], fase_fenologica='$escaped[fase_fenologica]', n_osservate=$n_osservate,
					organi='$escaped[organi]', varieta='$escaped[varieta]',data_impianto=to_date('$_REQUEST[data_impianto]','DD/MM/YYYY'), appezzamento=$_REQUEST[appezzamento],
					piante_camp_vis=$piante_camp_vis, coltura_prec='$_REQUEST[coltura_prec]', piante_infest=$piante_infest, sup_vis=$sup_vis, sup_infest=$sup_infest,
					n_abbattute=$n_abbattute, completa='$_REQUEST[completata]'
				WHERE idosservazioni=$_REQUEST[idosservazioni];
				UPDATE osservazioni
				SET appezzamento=coalesce(appezzamento,$_REQUEST[appezzamento]), sup_vis= coalesce(sup_vis,$sup_vis), n_osservate= coalesce(n_osservate,$n_osservate),
					piante_camp_vis=coalesce(piante_camp_vis,$piante_camp_vis), data_impianto=coalesce(data_impianto,to_date('$_REQUEST[data_impianto]','DD/MM/YYYY')),
					varieta=coalesce(varieta,'$escaped[varieta]'), fase_fenologica=coalesce(fase_fenologica,'$escaped[fase_fenologica]'), coltura_prec=coalesce(coltura_prec,'$_REQUEST[coltura_prec]')
				WHERE id_scheda= '$_REQUEST[idscheda]' AND NOT completa;
				COMMIT;
			";
			$result=salva($sql);
		break;
		case "obsupdate_new2":
			//var_dump($_REQUEST);
			$db->SQLReturn('BEGIN');
			if($_REQUEST['campione']=='on'){
				$campione='t';
				if($_REQUEST['nuovocampione']=='true'){
					$sqlReturning="INSERT INTO campioni (codice,scheda_id,laboratorio_id, elementicampione, tipocampione_id)
										VALUES ('$_REQUEST[codice]', $_REQUEST[idscheda], $_REQUEST[laboratorio], $_REQUEST[elementicampione], $_REQUEST[tipocampione_id])
									RETURNING id";
					$new_id=salva_scheda_return($sqlReturning);
					//$campioneid="campioni_id=$new_id[returned],";
					$campioneid=$new_id["returned"];
				}
				else{
					$campioneid=$_REQUEST['idcampione'];
					//$campioneid="campioni_id=$_REQUEST[idcampione],";
					$sql_campione="UPDATE campioni
									SET codice='$_REQUEST[codice]', elementicampione='$_REQUEST[elementicampione]' , tipocampione_id='$_REQUEST[tipocampione_id]'
								WHERE id=$_REQUEST[idcampione]";
					salva($sql_campione);
				}
			}else{
				$campione='f';
				//$campioneid="campioni_id=null,";
				$campioneid="null";
			}
			$sup_vis=$_REQUEST['sup_vis'];
			if(($sup_vis=='')||($sup_vis=='-1'))
				$sup_vis='null';
			if(isset($_REQUEST['tempo'])){
				if($_REQUEST['tempo']==''){
					$tempo='null';
				}
				else{
					$tempo=$_REQUEST['tempo'];
				}
			}
			else{
				$tempo='null';
			}
			$cambioferomone='false';
			if(isset($_REQUEST['cambioferomone'])&&($_REQUEST['cambioferomone']=='on')){
				$cambioferomone='true';
			}
			$n_osservate=$_REQUEST['n_osservate'];
	        if($n_osservate=='') $n_osservate='null';
			$sql="UPDATE simfito.osservazioni set idscheda='$_REQUEST[idscheda]', hostcode='$_REQUEST[host]', pestcode='$_REQUEST[pest]', completa=true,
				n_osservate=$n_osservate, campione='$campione', sup_vis=$sup_vis, campioni_id=$campioneid, catture='$_REQUEST[catture]', tempo=$tempo,
				cambioferomone=$cambioferomone
			WHERE idosservazioni='$_REQUEST[idosservazioni]'";
			//echo $sql;
			salva($sql);
			$db->SQLReturn('COMMIT');
			$result["success"] = true;
		break;
		case "obsupdate_new":
			//$returned=chk($_REQUEST['rilevato'],$_REQUEST['nome_intensity'],$_REQUEST['nome_grado']);

			$oldcamp=-2;
			if(isset($_REQUEST['idcampione'])){
				$neucamp=$_REQUEST['idcampione'];
			}
			obsupdateprepare($_REQUEST['idosservazioni'],$neucamp);
			$db->SQLReturn('BEGIN');
			if($_REQUEST['campione']=='on'){
				$campione='t';
				if($_REQUEST['nuovocampione']=='true'){
					// Gestione NULL per laboratorio_id e tipocampione_id
					$lab_id = (!empty($_REQUEST['laboratorio']) && $_REQUEST['laboratorio'] != '') ? "$_REQUEST[laboratorio]" : "NULL";
					$tipo_id = (!empty($_REQUEST['tipocampione_id']) && $_REQUEST['tipocampione_id'] != '') ? "$_REQUEST[tipocampione_id]" : "NULL";
					$sqlReturning="INSERT INTO campioni (codice,scheda_id,laboratorio_id, elementicampione, tipocampione_id)
										VALUES ('$_REQUEST[codice]', $_REQUEST[idscheda], $lab_id, $_REQUEST[elementicampione], $tipo_id)
									RETURNING id";
					$new_id=salva_scheda_return($sqlReturning);
					$campioneid="campioni_id=$new_id[returned],";
				}
				else{
					$campioneid="campioni_id=$_REQUEST[idcampione],";
					$sql_campione="UPDATE campioni
									SET codice='$_REQUEST[codice]', elementicampione='$_REQUEST[elementicampione]' , tipocampione_id='$_REQUEST[tipocampione_id]'
								WHERE id=$_REQUEST[idcampione]";
					salva($sql_campione);
				}
			}else{
				$campione='f';
				$campioneid="campioni_id=null,";
			}
			$piante_camp_vis=$_REQUEST['piante_camp_vis'];
			$piante_infest=$_REQUEST['piante_infest'];
			$sup_vis=$_REQUEST['sup_vis'];
			$sup_infest=$_REQUEST['sup_infest'];
			if(isset($_REQUEST['tempo'])){
				$tempo=$_REQUEST['tempo'];
			}
			else{
				$tempo='null';
			}
	        //$n_abbattute=$_REQUEST['n_abbattute'];
	        $n_osservate=$_REQUEST['n_osservate'];
	        if($n_osservate=='') $n_osservate='null';
			if(($piante_camp_vis=='')||($piante_camp_vis=='-1'))
				$piante_camp_vis='null';
			if(($piante_infest=='')||($piante_infest=='-1')||($piante_infest=='NaN'))
				$piante_infest='null';
			if(($sup_vis=='')||($sup_vis=='-1')||($sup_vis=='NaN'))
				$sup_vis='null';
			if(($sup_infest=='')||($sup_infest=='-1')||($sup_infest=='NaN'))
				$sup_infest='null';
			if(($tempo=='')||($tempo=='-1')){
				$tempo='null';
			}
			// Gestione tipologia_id (può essere vuoto o 0)
			$tipologia_id = isset($_REQUEST['tipologia_id']) && $_REQUEST['tipologia_id'] !== '' && $_REQUEST['tipologia_id'] !== '0' 
				? $_REQUEST['tipologia_id'] 
				: 'null';
			$to_escape=array('sospetti'=>$_REQUEST['sospetti'],'fase_fenologica'=>$_REQUEST['fase_fenologica'],'organi'=>$_REQUEST['organi'],'varieta'=>$_REQUEST['varieta'],'eta'=>$_REQUEST['eta']);//, 'pericolosita'=>$_REQUEST['pericolosita']);
			$escaped=pg_str_escape($to_escape);
			if($_REQUEST['geometry']!=''){
				$geoJson=$_REQUEST['geometry'];
				$geom=pg_escape_string($geoJson);
				$geoJsonAdd=", the_geom =(st_transform(ST_GeomFromGeoJSON('$geom'),4326))";
			}else{
				$geoJsonAdd="";
			}
			$sql="UPDATE osservazioni
	                SET rilevato=$_REQUEST[rilevato], sospetti='$escaped[sospetti]', campione='$campione', $campioneid
					attacco_int=$_REQUEST[id_intensity], /*attacco_grado=$_REQUEST[id_grado],*/ fase_fenologica='$escaped[fase_fenologica]', id_fase_fenologica=nullif('$_REQUEST[id_fase_fenologica]','0')::integer, /*n_osservate=$n_osservate,*/
					/*organi='$escaped[organi]',*/ varieta='$escaped[varieta]',data_impianto=to_date('$_REQUEST[data_impianto]','DD/MM/YYYY'),appezzamento=$_REQUEST[appezzamento],
					/*piante_camp_vis=$piante_camp_vis,*/ coltura_prec='$_REQUEST[coltura_prec]',piante_infest=$piante_infest,sup_vis=$sup_vis,sup_infest=$sup_infest,
					/*n_abbattute=$n_abbattute,*/ completa='$_REQUEST[completata]', tempo=$tempo $geoJsonAdd,
					unita=nullif('$_REQUEST[unit_tot]','')::integer, unita_chk=nullif('$_REQUEST[unit_chk]','')::integer, peso=nullif('$_REQUEST[peso_tot]','')::real,
					peso_chk=nullif('$_REQUEST[peso_chk]','')::real, lotti=nullif('$_REQUEST[lotti_tot]','')::integer, lotti_chk=nullif('$_REQUEST[lotti_chk]','')::integer,
					lotti_camp=nullif('$_REQUEST[lotti_camp]','')::integer, tipologiacontrollata_id=$tipologia_id,
					provenienza='$_REQUEST[provenienza]'
				WHERE idosservazioni=$_REQUEST[idosservazioni] RETURNING idosservazioni";
			$result["gid"]=salva_scheda($sql);
			$sql2="UPDATE osservazioni
				SET appezzamento=coalesce(appezzamento,$_REQUEST[appezzamento]), sup_vis= coalesce(sup_vis,$sup_vis), /*n_osservate= coalesce(n_osservate,$n_osservate),*/
					/*piante_camp_vis=coalesce(piante_camp_vis,$piante_camp_vis),*/ data_impianto=coalesce(data_impianto,to_date('$_REQUEST[data_impianto]','DD/MM/YYYY')),
					varieta=coalesce(varieta,'$escaped[varieta]'), fase_fenologica=coalesce(fase_fenologica,'$escaped[fase_fenologica]'), id_fase_fenologica=nullif('$_REQUEST[id_fase_fenologica]','0')::integer, coltura_prec=coalesce(coltura_prec,'$_REQUEST[coltura_prec]'),
					unita='$_REQUEST[unit_tot]', unita_chk='$_REQUEST[unit_chk]', peso='$_REQUEST[peso_tot]', peso_chk='$_REQUEST[peso_chk]',
					lotti='$_REQUEST[lotti_tot]', lotti_chk='$_REQUEST[lotti_chk]', lotti_camp='$_REQUEST[lotti_camp]', tipologiacontrollata_id=$tipologia_id,
					provenienza='$_REQUEST[provenienza]'
				WHERE idscheda= '$_REQUEST[idscheda]' AND NOT completa AND hostcode=(SELECT hostcode from simfito.osservazioni where idosservazioni=$_REQUEST[idosservazioni]);";
			salva($sql2);
			//echo $sql2;
			$db->SQLReturn('COMMIT');
			$result["success"] = true;
		break;
		case "prsinsert":
			if(!chk_pr($_REQUEST['parassita'],$_REQUEST['ospite'])){
				$sql="INSERT INTO ordinari (userid,idscheda,pest,host,validato,nuovo)
					VALUES ('$_REQUEST[idTecnico]','$_REQUEST[idscheda]','$_REQUEST[parassita]','$_REQUEST[ospite]',false,true)";
				//echo "('$_REQUEST[idTecnico]','$_REQUEST[idscheda]','$_REQUEST[parassita]','$_REQUEST[ospite]',false,true)";
				$result=salva($sql);
				/* INVIO EMAIL ALL'AMMINISTRATRE
				 *
				 * $email mail dell'amministratore (vedi set_confirm($sql)
				 * $body="Segnalato l'organismo $_REQUEST[parassita] per $_REQUEST[ospite]"
				 * simfito_sendmail($email,"Nuova Segnalaione",$body);
				 */
			}
		break;
		case "prsupdate":
			$sql="UPDATE pest_report
				SET pest='$_REQUEST[parassita]', host='$_REQUEST[ospite]'
				WHERE id='$_REQUEST[id]'";
			$result=salva($sql);
		break;
		case "salva-scheda":
			$id=$_REQUEST['id_scheda'];
			if($_REQUEST['rule']==5)
				$stato=1;
			else
				$stato=2;
			if ($id!=""){
				if(chk_obs($id)){
					$sql = "UPDATE simfito.trappole_geometry 
						set statotrappole_id=1,tecnicorimozione_id=tecnico_id,tempo_rimozione=1,rimozionescheda_id=$id
						where scheda_id=$id and tipo_trappole_id in (select id from simfito.tipo_trappole where singleuse)";
					$result=salva($sql);
					$sql="UPDATE scheda SET stato=$stato WHERE idscheda=$id";
					$result=salva($sql);
					$sql="UPDATE osservazioni SET stato=$stato WHERE idscheda=$id";
					$result=salva($sql);
					// mail di avviso SE ci sono pest rilevati
					$sql = "select idscheda,count(*),sum(case when rilevato=1 then 1 else 0 end) as rilevati,array_agg(rilevato) as rilevatia,array_agg(pestcode) as pesta from simfito.osservazioni where idscheda in ($id) group by idscheda"; 
					$rilev = $db->FetchRow($sql);
					if ($rilev['rilevati']>0) {
						$cmdxx = "php messages_service.php scheda_priority $id >/dev/null &";
						$cmdrs = [];
						$cmdrc = 0;
						exec($cmdxx,$cmdrs,$cmdrc);
					}
				}
				else {
					errore('Questa scheda non pu&ograve; essere chiusa poich&eacute; ha osservazioni non completate e/o nessuna azione sulle trappole è stata svolta. Verificare, inoltre, che i tempi inseriti siano maggiori di zero.');
				}
			}else $result["success"]=false;
		break;
		case "cancella-scheda":
			$id=$_REQUEST['id_scheda'];
			if ($id!=""){
				$sql="BEGIN TRANSACTION;";
				$sql.="DELETE FROM scheda WHERE idscheda=$id;";
				//$result=salva_scheda($sql);
				$sql.="DELETE FROM osservazioni WHERE idscheda=$id;";
				//$result=salva_scheda($sql);
				$sql.="DELETE FROM schede_tecnici WHERE idscheda=$id;";
				$sql.="COMMIT;";
				$result=salva($sql);
			} else $result["success"]=false;
		break;
		case "cancella-osservazione":
			$id=$_REQUEST['id_osservazione'];
			if ($id!=""){
				$campioniid=getCampioneFromOsservazione($id);

				$ccamp=0;
				if(($campioniid!=-1)&&($campioniid!='')){
					$ccamp=countCampioniId($campioniid);
				}

				$sql0="BEGIN";
				$result=salva($sql0);
				$sql1="DELETE FROM osservazioni WHERE idosservazioni=$id";
				$result=salva($sql1);
				if(($campioniid!=-1)&&($campioniid!='')){
					if($ccamp==1){
						$result=salva("DELETE FROM campioni WHERE id='$campioniid'");
					}
				}
				$result=salva("COMMIT");

			}else $result["success"]=false;
		break;
		case "cancella_pestreport":
			$id=$_REQUEST['id'];
			if ($id!=""){
				$sql="DELETE FROM ordinari WHERE id=$id";
				$result=salva_scheda($sql);
			}else $result["success"]=false;
		break;
		case "valida-scheda":
			$id=$_REQUEST['id_scheda'];
			if(isset($_REQUEST['validazione'])){
				$stato=$_REQUEST['validazione'];
			}
			else{
				$stato=-1;
				//errore('Stato mancante in "valida-scheda"');
			}
			if ($id!=""){
				if($stato==-1){
					$sql="UPDATE scheda SET stato=$stato,\"motivo-rigetto\"=" . pg_escape_literal($_REQUEST['motivo']) . " WHERE idscheda=$id";
				}else{
					$sql="UPDATE scheda SET stato=$stato WHERE idscheda=$id";
				}
				$result=salva($sql);
				$sql="UPDATE osservazioni SET stato=$stato WHERE idscheda=$id";
				//$result=salva($sql);
			}else errore('Id mancante in "valida-scheda"');//$result["success"]=false;
		break;
		case "newuser":
			if (($_REQUEST['idtipo_tecnico']==1)&&($_REQUEST['id_provincia']=='')){
				$result["success"]=false;
				$result["errors"]["reason"] = "Per l'amministratore Provinciale è necessario inserire la provincia!";
			}else{
				if($_REQUEST['data_inizio_att']=='')
					$data_inizio_att='01/01/0001';
				else
					$data_inizio_att=$_REQUEST['data_inizio_att'];
				if($_REQUEST['data_nascita']=='')
					$data_nascita='01/01/0001';
				else
					$data_nascita=$_REQUEST['data_nascita'];
				if ($_REQUEST['id_provincia']==''){
					$id_provinciaH="";
					$id_provinciaV="";
				}else{
					$id_provinciaH=",id_provincia";
					$id_provinciaV=",'$_REQUEST[id_provincia]'";
				}
				if($_REQUEST['mobile']!='')
					$mobile=celchk($_REQUEST['mobile']);
				else $mobile='';
				$toescape=Array("residenza_indirizzo"=>$_REQUEST['residenza_indirizzo'], "residenza_comune"=>$_REQUEST['residenza_comune'], "web"=>$_REQUEST['web'],"nome"=>$_REQUEST['nome'],"cognome"=>$_REQUEST['cognome']);
				$escaped=pg_str_escape($toescape);
				$username=trim($_REQUEST['username']);
				$sql="INSERT INTO
					tecnici
						(idtipo_tecnico,nome,cognome,email,username,pswrd,ufficio,codicefiscale,data_inizio_att,data_nascita,sesso,comune_nascita,provincia_nascita,titolo,cap_ufficio $id_provinciaH,
						 residenza_comune, residenza_indirizzo,web,telefono,mobile,validated)
					VALUES
						('$_REQUEST[idtipo_tecnico]','$escaped[nome]','$escaped[cognome]','$_REQUEST[email]','$username','$_REQUEST[pswrd]','$_REQUEST[ufficio]','$_REQUEST[codicefiscale]',
						to_date('$data_inizio_att','DD/MM/YYYY'),to_date('$data_nascita','DD/MM/YYYY'),'$_REQUEST[sesso]','$_REQUEST[comune_nascita]','$_REQUEST[provincia_nascita]','$_REQUEST[titolo]',
						'$_REQUEST[cap_ufficio]' $id_provinciaV, '$escaped[residenza_comune]', '$escaped[residenza_indirizzo]', '$escaped[web]','$_REQUEST[telefono]','$mobile',true)
					RETURNING id_tecnico";
				$result=salva_user($sql);
			}
		break;
		case "modifyUser":
			if($_REQUEST['data_inizio_att']=='')
				$data_inizio_att='01/01/0001';
			else
				$data_inizio_att=$_REQUEST['data_inizio_att'];
			if($_REQUEST['data_nascita']=='')
				$data_nascita='01/01/0001';
			else
				$data_nascita=$_REQUEST['data_nascita'];
			if ($_REQUEST['id']=='') $id_provincia="";
			else $id_provincia=",id_provincia='$_REQUEST[id]' ";
			if($_REQUEST['mobile']!='')
				$mobile=celchk($_REQUEST['mobile']);
			else $mobile='';
			$toescape=Array("residenza_indirizzo"=>$_REQUEST['residenza_indirizzo'], "residenza_comune"=>$_REQUEST['residenza_comune'], "web"=>$_REQUEST['web'],"nome"=>$_REQUEST['nome'],"cognome"=>$_REQUEST['cognome']);
			$escaped=pg_str_escape($toescape);
			$username=trim($_REQUEST['username']);
			$sql="UPDATE tecnici
				SET	idtipo_tecnico='$_REQUEST[idtipo_tecnico]', nome='$escaped[nome]', cognome='$escaped[cognome]', email='$_REQUEST[email]', username='$username',
					pswrd='$_REQUEST[pswrd]', ufficio='$_REQUEST[ufficio]', codicefiscale='$_REQUEST[codicefiscale]', data_inizio_att=to_date('$data_inizio_att','DD/MM/YYYY'),
					data_nascita=to_date('$data_nascita','DD/MM/YYYY'), sesso='$_REQUEST[sesso]', comune_nascita='$_REQUEST[comune_nascita]',
					provincia_nascita='$_REQUEST[provincia_nascita]', titolo='$_REQUEST[titolo]', cap_ufficio='$_REQUEST[cap_ufficio]' $id_provincia,
					residenza_comune='$escaped[residenza_comune]', residenza_indirizzo='$escaped[residenza_indirizzo]',web='$escaped[web]',telefono='$_REQUEST[telefono]',mobile='$mobile'
				WHERE id_tecnico='$_REQUEST[uid]'";
			$result=salva($sql);
		break;
		case "modUser":
			if (($_REQUEST['idtipo_tecnico']==1)&&($_REQUEST['id_provincia']=='')){
				$result["success"]=false;
				$result["errors"]["reason"] = "Per l'amministratore Provinciale è necessario inserire la pronvicia!";
			}else{
				if($_REQUEST['data_inizio_att']=='')
					$data_inizio_att='01/01/0001';
				else
					$data_inizio_att=$_REQUEST['data_inizio_att'];
				if($_REQUEST['data_nascita']=='')
					$data_nascita='01/01/0001';
				else
					$data_nascita=$_REQUEST['data_nascita'];
				if($_REQUEST['mobile']!='')
					$mobile=celchk($_REQUEST['mobile']);
				else $mobile='';
				if ($_REQUEST['id_provincia']=='')
					$id_provincia="";
				else $id_provincia=",id_provincia='$_REQUEST[id_provincia]' ";
				if($_REQUEST['idtipo_tecnico']==''){
					$id_tipotecnico="";
				}
				else $id_tipotecnico=", idtipo_tecnico='$_REQUEST[idtipo_tecnico]' ";
				$toescape=Array("residenza_indirizzo"=>$_REQUEST['residenza_indirizzo'], "residenza_comune"=>$_REQUEST['residenza_comune'], "web"=>$_REQUEST['web'],"nome"=>$_REQUEST['nome'],'cognome'=>$_REQUEST['cognome'], 'comune_nascita'=>$_REQUEST['comune_nascita'], 'provincia_nascita'=>$_REQUEST['provincia_nascita']);
				$escaped=pg_str_escape($toescape);
				$username=trim($_REQUEST['username']);
				$sql="UPDATE tecnici
					SET	nome='$escaped[nome]', cognome='$escaped[cognome]', email='$_REQUEST[email]', username='$username',
						pswrd='$_REQUEST[pswrd]', ufficio='$_REQUEST[ufficio]', codicefiscale='$_REQUEST[codicefiscale]', data_inizio_att=to_date('$data_inizio_att','DD/MM/YYYY'),
						data_nascita=to_date('$data_nascita','DD/MM/YYYY'), sesso='$_REQUEST[sesso]', comune_nascita='$escaped[comune_nascita]', provincia_nascita='$escaped[provincia_nascita]',
						titolo='$_REQUEST[titolo]', cap_ufficio='$_REQUEST[cap_ufficio]',
						residenza_comune='$escaped[residenza_comune]', residenza_indirizzo='$escaped[residenza_indirizzo]',web='$escaped[web]',telefono='$_REQUEST[telefono]',mobile='$mobile' $id_provincia $id_tipotecnico
					WHERE id_tecnico='$_REQUEST[uid]'";
				//echo $sql;
				$result=salva($sql);
			}
		break;
		case "cancella-utente":
			$sql="UPDATE tecnici SET cancellato=true WHERE id_tecnico=$_REQUEST[id_tecnico]";
			$result=salva($sql);
		break;
		case "conferma-utente":
			/*$sql="UPDATE tecnici SET validated=true WHERE id_tecnico=$_REQUEST[id_tecnico]";
			$result=salva($sql);*/
			$result=conferma_user($_REQUEST[id_tecnico]);
		break;
		case "update_motivi_visita":
			$sql="UPDATE tipo_visita SET \"$_REQUEST[field]\" = '$_REQUEST[value]' WHERE idtipo_visita=$_REQUEST[id]";
			$result=salva($sql);
		break;
		case "update_tipocampione":
			$sql="UPDATE tipocampione SET \"$_REQUEST[field]\" = '$_REQUEST[value]' WHERE id=$_REQUEST[id]";
			$result=salva($sql);
		break;
		case "update_tipoazienda_visita":
			$sql="UPDATE tipoazienda SET \"$_REQUEST[field]\" = '$_REQUEST[value]' WHERE id=$_REQUEST[id]";
			$result=salva($sql);
		break;
		case "nuovo_motivo":
			$escaped=pg_str_escape($_REQUEST);
			$sql="INSERT INTO tipo_visita (motivo,enabled) VALUES ('$escaped[motivo]',true)";
			$result=salva($sql);
		break;
		case "nuovo_tipocampione":
			$escaped=pg_str_escape($_REQUEST);
			$sql="INSERT INTO tipocampione (description,enabled) VALUES ('$escaped[tipocampione]',true)";
			$result=salva($sql);
		break;
		case "nuovo_tipo_azienda":
			$escaped=pg_str_escape($_REQUEST);
			$sql="INSERT INTO tipoazienda (descrizione,attivo) VALUES ('$escaped[tipo]',true)";
			$result=salva($sql);
		break;
		case "assegnacodice":
			if(isset($_REQUEST['newcode']))
				$campionecode=$_REQUEST['newcode'];
			else if ($_REQUEST['codice']!='')
				$campionecode=$_REQUEST['codice'];
			else
				errore("Assegnare un codice già esistente o scegliere \"nuovo campione\"!");
			$sql="UPDATE osservazioni SET campionecode='$campionecode', campione=true WHERE idosservazioni=$_REQUEST[idosservazione]";
			$result=salva($sql);
		break;
		case "trappole-old":
			$sql="INSERT INTO trappole (codice, numero_individui, id_osservazione, id_tipo, n_piante_rap, note)
				VALUES ('$_REQUEST[codice]','$_REQUEST[n_individui]','$_REQUEST[idosservazione]','$_REQUEST[id]','$_REQUEST[n_piante_rap]','$_REQUEST[note]')";
			$result=salva($sql);
		break;
		/*case "cancella-trappola":
			$sql="DELETE FROM trappole WHERE id='$_REQUEST[id]'";
			$result=salva($sql);
		break;*/
		case "modifica":
			$sql="UPDATE $_REQUEST[tabella]
				SET $_REQUEST[campo]='$_REQUEST[nuovo_valore]'
				WHERE $_REQUEST[campo_id]='$_REQUEST[id]'";
			$result=salva($sql);

			if(($result['success'])&&($_REQUEST['tabella']=='tecnici')){
				$sql="SELECT nome,cognome,username,pswrd,email
					FROM tecnici
					WHERE id_tecnico='$_REQUEST[id]'";
				send_confirm($sql);
			}
		break;
		case 'duplica':
			$idScheda=$_REQUEST['idscheda'];
			$nuova_data=$_REQUEST['nuovadata'];
			$nuovo_protocollo=$_REQUEST['protocollo'];
			$idtecnico=(isset($_REQUEST['tecnicoid'])?$_REQUEST['tecnicoid']:'');
			$motivo=$_REQUEST['motivo'];
			$result=duplica($idScheda,$nuova_data,$nuovo_protocollo,$motivo,$idtecnico);
		break;
		case 'crud':
			$table=$_REQUEST['table'];
			$field0=$_REQUEST['field0'];
			$value0=$_REQUEST['value0'];
			$field1=$_REQUEST['field1'];
			$value1=$_REQUEST['value1'];
			if ($_REQUEST['action']=='delete'){
				$sql="delete from \"$table\" where \"$field0\"='$value0'";
			}else{
				$sql="update \"$table\" set \"$field0\"='$value0' where \"$field1\"='$value1'";
			}
			$result=salva($sql);
		break;
		case 'validato':
			$sql="update ordinari set validato=true, \"nuova_segnalazione\"=false where id='$_REQUEST[id]'";
			$result=salva($sql);
		break;
		case 'novalidato':
			$rigetto = $_REQUEST['rigetto'];
			$rigetto = pg_escape_string($rigetto);
			$sqlm = "select id,nome,cognome,email from simfito.ordinari left join simfito.tecnici on ordinari.userid=tecnici.id_tecnico where ordinari.id=$_REQUEST[id]";
			$rm = $db->fetchRow($sqlm);
			$sql = "update ordinari set validato=false, \"nuova_segnalazione\"=false,rigetto='$rigetto' where id='$_REQUEST[id]'";
			$result = salva($sql);
			if ($rm['email']!='') {
				$email = $rm['email'];
				$subj = "Rigetto nuova associazione";
				$body  = "Gentile $rm[cognome] $rm[nome]\n";
				$body .= "L'associazione ID $rm[id] da lei proposta e' stata rigettata con la seguente motivazione:\n";
				$body .= "$rigetto\n\n";
				$body .= "Distinti saluti";
				simfito_sendmail($email,$subj,$body);
			}
		break;
		case "associa_tecnici":
			$couples=json_decode($_REQUEST['tecnici'],true);
			$sql="INSERT INTO schede_tecnici (idscheda, id_tecnico)
				VALUES";
			for ($i=0; $i<count($couples); $i++){
				$coma=($i>0)?",":"";
				$sql.=$coma."(".$couples[$i]["idscheda"].",".$couples[$i]["id_tecnico"].")";
			}
			$result=salva($sql);
		break;
		case "rimuovi_tecnici":
			$couples=json_decode($_REQUEST['tecnici'],true);
			$sql="BEGIN TRANSACTION;";
			for ($i=0; $i<count($couples); $i++){
				$sql.=$coma."DELETE FROM schede_tecnici WHERE idscheda=".$couples[$i]["idscheda"]." AND id_tecnico=".$couples[$i]["id_tecnico"].";";
			}
			$sql.="COMMIT;";
			//echo $sql;
			$result=salva($sql);
		break;
		case "duplica-osservazione":
			$sql="INSERT INTO osservazioni (idscheda, hostcode, pestcode, rilevato, sospetti, campione, risultato, attacco_int, attacco_grado, fase_fenologica, n_osservate, organi,
					pericolosita, varieta, eta, campionecode, data_impianto, appezzamento, dens_piante, piante_camp_vis, id_fase_fenologica, coltura_prec, piante_infest,
					sup_vis, sup_infest, trasmitted, parent_code, rigettata, n_abbattute, completa, old_obs,the_geom,
					unita,unita_chk,peso,peso_chk,lotti,lotti_chk,lotti_camp,tipologiacontrollata_id,provenienza)

				SELECT idscheda, hostcode, pestcode, rilevato, sospetti, campione, risultato, attacco_int, attacco_grado, fase_fenologica, n_osservate, organi,
					pericolosita, varieta, eta, campionecode, data_impianto, appezzamento, dens_piante, piante_camp_vis, id_fase_fenologica, coltura_prec, piante_infest,
					sup_vis, sup_infest, trasmitted, parent_code, rigettata, n_abbattute, completa, old_obs,the_geom,
					unita,unita_chk,peso,peso_chk,lotti,lotti_chk,lotti_camp,tipologiacontrollata_id,provenienza
				FROM
					osservazioni
				WHERE idosservazioni=$_REQUEST[idosservazione]";
			$result=salva($sql);
		break;
		case "trappola":
			$geoJson=$_REQUEST['geometry'];
			$Rescaped=pg_str_escape($_REQUEST);
			//var_dump($Rescaped);
			$durata_erogatore=($_REQUEST['durata_erogatore']=='')?'null':$_REQUEST['durata_erogatore'];
			$sql="INSERT INTO trappole_geometry (the_geom, gid, tipo_trappole_id, tecnico_id, anno, nome, tempo, organismo, codice, durata_erogatore, datacreazione, datavariazione,
					scheda_id, host, suprap, suptot, unitrap)
				VALUES (st_transform(ST_GeomFromGeoJSON('$geoJson'),4326), $_REQUEST[idsito], $_REQUEST[id], $_REQUEST[userId],
						date_part('Year',now())::integer, '$Rescaped[nome]', $_REQUEST[tempo], '$_REQUEST[organismo]',
						date_part('Year',now())-2000|| '$_REQUEST[organismo]' || (SELECT descrizione FROM tipo_trappole WHERE id=$_REQUEST[id]) || to_char(trapincrement(date_part('Year',now())::integer), '0000'),
						$durata_erogatore, '$_REQUEST[datacreazione]', '$_REQUEST[datacreazione]', '$_REQUEST[schedaid]', '$_REQUEST[host]', '$_REQUEST[suprap]', '$_REQUEST[suptot]', '$Rescaped[unitrap]' )
				--RETURNING id";
			//echo "<br/>".$sql;
			/*$id=$db->SQLReturn($sql);
			$sql1="WITH a AS (
						SELECT descrizione FROM tipo_trappole WHERE id=$_REQUEST[id]
					)
					UPDATE trappole_geometry SET codice='ST '|| descrizione ||' $_REQUEST[idsito] $id' FROM a
					WHERE trappole_geometry.id=$id";
			$result=salva($sql1);*/

			$result=salva($sql);
		break;
		case "set-trappole":
			$note=pg_escape_string($_REQUEST['note']);
			$n_piante_rap=($_REQUEST['n_piante_rap']=='')?'null':"'$_REQUEST[n_piante_rap]'";
			switch($_REQUEST['idtrp']){
				case "-1":
					$sql="INSERT INTO trappole (numero_individui, id_osservazione, n_piante_rap, note, trappole_geometry_id)
							VALUES ('$_REQUEST[n_individui]', '$_REQUEST[idosservazione]', $n_piante_rap, '$note', '$_REQUEST[t_g_id]')";
					break;
				default:
					$sql="UPDATE trappole SET numero_individui='$_REQUEST[n_individui]', n_piante_rap=$n_piante_rap, note='$note'
						WHERE id = $_REQUEST[idtrp]";
					break;
			}
			if($sql){
				$result=salva($sql);
			}
			else {
				errore('Parametri errati query: $sql');
			}
		break;
		case "riusa-trappola":
			$sql="INSERT INTO trappole_geometry (the_geom, gid, tipo_trappole_id, tecnico_id, anno, nome, tempo, organismo, codice, durata_erogatore,
					datacreazione, scheda_id, datavariazione)
				SELECT the_geom, gid, tipo_trappole_id, $_REQUEST[tecnicoid], date_part('Year',timestamp '$_REQUEST[data]')::integer, nome, $_REQUEST[tempo], organismo,
					date_part('Year',timestamp '$_REQUEST[data]')-2000|| '$_REQUEST[organismo]' || (
						SELECT descrizione
						FROM tipo_trappole
						WHERE id=tipo_trappole_id) || to_char(trapincrement(date_part('Year',timestamp '$_REQUEST[data]')::integer), '0000'
					), durata_erogatore, '$_REQUEST[data]', $_REQUEST[idscheda], '$_REQUEST[data]'
				FROM trappole_geometry
				WHERE id=$_REQUEST[id]";
			//echo($sql);
			$result=salva($sql);
		break;
		case "rimuovi-trappola":
			$sql="UPDATE trappole_geometry
				SET statotrappole_id=1, tecnicorimozione_id=$_REQUEST[tecnicoid], tempo_rimozione=$_REQUEST[tempo], datavariazione='$_REQUEST[data]',
					rimozionescheda_id=$_REQUEST[idscheda]
				WHERE id=$_REQUEST[id]";
			//echo $sql;
			$result=salva($sql);
		break;
		case "cancella-trappola":
			$sqlpre="select *
				from simfito.trappole_geometry
				inner join simfito.osservazioni on osservazioni.trappole_geometry_id=trappole_geometry.id
				where trappole_geometry.id=$_REQUEST[id]";
			$db->Read($sqlpre);
			$ntrappole= $db->RecNo();
			if($ntrappole==0){
				$sql= "delete from simfito.trappole_geometry where id=$_REQUEST[id]";
				$result=salva($sql);
			}
			else{
				errore("Per questa trappola sono registrate catture quindi non pu&ograve; essere cancellata!");
			}
		break;
		case "abbattimenti":
			if(isset($_REQUEST["abbattimenti_id"])) {
				if($_REQUEST["abbattimenti_id"]!='') {
					$tecnico = pg_escape_string($_REQUEST['tecnico']);
					if($_REQUEST["abbattimenti_id"]=='-1') {
						$sql="INSERT INTO abbattimenti (quantity,date,osservazioni_id,tecnico)
							VALUES ('$_REQUEST[abbattute]', '$_REQUEST[date]', '$_REQUEST[osservazione_id]','$tecnico')";					}
					else {
						$sql="UPDATE abbattimenti SET quantity='$_REQUEST[abbattute]', date='$_REQUEST[date]', osservazioni_id='$_REQUEST[osservazione_id]',tecnico='$tecnico'
							WHERE id='$_REQUEST[abbattimenti_id]'";
					}
					$result=salva($sql);
				}
				else {
					errore('ID abbattuti non vuoto');
				}
			}
			else {
				errore('ID abbattuti non definito');
			}
		break;
		case "elimina-abbattimento":
			if(isset($_REQUEST['id'])){
				$sql="DELETE FROM abbattimenti WHERE id='$_REQUEST[id]'";
				$result=salva($sql);
			}
			else {
				errore('ID abbattuti non definito');
			}
		break;
		case "settings":
			if(isset($_REQUEST['scheda0001'])){
				$sql="UPDATE simfito.config SET value='$_REQUEST[scheda0001]' WHERE code='scheda0001'";
				$result=salva($sql);
			}
		break;
		case "update_tipologiasito":
			if(isset($_REQUEST['sito_id'])){
				if(isset($_REQUEST['tipologiasito_id'])){
					$sql="UPDATE siti SET tipologiasito_id=$_REQUEST[tipologiasito_id] WHERE gid=$_REQUEST[sito_id]";
					$result=salva($sql);
				}
				else{
					errore('Per qualche motivo non &egrave; stato scelto il tipo di sito corretto! Contattare l&apos;assistenza.');
				}
			}
			else{
				errore('Per qualche motivo non &egrave; stato scelto il sito corretto! Contattare l&apos;assistenza.');
			}
		break;
		case 'delete-reportue':
			$rueid = $_REQUEST['id'];
			$sql = "DELETE FROM simfito.reportue WHERE id=$rueid";
			$result = salva($sql);
		break;
		case 'update-reportue':
			$escaped=pg_str_escape($_REQUEST);
			$values = "nomereport='$escaped[nomereport]',anno=$escaped[anno],pest='$escaped[pest]',enabled=$escaped[enabled]";
			$sql = "UPDATE simfito.reportue SET $values WHERE id=$_REQUEST[id] RETURNING id";
			$result = salva($sql);
		break;
		case 'insert-reportue':
			$escaped = pg_str_escape($_REQUEST);
			$values = "'$escaped[nomereport]',$escaped[anno],'$escaped[pest]',true";
			$sql = "INSERT INTO simfito.reportue(nomereport,anno,pest,enabled) VALUES($values) RETURNING id";
			$result = salva($sql);
		break;
		case 'enable-reportue':
			$sql = "UPDATE simfito.reportue SET enabled=true WHERE id=$_REQUEST[id] RETURNING id";
			$result = salva($sql);
		break;
		case 'disable-reportue':
			$sql = "UPDATE simfito.reportue SET enabled=false WHERE id=$_REQUEST[id] RETURNING id";
			$result = salva($sql);
		break;
		case 'update_tipotrappola':
			$sql= "UPDATE simfito.tipo_trappole SET $_REQUEST[field] = $_REQUEST[value] WHERE id=$_REQUEST[id]";
			//echo($sql);
			$result = salva($sql);
		break;
		case 'add_tipotrappola':
			$escaped = pg_str_escape($_REQUEST);
			$values = "'$escaped[descrizione]','$escaped[description]'";
			$sql="INSERT INTO simfito.tipo_trappole (descrizione, description) VALUES($values)";
			$result = salva($sql);
		break;
		case 'delimitazione':
			$params=$_REQUEST['params'];
			$anno=$_REQUEST['anno'];
			$sql="INSERT INTO simfito.areas (params,anno) VALUES('$params','$anno')";
			$result=salva($sql);
		break;
		case 'delimitazione2':
			$params = $_REQUEST['params'];
			$name = pg_escape_string(isset($_REQUEST['name']) ? $_REQUEST['name'] : '');
			$pest = $_REQUEST['pest'];
			$from = $_REQUEST['from'];
			//$to = $_REQUEST['to'];
			$vector = (isset($_REQUEST['vector']) ? $_REQUEST['vector'] : '');
			if ($vector=='') {
				$geom = 'null';
			}
			else {
				$vectox = json_decode($vector,true); 
				$crsx = $vectox['crs']['properties']['name'];
				$crsy = explode(':',$crsx);
				$crs = $crsy[1];
				$geomx = json_encode($vectox['geometry']);
				$geom = "ST_SetSRID(ST_GeomFromGeoJSON('$geomx'),$crs)";

			}
			$tampone = $_REQUEST['tampone'];
			$contenimento = $_REQUEST['contenimento'];

//			echo "<b>VECTOR</b> " . $vector . "<br>";
//			echo "<b>CRS</b> $crs<br>";
//			echo "<b>GEOM</b> $geom<br>";
			$anno = substr($from,0,4); // $_REQUEST['anno'];
			$sqlt = "SELECT count(*) as cc FROM simfito.areas WHERE enabled AND pest='$pest' AND ((dateto is not null ) AND ((date '$from', date '2099-01-01') overlaps (datefrom,dateto)) OR ( (date '$from')=datefrom ) OR ((date '$from')=dateto))";
			$r = $db->FetchRow($sqlt);
			if ($r['cc']>0) {
				errore("Esistono dei record, per il parassita scelto, che si sovrappongono temporalmente all'intervallo selezionato");
			}
			else {
				$sql = "INSERT INTO simfito.areas(params,anno,datefrom,dateto,pest,the_geom,tampone,contenimento,name) VALUES('$params',NULLIF('$anno','')::integer,'$from',null,'$pest',$geom,NULLIF('$tampone','')::integer,NULLIF('$contenimento','')::integer,'$name') RETURNING id";
//			echo "<b>SQL</b> $sql";
//			exit(0);
				$result = salva_return($sql,'id');
				$id = $result['id'];
				if($tampone==0)
					$geomt = 'null';
				else
					$geomt = "st_transform(st_buffer(st_transform(the_geom,32633),$tampone),3857)";
				if($contenimento==0)
					$geomc = 'null';
				else
					$geomc = "st_transform(st_buffer(st_transform(the_geom,32633),$contenimento),3857)";
				$sql = "update simfito.areas set
							the_geom_t=$geomt,
							the_geom_c=$geomc, 
							area_user_infestata=st_area(st_transform(the_geom,32633))/10000.0,
							area_user_tampone=st_area(st_buffer(st_transform(the_geom,32633),tampone))/10000.0-st_area(st_transform(the_geom,32633))/10000.0,
							area_user_contenimento= st_area(st_buffer(st_transform(the_geom,32633),contenimento))/10000.0-st_area(st_buffer(st_transform(the_geom,32633),tampone))/10000.0 
						WHERE id=$id";
				if ($vector!='')
					$db->SQL($sql);
			}
		break;
		case 'chiudidelimitazione':
			$id = $_REQUEST['id'];
			$to = $_REQUEST['dateto'];
			$sql = "SELECT pest from simfito.areas WHERE id=$id";
			$r = $db->FetchRow($sql);
			$pest = $r['pest'];
			$sql = "WITH x AS (SELECT min(datefrom) as mdt FROM simfito.areas WHERE enabled and pest='$pest' and datefrom>(SELECT datefrom FROM simfito.areas WHERE id=$id))  
					SELECT coalesce(('$to'::date)<min(datefrom),true) as cc FROM simfito.areas,x WHERE enabled and pest='$pest' and id<>$id and datefrom>=x.mdt"; 
//			echo "$sql<br>";
			$r = $db->FetchRow($sql);
			$cc = $r['cc'];
//			echo "'$cc'";
//			exit(0);
			if ($cc=='t') {
				$sql = "UPDATE simfito.areas SET dateto='$to' WHERE id=$id";
				$result = salva($sql);
			}
			else {
				errore("Esistono dei record, per il parassita scelto, che si sovrappongono temporalmente all'intervallo selezionato");
			}
		break;
		case 'unisciaree':
			$idfrom = $_REQUEST['idfrom'];
			$idto = $_REQUEST['idto'];
			$sql = "WITH x AS (SELECT the_geom as geom FROM simfito.areas WHERE id=$idfrom) UPDATE simfito.areas SET the_geom=st_union(the_geom,x.geom) FROM x WHERE id=$idto";
			$result = salva($sql);
		break;
		case 'cancella-area':
			$id=$_REQUEST['id'];
			$sql="UPDATE simfito.areas SET enabled=false WHERE id='$id'";
			$result=salva($sql);
		break;
		default:
			errore("funzione non implementata");
		break;
	}

	echo json_encode($result);
}
?>
