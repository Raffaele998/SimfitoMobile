<?php
require_once("../etc/db_config.php");
require_once("crud.php");

// titolo e' il nome del file che deve apparire, completo della estensione
function doheader($titolo) {
	header('Pragma: public');
	header('Expires: 0');
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Content-Type: application/force-download');
	header('Content-Type: application/octet-stream');
	header('Content-Type: application/download');;
	header("Content-Disposition: attachment;filename=".$titolo);
	header('Content-Transfer-Encoding: binary ');
}

function psg2gjson($sql)
{
	global $db;
	$db->Read($sql);
	$GeoJson="{\"type\": \"FeatureCollection\",
              \"features\": [";
    $i=0;
	while($feature=$db->fetch_assoc()){
		if($i==0) $virgola="";
		else $virgola=",";
		$pre="{\"type\": \"Feature\",
                \"geometry\":";
        $post=",\"properties\": {
					\"Istat\": \"$feature[istat]\",
					\"Comune\":\"$feature[comune]\",
					\"Provincia\": \"$feature[provincia]\"
				}
			}";
		$GeoJson.=$virgola.$pre.$feature["geometry"].$post;
		$i++;
	}
	$GeoJson.="]
                }";
	return $GeoJson;
}

function psg2gjsonA($sql)
{
	global $db;
	$db->Read($sql);
	$GeoJson["sql"]="$sql";
	$GeoJson["type"]="FeatureCollection";
	while($feature=$db->fetch_assoc()){
		$tmp["type"]="Feature";
		$properties=array();
		foreach($feature as $field=>$value){
			if($field=='geometry'){
				$geo=json_decode($feature['geometry'],true);
				$tmp["geometry"]=$geo;
			}else{
				$features[$field]=$value;
			}
		}
		$tmp["properties"]=$features;
		$GeoJson["features"][]=$tmp;
	}
	return json_encode($GeoJson);
}

function psg22gjson($sql)
{
	global $db;
	$db->Read($sql);
	$GeoJson="{\"type\": \"FeatureCollection\",
              \"features\": [";
    $i=0;
	while($feature=$db->fetch_assoc()){
		if($i==0) $virgola="";
		else $virgola=",";
		$pre="{\"type\": \"Feature\",
                \"geometry\":";
        $post=",\"properties\": {
					\"Codice Bayer\": \"$feature[pestcode]\",
					\"Zona\":\"$feature[zona]\"
				}
			}";
		$GeoJson.=$virgola.$pre.$feature["geometry"].$post;
		$i++;
	}
	$GeoJson.="]
                }";

	return $GeoJson;
}

function psg2gjson4mun($sql)
{
	global $db;
	$db->Read($sql);
	$GeoJson["type"]="FeatureCollection";
	/*$GeoJson="{\"type\": \"FeatureCollection\",
              \"features\": [";*/
	while($feature=$db->fetch_assoc()){
		$tmp["type"]="Feature";
		$geo=json_decode($feature['geometry'],true);
		//$geo=$feature['geometry'];
		$tmp["geometry"]=$geo;
		$tmp["properties"]=array("Comune"=>"$feature[comune]","Provincia"=>"$feature[provincia]","Osservazioni"=>"$feature[numero_osservazioni]");
		$GeoJson["features"][]=$tmp;
	}
	return json_encode($GeoJson);
}

function headerCSV($fname='file.csv') {
	header("Content-type: text/csv");
	header("Content-Transfer-Encoding: UTF-8");
	header("Content-Disposition: attachment; filename=$fname");
	header("Pragma: no-cache");
	header("Expires: 0");
}

function readCSV($sql,$fields,$titles) {
	global $db;
//	echo "$sql\n";
	for($i=0;$i<count($titles);$i++) {
		if ($i>0)
			echo ";";
		echo $titles[$i];
	}
	echo "\n";
	$db->Read($sql);
	while($r = $db->fetch_assoc()) {
		for($i=0;$i<count($fields);$i++) {
			if ($i>0)
				echo ";";
			echo $r[$fields[$i]];
		}
		echo "\n";
	}
//	echo "done\n";	
}

function readJson($sql,$extra='')
{
	global $db;
	echo $db->ReadTableAsJson($sql,$extra);
}

function readJson2($sql)
{
	global $db;
	echo $db->ReadTableAsJson2($sql);
}

function pestsJson($id)
{
	global $db;
	global $db2;
	$sql="WITH RECURSIVE padre AS(
			SELECT linkid AS id, t_baylink.codeid, n.full_name AS host_name, codeid_parent
			FROM t_baylink
			INNER JOIN t_bayname AS n ON (t_baylink.codeid=n.codeid)
			INNER JOIN t_bayname AS nparent ON(t_baylink.codeid_parent=nparent.codeid)
			WHERE t_baylink.codeid = $id AND n.preferred=1 AND nparent.preferred=1

			UNION ALL

			SELECT d.linkid AS id, d.codeid, n.full_name AS host_name, d.codeid_parent
			FROM t_baylink AS d
			INNER JOIN padre AS sd ON (d.codeid = sd.codeid_parent)
			INNER JOIN t_bayname AS n ON (d.codeid=n.codeid)
			INNER JOIN t_bayname As nparent ON (d.codeid_parent=nparent.codeid)
			WHERE n.preferred=1 AND nparent.preferred=1
		)
		SELECT *
		FROM padre";
	$db->Read($sql);
	$i=0;
	$db2->connect();
	while ($row=$db->fetch_assoc()){
		if ($i==0){
			$first_host_name=$row['host_name'];
			$first_host_id=$row['codeid'];
		}

		$sql2=" SELECT namehost.full_name AS host_name, namepest.full_name AS pest_name, t_baycode.codeid AS pest_id,
					t_baycode.b_code AS baycode_pest, t_hostclass.labelclass AS class, pest_priority.priority
				FROM t_bayname AS namepest
				INNER JOIN r_attack ON(r_attack.codeid = namepest.codeid)
				INNER JOIN t_baycode ON(namepest.codeid = t_baycode.codeid)
				INNER JOIN t_bayname namehost ON(namehost.codeid = r_attack.codeidhost)
				INNER JOIN t_hostclass ON(r_attack.idclass = t_hostclass.idclass)
				LEFT JOIN simfito.pest_priority ON pest_priority.baycode=t_baycode.b_code
				WHERE r_attack.codeidhost = $row[codeid] AND namehost.preferred = 1 AND namepest.preferred = 1
				ORDER BY t_hostclass.idclass ASC, namepest.full_name ASC;";
		$db2->Read($sql2);
		//echo $sql2;
		while ($row2=$db2->fetch_assoc()){
			$host_name=$row2['host_name'];
			if($host_name!=""){
				foreach($row2 as $field=>$value){
					//echo '<b>'.$field.'</b> '.$value.'<br/>';
					if(($field=='pest_name')&&($host_name!=$first_host_name))
						$value.=" (as $host_name)";
					$data[$i][$field]=$value;
				}
				//var_dump($data[$i]);echo'<br/>';
				$i++;
			}
		}
	}
	arrayAsJson($data);
}

function arrayAsJson($array)
{
	//var_dump($array);
	//echo(isset($array)?'true':'false');
	$json="\"data\":[";
	$i=0;
	if(isset($array)){
		foreach($array as $sub_array){
			if ($i>0) $json.=",";
			$json.="{";
			$j=0;
			foreach ($sub_array as $field=>$value){
				if($j>0) $json.=",";
				$json.="\"$field\":\"$value\"";
				$j++;
				//add presente field boolean;
				$json.=",\"present\":\"false\"";
			}
			$json.="}";
			$i++;
		}
	}
	$totale="{\"results\":\"$i\",";
	$json.="]}";
	echo $totale.$json;
}

function case_boolean($column)
{
	return "CASE WHEN $column='t' THEN 1 ELSE 0 END AS $column";
}

function readDirAsJson($path)
{
	$i=0;
	if (is_dir($path)) {
		if ($directory_handle = opendir($path)) {
			while (($file = readdir($directory_handle)) !== false) {
				if((!is_dir($file))&($file!=".")&($file!=".."))
					$result["data"][$i++]["file_name"]=$file;
			}
			closedir($directory_handle);
		}
	}
	$result["success"]=true;
	$result["results"]=count($result["data"]);
	//var_dump($result);
	echo json_encode($result);
}

function xlsBOF()
{
	echo pack("ssssss", 0x809, 0x8, 0x0, 0x10, 0x0, 0x0);
	return;
}

function xlsEOF()
{
	echo pack("ss", 0x0A, 0x00);
	return;
}

function xlsWriteNumber($Row, $Col, $Value)
{
	echo pack("sssss", 0x203, 14, $Row, $Col, 0x0);
	echo pack("d", $Value);
	return;
}

function xlsWriteLabel($Row, $Col, $Value )
{
	$L = strlen($Value);
	echo pack("ssssss", 0x204, 8+$L, $Row, $Col, 0x0, $L);
	echo $Value;
	return;
}

function xml($titolo,$sql)
{
	header('Pragma: public');
	header('Expires: 0');
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Content-Type: application/force-download');
	header('Content-Type: application/octet-stream');
	header('Content-Type: application/download');;
	header("Content-Disposition: attachment;filename=exported_".$titolo.".xls");
	header('Content-Transfer-Encoding: binary ');
	//echo($sql);
	xlsBOF();
	$r=2;
	xlsWriteLabel(0,0,"$titolo");

	global $db;
	$db->Read($sql);
	while ($data=$db->fetch_assoc()){
		$c=$ch=0;
		foreach($data as $field=>$value){
			xlsWriteLabel(1,$ch++,$field);
			xlsWriteLabel($r,$c++,$value);
		}
		$r++;
	}

	xlsEOF();
	exit();
}

function specialXls($titolo,$sql)
{
	header('Pragma: public');
	header('Expires: 0');
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Content-Type: application/force-download');
	header('Content-Type: application/octet-stream');
	header('Content-Type: application/download');;
	header("Content-Disposition: attachment;filename=exported_".$titolo.".xls");
	header('Content-Transfer-Encoding: binary ');

	xlsBOF();
	$r=2;
	xlsWriteLabel(0,0,"$titolo");

	global $db;
	$db->Read($sql);
	while ($data=$db->fetch_assoc()){
		$c=$ch=0;
		foreach($data as $field=>$value){
			if($field!='geometry' && $field!='the_geom'){
				xlsWriteLabel(1,$ch++,$field);
				xlsWriteLabel($r,$c++,$value);
			}
		}
		$r++;
	}

	xlsEOF();
	exit();
}

function errore($error_reason)
{
	$result["succes"]=false;
	$result["errors"]["reason"]=$error_reason;
	echo json_encode($result);
	exit;
}

function find_host($obs)
{
    global $db;
    $result=$db->FetchRow("SELECT hostcode FROM osservazioni WHERE idosservazioni=$obs");
    return $result['hostcode'];
}

function chk_fenogruppo($obs)
{
    global $db;
    $host=find_host($obs);
    $result=$db->FetchRow("SELECT fenogruppo FROM tipo_fenologico WHERE bayercode='$host'");
    $fenogruppo=$result['fenogruppo'];
    if($fenogruppo=="")
        $fenogruppo="0";
    return $fenogruppo;
}

function sorter_parser($sort)
{
	$req_sort=json_decode($sort,true);
	return $req_sort[0]["property"]." ".$req_sort[0]["direction"];
}

function property_parser($property)
{
	$prop="";
	switch($property){
		case 'statodesc':
			$prop="stato_scheda.descrizione";
		break;
		case 'azienda':
			$prop="azienda.rag_soc";
		break;
		case "iva_azienda":
			$prop="azienda.partita_iva";
		break;
		case "sito":
			$prop="siti.denominaz";
		break;
		case "comune":
			$prop="comuni.nome";
		break;
		case "provincia":
			$prop="comuni.provincia";
		break;
		case 'motivo':
			$prop='tipo_visita.motivo';
		break;
		default:
			$prop=$property;
		break;
	}
	return $prop;
}

function operator_parser($operator,$value)
{
	switch($operator) {
	case 'lt':
		return "<'$value'";
	break;
	case 'gt':
		return ">'$value'";
	break;
	case 'le':
		return "<='$value'";
	break;
	case 'ge':
		return ">='$value'";
	break;
	case 'eq':
		return "='$value'";
	case 'like':
		return " ilike '%$value%'";
	case 'in':
		return " in ($value)";
	}
}

function filter_parser($filterx)
{
	$filter=json_decode($filterx,true);
	$where="";
	$and=" AND ";
	for($i=0;$i<count($filter);$i++){
		$property=property_parser($filter[$i]["property"]);
		switch($property){
			case 'host_name':
				$property='c.full_name';
			break;
			case 'pest_name':
				$property='d.full_name';
			break;
			case 'datareport':
				$property='report.datareport';
			break;
			case 'mainname':
				$property='tecnici2.nome';
			break;
			case 'mainsurname':
				$property='tecnici2.cognome';
			break;
			case 'laboratorio':
				$property='B.laboratorio';
				$val='';
				for($j=0;$j<count($filter[$i]["value"]);$j++){
					if($j==0){
						$val="'".$val.$filter[$i]["value"][$j]."'";
					}
					else{
						$val=",'".$val.$filter[$i]["value"][$j]."'";
					}
				}
				$filter[$i]["value"]=$val;
			break;				
			default:
			break;
		}
		$where.=$and.$property." ".operator_parser($filter[$i]["operator"],$filter[$i]["value"]);
	}
	return $where;
}

function where_for_schede($tecnicoId)
{
	global $db;
	$sql="SELECT tecnici.idtipo_tecnico, tipo_tecnico.tipotecnico, id_provincia, province.sigla, province.denominazione
		FROM simfito.tecnici
		INNER JOIN simfito.tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
		LEFT JOIN province ON tecnici.id_provincia=province.id
		WHERE id_tecnico=$tecnicoId";
	$result=$db->FetchRow($sql);
	$returning['tipotecnico']=$result["idtipo_tecnico"];
	if($result["idtipo_tecnico"]==0){
		$returning["where"]="scheda.stato<>0";
	}
	else if($result["idtipo_tecnico"]==1){
		$returning["where"]="comuni.prvistat=$result[id_provincia] AND scheda.stato<>0";
	}
	else{
		$returning["where"]="(scheda.id_tecnico=$tecnicoId OR schede_tecnici.id_tecnico=$tecnicoId)";
	}
	return $returning;
}

/********** MAIN **********/
$lifetime=3600;
session_start();
setcookie(session_name(),session_id(),time()+$lifetime);

global $connection;
global $att_path;
$db=new CRUD($connection);
$db->connect();
$db->SQL("SET search_path TO public, simfito, eppo");

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

	$mode=$_REQUEST['mode'];
	$idUser=$_REQUEST['idUser'];
	$my_prj=32633; //??

	switch($mode){
		case "test":
			echo "'$connection'";
		break;
		case "changelog":
			$sql="with a as(
						select case when read then 'true' else 'false' end as read from simfito.tecnici where id_tecnico=$_REQUEST[idTecnico]
					)
					select changelog.*,a.read from simfito.changelog,a order by data desc";
			readJson($sql);
		break;
		case "news":
			$sql = "SELECT *, case when deleted then 'true' else 'false' end as deleted FROM news ORDER BY date DESC";
			readJson($sql);
		break;
		case "tecnici":
			$sql="SELECT id_tecnico, nome || ' ' || cognome AS \"nome\"
				FROM tecnici
				WHERE NOT cancellato";
			readJson($sql);
		break;
		/*case "chksession":
			if(!isset($_SESSION["id"])){
				errore("Sessione Scaduta! Si prega di riloggarsi");
			}else{
				$result["succes"]=true;
				echo json_encode($result);
			}
		break;*/
		case "chkconfig":
			$sql="SELECT * FROM config";
			readJson($sql);
		break;
		case "userInfo":
			$sql="SELECT id_tecnico,tipo_tecnico.tipotecnico,nome,cognome,email,ufficio,id_provincia,province.sigla AS provincia
				FROM tecnici
				INNER JOIN tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
				LEFT JOIN province ON tecnici.id_provincia=province.id
				WHERE id_tecnico=$idUser AND NOT cancellato";
			readJson($sql);
		break;
		case "attacco-int":
			$sql="SELECT * FROM intensity --WHERE id_intensity <> 0
				ORDER BY id_intensity";
			readJson($sql);
		break;
		case "attacco-grado":
			$sql="SELECT * FROM grado_attacco --WHERE id_grado <> 0
				ORDER BY id_grado";
			readJson($sql);
		break;
		case "schede":
			$tecnico=where_for_schede($_REQUEST["idTecnico"]);
			$where0=$tecnico["where"];
			$where="";

			if(isset($_REQUEST['filter'])){
				$xx=json_decode($_REQUEST['filter'],true);
				for($i=0;$i<count($xx);$i++){ //elimina l'ambiguità di idscheda
					if($xx[$i]['property']=='idscheda'){
						$xx[$i]['property']='scheda.idscheda';
					}
				}
				$where= filter_parser(json_encode($xx));
			}

			if(isset($_REQUEST['sort'])){
				$order=sorter_parser($_REQUEST['sort']);
			}else{
				$order="case when scheda.stato=1 then 1 else 0 end desc, data_sopralluogo DESC, idscheda DESC";
			}

			$sql="WITH A AS(
					SELECT idscheda, CASE WHEN count(*)>0 THEN 'true' ELSE 'false' END AS daverificare
					FROM simfito.osservazioni
					WHERE rilevato=2
					GROUP BY idscheda
				), B AS (
					SELECT scheda.idscheda, min(level) as minlevel,string_agg(distinct laboratorio.codice,',') as laboratorio
					FROM scheda
					INNER JOIN campioni ON scheda.idscheda=campioni.scheda_id
					LEFT JOIN simfito.osservazioni as o on o.campioni_id=campioni.id 
					LEFT JOIN laboratorio on campioni.laboratorio_id=laboratorio.id
					INNER JOIN laboratoriostato ON campioni.laboratoriostato_id=laboratoriostato.id
					WHERE idosservazioni is not null
					GROUP BY scheda.idscheda
				), C AS (
					SELECT idscheda,sum(case when positive=1 then 1 else 0 end) as numpositive
					FROM scheda
					LEFT JOIN campioni ON scheda.idscheda=campioni.scheda_id
					LEFT JOIN simfitolab.analisys ON campioni.id=analisys.campioni_id
					LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id=analisysresult.id
					GROUP BY idscheda
				), D AS ( SELECT idscheda,array_to_string(array_sort(array_agg(distinct tecnici.nome || ' ' || tecnici.cognome)),', ') as tt
					FROM schede_tecnici 
					INNER JOIN tecnici ON tecnici.id_tecnico=schede_tecnici.id_tecnico 
					GROUP BY idscheda
				), E AS (SELECT idscheda, sum(catture) as totcatture
					FROM simfito.osservazioni
					GROUP BY idscheda
				)
				SELECT scheda.idscheda, scheda.protocollo, idschedatecnico, scheda.id_tecnico, tecnici2.nome as mainname, tecnici2.cognome as mainsurname,  
					trim(both ' ' FROM coalesce(tipo_visita.theme, '')||' '||tipo_visita.motivo) AS motivo,
					tipo_visita.theme as tipo_visita_theme,
					tipo_visita.motivo as tipo_visita_motivo,
					tipo_visita.idtipo_visita as tipo_visita_id,
					case when tipo_visita.enabled then 'true' else 'false' end as motivo_enabled,
					data_sopralluogo, scheda.stato, stato_scheda.descrizione AS statodesc,
					azienda.id_azienda, gid_sito, replace(trim(both ' ' from \"motivo-rigetto\"),E'\n',E'\\n') AS rigetto,
					CASE WHEN gid_sito=-1 THEN 'SITO NON SELEZIONATO' ELSE trim(both ' ' from azienda.rag_soc) END AS azienda,
					CASE WHEN gid_sito=-1 THEN 'SITO NON SELEZIONATO' ELSE trim(both ' ' from azienda.partita_iva) END AS iva_azienda,
					CASE WHEN gid_sito=-1 THEN 'NON SELEZIONATO' ELSE trim(both ' ' from siti.denominaz) END AS sito,
					CASE WHEN gid_sito=-1 THEN 'SITO NON SELEZIONATO' ELSE comuni.nome||' ('||comuni.provincia||')' END AS comune,
					case when coalesce(siti.cancellato,false) then 'true' else 'false' end as siti_cancellato,
					ST_AsGeoJSON(st_transform(siti.the_geom,3857),15,2) AS geometry,
					tecnici2.nome || ' ' || tecnici2.cognome || CASE WHEN D.tt is not null THEN ', ' || D.tt ELSE '' END AS tecnici,
					/*min (laboratoriostato.level) AS laboratoriostato_posotion, laboratoriostato.descrizione AS laboratorio_stato,*/
					B.minlevel as laboratoriostato_posotion,B.laboratorio as laboratorio, laboratoriostato.descrizione AS laboratorio_stato,
					coalesce(daverificare,'false') AS daverificare, 
					CASE WHEN numattach=0 THEN 'false' ELSE 'true' END AS allegati,
					C.numpositive, coalesce(E.totcatture, 0) as totcatture
				FROM scheda
				INNER JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
				LEFT JOIN siti ON scheda.gid_sito=siti.gid
				LEFT JOIN azienda ON siti.piva_azienda=azienda.partita_iva
				INNER JOIN stato_scheda ON scheda.stato=stato_scheda.id
				LEFT JOIN comuni ON siti.comune_istat=comuni.istat
				LEFT JOIN schede_tecnici ON schede_tecnici.idscheda=scheda.idscheda
				LEFT JOIN D ON D.idscheda=scheda.idscheda
				LEFT JOIN tecnici as tecnici2 ON tecnici2.id_tecnico=scheda.id_tecnico
				LEFT JOIN campioni ON scheda.idscheda=campioni.scheda_id
				/*LEFT JOIN laboratoriostato ON campioni.laboratoriostato_id= laboratoriostato.id*/
				LEFT JOIN B ON scheda.idscheda=B.idscheda
				LEFT JOIN laboratoriostato ON B.minlevel=laboratoriostato.level
				LEFT JOIN A ON scheda.idscheda=A.idscheda
				LEFT JOIN C ON scheda.idscheda=C.idscheda
				LEFT JOIN E ON scheda.idscheda=E.idscheda
				/*WHERE (scheda.id_tecnico=$_REQUEST[idTecnico] OR schede_tecnici.id_tecnico=$_REQUEST[idTecnico]) $where*/
				WHERE $where0 $where
				GROUP BY scheda.idscheda, idschedatecnico, scheda.id_tecnico, tipo_visita.theme, tipo_visita.motivo, data_sopralluogo, scheda.stato, 
					stato_scheda.descrizione, azienda.rag_soc, tipo_visita.enabled,
					azienda.partita_iva, azienda.id_azienda, siti.denominaz, \"motivo-rigetto\", comuni.nome, comuni.provincia, siti.the_geom, tecnici2.nome, tecnici2.cognome, gid_sito,
					laboratoriostato.descrizione,daverificare, minlevel,numpositive,laboratorio, D.tt, E.totcatture,
					siti.cancellato,
					tipo_visita.theme,tipo_visita.motivo,tipo_visita.idtipo_visita
				ORDER BY $order /*data_sopralluogo DESC, idscheda DESC*/
				LIMIT $_REQUEST[limit]
				OFFSET $_REQUEST[start]";
			//echo $sql;
			if($tecnico["tipotecnico"]<=1){
				$rsql="SELECT count(*) AS cc
					FROM scheda
					INNER JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
					LEFT JOIN siti ON scheda.gid_sito=siti.gid
					LEFT JOIN azienda ON siti.piva_azienda=azienda.partita_iva
					INNER JOIN stato_scheda ON scheda.stato=stato_scheda.id
					LEFT JOIN comuni ON siti.comune_istat=comuni.istat
					LEFT JOIN schede_tecnici ON schede_tecnici.idscheda=scheda.idscheda
					--LEFT JOIN tecnici ON tecnici.id_tecnico=schede_tecnici.id_tecnico
					LEFT JOIN tecnici as tecnici2 ON tecnici2.id_tecnico=scheda.id_tecnico
					WHERE $where0 $where";
			}
			else {
				$rsql="WITH total AS(
								SELECT scheda.idscheda, idschedatecnico, scheda.id_tecnico, tipo_visita.motivo AS motivo, data_sopralluogo, scheda.stato,
									stato_scheda.descrizione AS statodesc, azienda.rag_soc AS azienda, azienda.partita_iva AS iva_azienda, azienda.id_azienda, siti.denominaz AS sito,
									replace(\"motivo-rigetto\",E'\n',E'\\n') as rigetto, comuni.nome||' ('||comuni.provincia||')' as comune
								FROM scheda
								INNER JOIN tipo_visita ON (scheda.idtipo_visita=tipo_visita.idtipo_visita)
								LEFT JOIN siti ON (scheda.gid_sito=siti.gid)
								LEFT JOIN azienda ON (siti.piva_azienda=azienda.partita_iva)
								INNER JOIN stato_scheda ON (scheda.stato=stato_scheda.id)
								LEFT JOIN comuni ON (siti.comune_istat=comuni.istat)
								WHERE scheda.id_tecnico=$_REQUEST[idTecnico] $where
							UNION
								SELECT scheda.idscheda, idschedatecnico, scheda.id_tecnico, tipo_visita.motivo AS motivo, data_sopralluogo, scheda.stato,
									stato_scheda.descrizione AS statodesc, azienda.rag_soc AS azienda, azienda.partita_iva AS iva_azienda, azienda.id_azienda, siti.denominaz AS sito,
									replace(\"motivo-rigetto\",E'\n',E'\\n') as rigetto, comuni.nome||' ('||comuni.provincia||')' as comune
								FROM schede_tecnici
								LEFT JOIN scheda ON scheda.idscheda=schede_tecnici.idscheda
								INNER JOIN tipo_visita ON (scheda.idtipo_visita=tipo_visita.idtipo_visita)
								LEFT JOIN siti ON (scheda.gid_sito=siti.gid)
								LEFT JOIN azienda ON (siti.piva_azienda=azienda.partita_iva)
								INNER JOIN stato_scheda ON (scheda.stato=stato_scheda.id)
								LEFT JOIN comuni ON (siti.comune_istat=comuni.istat)
								WHERE schede_tecnici.id_tecnico=$_REQUEST[idTecnico] $where
					) SELECT count(*) AS cc FROM total";
			}
			//echo ($sql);
			/*echo "<br>=======================================================================<br/>";
			echo $rsql;
			echo "<br>=======================================================================<br/>";*/
			
			$r=$db->FetchRow($rsql);
			//echo $sql;
			//exit (0);
			$extra="totaldata:$r[cc]";
			readJson($sql,$extra);
		break;
		case "app_schede":
			$tecnico=where_for_schede($_REQUEST["idTecnico"]);
			$where0=$tecnico["where"];
			$where="";

			if(isset($_REQUEST['filter'])){
				$xx=json_decode($_REQUEST['filter'],true);
				for($i=0;$i<count($xx);$i++){ //elimina l'ambiguità di idscheda
					if($xx[$i]['property']=='idscheda'){
						$xx[$i]['property']='scheda.idscheda';
					}
				}
				$where= filter_parser(json_encode($xx));
			}

			if(isset($_REQUEST['sort'])){
				$order=sorter_parser($_REQUEST['sort']);
			}else{
				$order="case when scheda.stato=1 then 1 else 0 end desc, data_sopralluogo DESC, idscheda DESC";
			}

			$sql="WITH A AS(
					SELECT idscheda, CASE WHEN count(*)>0 THEN 'true' ELSE 'false' END AS daverificare
					FROM simfito.osservazioni
					WHERE rilevato=2
					GROUP BY idscheda
				), B AS (
					SELECT scheda.idscheda, min(level) as minlevel,string_agg(distinct laboratorio.codice,',') as laboratorio
					FROM scheda
					INNER JOIN campioni ON scheda.idscheda=campioni.scheda_id
					LEFT JOIN simfito.osservazioni as o on o.campioni_id=campioni.id 
					LEFT JOIN laboratorio on campioni.laboratorio_id=laboratorio.id
					INNER JOIN laboratoriostato ON campioni.laboratoriostato_id=laboratoriostato.id
					WHERE idosservazioni is not null
					GROUP BY scheda.idscheda
				), C AS (
					SELECT idscheda,sum(case when positive=1 then 1 else 0 end) as numpositive
					FROM scheda
					LEFT JOIN campioni ON scheda.idscheda=campioni.scheda_id
					LEFT JOIN simfitolab.analisys ON campioni.id=analisys.campioni_id
					LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id=analisysresult.id
					GROUP BY idscheda
				), D AS ( SELECT idscheda,array_to_string(array_sort(array_agg(distinct tecnici.nome || ' ' || tecnici.cognome)),', ') as tt
					FROM schede_tecnici 
					INNER JOIN tecnici ON tecnici.id_tecnico=schede_tecnici.id_tecnico 
					GROUP BY idscheda
				), E AS (SELECT idscheda, sum(catture) as totcatture
					FROM simfito.osservazioni
					GROUP BY idscheda
				)
				SELECT scheda.idscheda, scheda.protocollo, idschedatecnico, scheda.id_tecnico, tecnici2.nome as mainname, tecnici2.cognome as mainsurname,  
					trim(both ' ' FROM coalesce(tipo_visita.theme, '')||' '||tipo_visita.motivo) AS motivo,
					tipo_visita.theme as tipo_visita_theme,
					tipo_visita.motivo as tipo_visita_motivo,
					tipo_visita.idtipo_visita as tipo_visita_id,
					case when tipo_visita.enabled then 'true' else 'false' end as motivo_enabled,
					data_sopralluogo, scheda.stato, stato_scheda.descrizione AS statodesc,
					azienda.id_azienda, gid_sito, replace(trim(both ' ' from \"motivo-rigetto\"),E'\n',E'\\n') AS rigetto,
					CASE WHEN gid_sito=-1 THEN 'SITO NON SELEZIONATO' ELSE trim(both ' ' from azienda.rag_soc) END AS azienda,
					CASE WHEN gid_sito=-1 THEN 'SITO NON SELEZIONATO' ELSE trim(both ' ' from azienda.partita_iva) END AS iva_azienda,
					CASE WHEN gid_sito=-1 THEN 'NON SELEZIONATO' ELSE trim(both ' ' from siti.denominaz) END AS sito,
					CASE WHEN gid_sito=-1 THEN 'SITO NON SELEZIONATO' ELSE comuni.nome||' ('||comuni.provincia||')' END AS comune,
					case when coalesce(siti.cancellato,false) then 'true' else 'false' end as siti_cancellato,
					ST_AsGeoJSON(st_transform(siti.the_geom,3857),15,2) AS geometry,
					tecnici2.nome || ' ' || tecnici2.cognome || CASE WHEN D.tt is not null THEN ', ' || D.tt ELSE '' END AS tecnici,
					/*min (laboratoriostato.level) AS laboratoriostato_posotion, laboratoriostato.descrizione AS laboratorio_stato,*/
					B.minlevel as laboratoriostato_posotion,B.laboratorio as laboratorio, laboratoriostato.descrizione AS laboratorio_stato,
					coalesce(daverificare,'false') AS daverificare, 
					CASE WHEN numattach=0 THEN 'false' ELSE 'true' END AS allegati,
					C.numpositive, coalesce(E.totcatture, 0) as totcatture
				FROM scheda
				INNER JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
				LEFT JOIN siti ON scheda.gid_sito=siti.gid
				LEFT JOIN azienda ON siti.piva_azienda=azienda.partita_iva
				INNER JOIN stato_scheda ON scheda.stato=stato_scheda.id
				LEFT JOIN comuni ON siti.comune_istat=comuni.istat
				LEFT JOIN schede_tecnici ON schede_tecnici.idscheda=scheda.idscheda
				LEFT JOIN D ON D.idscheda=scheda.idscheda
				LEFT JOIN tecnici as tecnici2 ON tecnici2.id_tecnico=scheda.id_tecnico
				LEFT JOIN campioni ON scheda.idscheda=campioni.scheda_id
				/*LEFT JOIN laboratoriostato ON campioni.laboratoriostato_id= laboratoriostato.id*/
				LEFT JOIN B ON scheda.idscheda=B.idscheda
				LEFT JOIN laboratoriostato ON B.minlevel=laboratoriostato.level
				LEFT JOIN A ON scheda.idscheda=A.idscheda
				LEFT JOIN C ON scheda.idscheda=C.idscheda
				LEFT JOIN E ON scheda.idscheda=E.idscheda
				/*WHERE (scheda.id_tecnico=$_REQUEST[idTecnico] OR schede_tecnici.id_tecnico=$_REQUEST[idTecnico]) $where*/
				WHERE $where0 $where and scheda.stato=0
				GROUP BY scheda.idscheda, idschedatecnico, scheda.id_tecnico, tipo_visita.theme, tipo_visita.motivo, data_sopralluogo, scheda.stato, 
					stato_scheda.descrizione, azienda.rag_soc, tipo_visita.enabled,
					azienda.partita_iva, azienda.id_azienda, siti.denominaz, \"motivo-rigetto\", comuni.nome, comuni.provincia, siti.the_geom, tecnici2.nome, tecnici2.cognome, gid_sito,
					laboratoriostato.descrizione,daverificare, minlevel,numpositive,laboratorio, D.tt, E.totcatture,
					siti.cancellato,
					tipo_visita.theme,tipo_visita.motivo,tipo_visita.idtipo_visita
				ORDER BY $order /*data_sopralluogo DESC, idscheda DESC*/
				LIMIT $_REQUEST[limit]
				OFFSET $_REQUEST[start]";
			//echo $sql;
			if($tecnico["tipotecnico"]<=1){
				$rsql="SELECT count(*) AS cc
					FROM scheda
					INNER JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
					LEFT JOIN siti ON scheda.gid_sito=siti.gid
					LEFT JOIN azienda ON siti.piva_azienda=azienda.partita_iva
					INNER JOIN stato_scheda ON scheda.stato=stato_scheda.id
					LEFT JOIN comuni ON siti.comune_istat=comuni.istat
					LEFT JOIN schede_tecnici ON schede_tecnici.idscheda=scheda.idscheda
					--LEFT JOIN tecnici ON tecnici.id_tecnico=schede_tecnici.id_tecnico
					LEFT JOIN tecnici as tecnici2 ON tecnici2.id_tecnico=scheda.id_tecnico
					WHERE $where0 $where and scheda.stato=0";
			}
			else {
				$rsql="WITH total AS(
								SELECT scheda.idscheda, idschedatecnico, scheda.id_tecnico, tipo_visita.motivo AS motivo, data_sopralluogo, scheda.stato,
									stato_scheda.descrizione AS statodesc, azienda.rag_soc AS azienda, azienda.partita_iva AS iva_azienda, azienda.id_azienda, siti.denominaz AS sito,
									replace(\"motivo-rigetto\",E'\n',E'\\n') as rigetto, comuni.nome||' ('||comuni.provincia||')' as comune
								FROM scheda
								INNER JOIN tipo_visita ON (scheda.idtipo_visita=tipo_visita.idtipo_visita)
								LEFT JOIN siti ON (scheda.gid_sito=siti.gid)
								LEFT JOIN azienda ON (siti.piva_azienda=azienda.partita_iva)
								INNER JOIN stato_scheda ON (scheda.stato=stato_scheda.id)
								LEFT JOIN comuni ON (siti.comune_istat=comuni.istat)
								WHERE scheda.id_tecnico=$_REQUEST[idTecnico] $where and scheda.stato=0
							UNION
								SELECT scheda.idscheda, idschedatecnico, scheda.id_tecnico, tipo_visita.motivo AS motivo, data_sopralluogo, scheda.stato,
									stato_scheda.descrizione AS statodesc, azienda.rag_soc AS azienda, azienda.partita_iva AS iva_azienda, azienda.id_azienda, siti.denominaz AS sito,
									replace(\"motivo-rigetto\",E'\n',E'\\n') as rigetto, comuni.nome||' ('||comuni.provincia||')' as comune
								FROM schede_tecnici
								LEFT JOIN scheda ON scheda.idscheda=schede_tecnici.idscheda
								INNER JOIN tipo_visita ON (scheda.idtipo_visita=tipo_visita.idtipo_visita)
								LEFT JOIN siti ON (scheda.gid_sito=siti.gid)
								LEFT JOIN azienda ON (siti.piva_azienda=azienda.partita_iva)
								INNER JOIN stato_scheda ON (scheda.stato=stato_scheda.id)
								LEFT JOIN comuni ON (siti.comune_istat=comuni.istat)
								WHERE schede_tecnici.id_tecnico=$_REQUEST[idTecnico] $where and scheda.stato=0
					) SELECT count(*) AS cc FROM total";
			}
			//echo ($sql);
			/*echo "<br>=======================================================================<br/>";
			echo $rsql;
			echo "<br>=======================================================================<br/>";*/
			
			$r=$db->FetchRow($rsql);
			//echo $sql;
			//exit (0);
			$extra="totaldata:$r[cc]";
			readJson($sql,$extra);
		break;
		case "referti":
			$sub = ( isset($_REQUEST['sub']) ? $_REQUEST['sub'] : '');
 
			$tecnico=where_for_schede($_REQUEST["idTecnico"]);
			$where0=$tecnico["where"];
			$where="";
			if(isset($_REQUEST['filter'])){
				$where= filter_parser($_REQUEST['filter']);
			}

			if(isset($_REQUEST['sort'])){
				$order=sorter_parser($_REQUEST['sort']);
			}else{
				$order="report.datareport DESC, data_sopralluogo DESC, idscheda DESC";
			}

			if ($sub=='') {
				$paging = "LIMIT $_REQUEST[limit] OFFSET $_REQUEST[start]";
				$exfield = '';			
			}
			else{
				$paging = '';
				$exfield = ", 'http://$hostapp/simfitolab/services/report.php?mode=pdf&table=report&idv=' || report.id AS link";
			}

			$sql="WITH A AS(
					SELECT idscheda, CASE WHEN count(*)>0 THEN 'true' ELSE 'false' END AS daverificare
					FROM simfito.osservazioni
					WHERE rilevato=2
					GROUP BY idscheda
				)
				SELECT report.id AS report_id,campioni.codice, to_char(report.datareport,'YYYY-MM-DD') AS datareport, scheda.idscheda, idschedatecnico, scheda.id_tecnico,
					trim(both ' ' FROM coalesce(tipo_visita.theme, '')||' '||tipo_visita.motivo) AS motivo, data_sopralluogo, scheda.stato, stato_scheda.descrizione AS statodesc, azienda.id_azienda, gid_sito,
					replace(trim(both ' ' from \"motivo-rigetto\"),E' ',E'\n') AS rigetto,
					trim(both ' ' from azienda.rag_soc) AS azienda, trim(both ' ' from azienda.partita_iva) AS iva_azienda, trim(both ' ' from siti.denominaz) AS sito,
					comuni.nome||' ('||comuni.provincia||')' AS comune,
					tecnici2.nome || ' ' || tecnici2.cognome || CASE WHEN array_to_string(array_sort(array_agg(distinct tecnici.nome || ' ' || tecnici.cognome)),', ') <> '' THEN ', ' || array_to_string(array_sort(array_agg(distinct tecnici.nome || ' ' || tecnici.cognome)),', ') ELSE '' END AS tecnici,
					laboratoriostato.level AS laboratoriostato_position, laboratoriostato.descrizione AS laboratorio_stato, coalesce(daverificare,'false') AS daverificare $exfield
				FROM scheda
				INNER JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
				LEFT JOIN siti ON scheda.gid_sito=siti.gid
				LEFT JOIN azienda ON siti.piva_azienda=azienda.partita_iva
				INNER JOIN stato_scheda ON scheda.stato=stato_scheda.id
				LEFT JOIN comuni ON siti.comune_istat=comuni.istat
				LEFT JOIN schede_tecnici ON schede_tecnici.idscheda=scheda.idscheda
				LEFT JOIN tecnici ON tecnici.id_tecnico=schede_tecnici.id_tecnico
				LEFT JOIN tecnici as tecnici2 ON tecnici2.id_tecnico=scheda.id_tecnico
				LEFT JOIN campioni ON scheda.idscheda=campioni.scheda_id
				LEFT JOIN laboratoriostato ON campioni.laboratoriostato_id= laboratoriostato.id
				inner join simfitolab.report on campioni.id=report.campioni_id
				LEFT JOIN A ON scheda.idscheda=A.idscheda
				WHERE report.reportstate_id=2 AND $where0 $where
				GROUP BY scheda.idscheda, idschedatecnico, scheda.id_tecnico, tipo_visita.motivo, data_sopralluogo, scheda.stato, stato_scheda.descrizione, azienda.rag_soc,
					azienda.partita_iva, azienda.id_azienda, siti.denominaz, \"motivo-rigetto\", comuni.nome, comuni.provincia, tecnici2.nome, tecnici2.cognome, gid_sito,
					laboratoriostato.descrizione,	daverificare, laboratoriostato_position,campioni.codice, report.datareport, report.id, tipo_visita.theme
				ORDER BY $order
				$paging";
			//echo $sql;

			$rsql="WITH b AS(
						WITH A AS(
							SELECT idscheda, CASE WHEN count(*)>0 THEN 'true' ELSE 'false' END AS daverificare
							FROM simfito.osservazioni WHERE rilevato=2
							GROUP BY idscheda
						)
						SELECT scheda.idscheda
						FROM scheda
						INNER JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
						LEFT JOIN siti ON scheda.gid_sito=siti.gid
						LEFT JOIN azienda ON siti.piva_azienda=azienda.partita_iva
						INNER JOIN stato_scheda ON scheda.stato=stato_scheda.id
						LEFT JOIN comuni ON siti.comune_istat=comuni.istat
						LEFT JOIN schede_tecnici ON schede_tecnici.idscheda=scheda.idscheda
						LEFT JOIN tecnici ON tecnici.id_tecnico=schede_tecnici.id_tecnico
						LEFT JOIN tecnici as tecnici2 ON tecnici2.id_tecnico=scheda.id_tecnico
						LEFT JOIN campioni ON scheda.idscheda=campioni.scheda_id
						LEFT JOIN laboratoriostato ON campioni.laboratoriostato_id= laboratoriostato.id
						inner join simfitolab.report on campioni.id=report.campioni_id
						LEFT JOIN A ON scheda.idscheda=A.idscheda
						WHERE report.reportstate_id=2 AND $where0 $where
						GROUP BY scheda.idscheda, idschedatecnico, scheda.id_tecnico, tipo_visita.motivo, data_sopralluogo, scheda.stato, stato_scheda.descrizione, azienda.rag_soc,
							azienda.partita_iva, azienda.id_azienda, siti.denominaz, \"motivo-rigetto\", comuni.nome, comuni.provincia, tecnici2.nome, tecnici2.cognome, gid_sito,
							laboratoriostato.descrizione,	daverificare, campioni.codice, report.datareport, report.id
				)
				SELECT count(*) AS cc FROM b";
			//echo $rsql;
			if ($sub=='xls') {
				specialXls('referti',$sql);
			}
			else if ($sub=='') {
				$r=$db->FetchRow($rsql);
				$extra="totaldata:$r[cc]";

				readJson($sql,$extra);
			}
			else {
				;
			}
		break;
		case "schedeall":
			if ($_REQUEST['provincia']!='null'){
				$AND=" AND province.id='$_REQUEST[provincia]' ";
				$comune="comuni.nome AS comune";
			}else{
				$AND="";
				$comune="comuni.nome||' ('||comuni.provincia||')' as comune";
			}
			if(isset($_REQUEST['filter'])){
				$where= filter_parser($_REQUEST['filter']);
			}
			if(isset($_REQUEST['sort'])){
				$order=sorter_parser($_REQUEST['sort']);
			}else $order="data_sopralluogo DESC";

			$sql="SELECT scheda.idscheda, idschedatecnico, tipo_visita.theme||' '||tipo_visita.motivo AS motivo, data_sopralluogo, scheda.stato, stato_scheda.descrizione AS statodesc,
					azienda.rag_soc AS azienda, azienda.partita_iva AS iva_azienda, azienda.id_azienda, replace(\"motivo-rigetto\",E'\\n',E'\\\\n') as rigetto,
					siti.denominaz AS sito, tecnici.nome, tecnici.cognome, st_y(st_transform(siti.the_geom,$my_prj)) AS lat, st_x(st_transform(siti.the_geom,$my_prj)) AS lon,
					siti.quota,comuni.provincia, obs_statistiche.rilevati, obs_statistiche.segnalazioni,$comune
				FROM scheda
				INNER JOIN tipo_visita ON (scheda.idtipo_visita=tipo_visita.idtipo_visita)
				INNER JOIN siti ON (scheda.gid_sito=siti.gid)
				INNER JOIN azienda ON (siti.piva_azienda=azienda.partita_iva)
				INNER JOIN tecnici ON (tecnici.id_tecnico=scheda.id_tecnico)
				INNER JOIN stato_scheda ON (scheda.stato=stato_scheda.id)
				INNER JOIN comuni ON (siti.comune_istat=comuni.istat)
				INNER JOIN province ON (comuni.provincia=province.sigla)
				INNER JOIN obs_statistiche ON (obs_statistiche.idscheda=scheda.idscheda)
				WHERE (scheda.stato>0 OR scheda.stato=-1) $AND
				ORDER BY $order, idscheda DESC
				LIMIT $_REQUEST[limit]
				OFFSET $_REQUEST[start]";
			//echo $sql;
			$rsql="SELECT count(*) AS cc
				FROM scheda
				INNER JOIN tipo_visita ON (scheda.idtipo_visita=tipo_visita.idtipo_visita)
				INNER JOIN siti ON (scheda.gid_sito=siti.gid)
				INNER JOIN azienda ON (siti.piva_azienda=azienda.partita_iva)
				INNER JOIN tecnici ON (tecnici.id_tecnico=scheda.id_tecnico)
				INNER JOIN stato_scheda ON (scheda.stato=stato_scheda.id)
				INNER JOIN comuni ON (siti.comune_istat=comuni.istat)
				INNER JOIN province ON (comuni.provincia=province.sigla)
				INNER JOIN obs_statistiche ON (obs_statistiche.idscheda=scheda.idscheda)
				WHERE (scheda.stato>0 OR scheda.stato=-1) $AND";

			$r=$db->FetchRow($rsql);
			$extra="totaldata:$r[cc]";

			readJson($sql,$extra);
		break;
		case "tipoazienda":
			readJson("SELECT id, descrizione FROM tipoazienda WHERE attiva ORDER BY id");
		break;
		case "tipoaziendaall":
			readJson("SELECT id, descrizione, CASE WHEN attiva THEN 'true' ELSE 'false' END AS attiva FROM tipoazienda ORDER BY id");
		break;
		case "aziendeall":
			$where="";
			if(isset($_REQUEST['filter'])){
				//$filters=json_decode($_REQUEST['filter'],true);
				//for ($i=0;$i<count($filters);$i++){
					$where= filter_parser($_REQUEST['filter']);
				//}
			}
			$rup=case_boolean('rup');
			$vivaio=case_boolean('vivaio');
			$fito=case_boolean('fito');
			if(isset($_REQUEST['sort'])){
				$order=sorter_parser($_REQUEST['sort']);
			}else $order="partita_iva";

			$sql="SELECT id_azienda, partita_iva,rag_soc,$rup,$vivaio,$fito, array_to_string(array_sort(array_agg(distinct tipoazienda.descrizione)),', ') AS tipo,
						istat_comune, azienda.indirizzo AS indirizzo, cap, comuni.nome AS comune, comuni.provincia AS provincia, referente, posizione_ref,
						telefono,fax, email,box2d(st_transform(st_union(siti.the_geom),3857)) as bbox
				FROM azienda
				LEFT JOIN comuni ON (azienda.istat_comune=comuni.istat)
				LEFT JOIN azienda_tipoazienda ON azienda_id=id_azienda
				LEFT JOIN tipoazienda ON tipoazienda_id=tipoazienda.id
				LEFT JOIN siti ON azienda.partita_iva=siti.piva_azienda
				WHERE 1=1 $where
				GROUP BY id_azienda, partita_iva,rag_soc,rup,vivaio,fito, istat_comune, azienda.indirizzo, cap,
						comuni.nome, comuni.provincia, referente, posizione_ref,telefono,fax,email
				ORDER BY $order, id_azienda DESC
				LIMIT $_REQUEST[limit]
				OFFSET $_REQUEST[start]";

			$rsql="SELECT count(*) AS cc
				FROM azienda
				LEFT JOIN comuni ON (azienda.istat_comune=comuni.istat)
				WHERE 1=1 $where";

			$r=$db->FetchRow($rsql);
			$extra="totaldata:$r[cc]";

			readJson($sql,$extra);
		break;
		case "azienda_data":
			$rup=case_boolean('rup');
			$vivaio=case_boolean('vivaio');
			$fito=case_boolean('fito');
			$sql="SELECT id_azienda, partita_iva,rag_soc,$rup,$vivaio,$fito, istat_comune, azienda.indirizzo AS indirizzo, cap,
					comuni.nome AS comune, comuni.provincia AS provincia, referente, posizione_ref,telefono,fax,email
					FROM azienda
					LEFT JOIN comuni ON (azienda.istat_comune=comuni.istat)
					WHERE id_azienda=$_REQUEST[id_azienda]";
			  readJson($sql);
		break;
		case "aziendeall2":
			$rup=case_boolean('rup');
			$vivaio=case_boolean('vivaio');
			$fito=case_boolean('fito');
			$where='';
			if((isset($_REQUEST['query']))&&($_REQUEST['query']!='')){
				$ser=pg_escape_string($_REQUEST['query']);
				//$where=" AND rag_soc ilike '%$_REQUEST[query]%' OR partita_iva ilike '$_REQUEST[query]%'";
				$where=" AND rag_soc ilike '%$ser%' OR partita_iva ilike '$ser%'";
			}
			if(isset($_REQUEST['sort'])){
				$order=sorter_parser($_REQUEST['sort']);
			}else $order="partita_iva";

			/*$sql="SELECT id_azienda, partita_iva,rag_soc,$rup,$vivaio,$fito, istat_comune, azienda.indirizzo AS indirizzo, cap,
					comuni.nome AS comune, comuni.provincia AS provincia, referente, posizione_ref,telefono,fax,email
				FROM azienda
				LEFT JOIN comuni ON (azienda.istat_comune=comuni.istat)
				$where
				ORDER BY partita_iva
				/*LIMIT $_REQUEST[limit]
				OFFSET $_REQUEST[start]*";*/

			$sql="SELECT id_azienda, partita_iva,rag_soc,$rup,$vivaio,$fito, array_to_string(array_sort(array_agg(distinct tipoazienda.descrizione)),', ') AS tipo,
						istat_comune, azienda.indirizzo AS indirizzo, cap, comuni.nome AS comune, comuni.provincia AS provincia, referente, posizione_ref,
						telefono,fax,email,box2d(st_transform(st_union(siti.the_geom),3857)) as bbox
				FROM azienda
				LEFT JOIN comuni ON (azienda.istat_comune=comuni.istat)
				LEFT JOIN azienda_tipoazienda ON azienda_id=id_azienda
				LEFT JOIN tipoazienda ON tipoazienda_id=tipoazienda.id
				LEFT JOIN siti ON azienda.partita_iva=siti.piva_azienda
				WHERE 1=1 $where
				GROUP BY id_azienda, partita_iva,rag_soc,rup,vivaio,fito, istat_comune, azienda.indirizzo, cap,
						comuni.nome, comuni.provincia, referente, posizione_ref,telefono,fax,email
				--$where
				ORDER BY $order, id_azienda DESC
				LIMIT $_REQUEST[limit]
				OFFSET $_REQUEST[start]";

			$rsql="SELECT count(*) AS cc
				FROM azienda
				LEFT JOIN comuni ON (azienda.istat_comune=comuni.istat)
				$where";

			$r=$db->FetchRow($rsql);
			$extra="totaldata:$r[cc]";

			readJson($sql,$extra);//,$extra);
		break;
		case "aziende":
			$rup=case_boolean('rup');
			$vivaio=case_boolean('vivaio');
			$fito=case_boolean('fito');
			$sql="SELECT id_azienda, partita_iva,rag_soc,$rup,$vivaio,$fito, comuni.nome AS comune, comuni.provincia AS provincia,
					azienda.indirizzo AS indirizzo, cap, referente, posizione_ref,telefono,fax,email
				FROM azienda
				INNER JOIN siti ON (azienda.partita_iva=siti.piva_azienda)
				INNER JOIN scheda ON (siti.gid=scheda.gid_sito)
				INNER JOIN comuni ON (azienda.istat_comune=comuni.istat)
				WHERE id_tecnico=$_REQUEST[idTecnico]
				ORDER BY id_azienda DESC";
			readJson($sql);
		break;
		case "azienda":
			$sql="SELECT * FROM azienda WHERE partita_iva=$_REQUEST[piva]";
			readJson($sql);
		break;
		case "siti":
			$where="";
			if(isset($_REQUEST['filter'])){
				$filters=json_decode($_REQUEST['filter'],true);
				for ($i=0;$i<count($filters);$i++){
					$where= filter_parser($_REQUEST['filter']);
				}
			}

			if(isset($_REQUEST['sort'])){
				$order=sorter_parser($_REQUEST['sort']);
			}else $order="partita_iva";

			if (isset($_REQUEST['piva'])){
				$where.=" AND azienda.partita_iva='$_REQUEST[piva]' AND not cancellato";
			}
			if((isset($_REQUEST['query']))&&($_REQUEST['query']!='')){
				$ser=pg_escape_string($_REQUEST['query']);
				$where.=" AND siti.denominaz ILIKE '%$ser%'";
			}

			$sql="SELECT siti.gid AS id, azienda.rag_soc AS rag_soc, siti.localita AS localita, siti.denominaz AS denominazione, comuni.nome AS comune,
				comuni.provincia AS provincia, ST_AsGeoJSON(st_transform(siti.the_geom,3857),15,2) AS geometry, superficie_ha, 
				tipologiasito.description as tipologiasito, tipologiasito_id, tipologiasito.theme_id
				FROM siti
				INNER JOIN azienda ON (azienda.partita_iva=siti.piva_azienda)
				LEFT JOIN comuni ON (siti.comune_istat=comuni.istat)
				LEFT JOIN tipologiasito on siti.tipologiasito_id=tipologiasito.id
				WHERE 1=1 $where
				ORDER BY $order, siti.denominaz";
			readJson($sql);
		break;
		case "siti1":
			$where="";
			if(isset($_REQUEST['filter'])){
				$filters=json_decode($_REQUEST['filter'],true);
				for ($i=0;$i<count($filters);$i++){
					$where= filter_parser($_REQUEST['filter']);
				}
			}

			if(isset($_REQUEST['sort'])){
				$order=sorter_parser($_REQUEST['sort']);
			}else $order="partita_iva";

			if (isset($_REQUEST['piva'])){
				$where.=" AND azienda.partita_iva='$_REQUEST[piva]' AND not cancellato";
			}
			if((isset($_REQUEST['query']))&&($_REQUEST['query']!='')){
				$ser=pg_escape_string($_REQUEST['query']);
				$where.=" AND siti.denominaz ILIKE '%$ser%'";
			}

			$sql="SELECT siti.gid AS id, azienda.rag_soc AS rag_soc, siti.localita AS localita, siti.denominaz AS denominazione, comuni.nome AS comune,
				comuni.provincia AS provincia, ST_AsGeoJSON(st_transform(siti.the_geom,3857),15,2) AS geometry, superficie_ha, 
				tipologiasito.description as tipologiasito, tipologiasito_id, tipologiasito.theme_id
				FROM siti
				INNER JOIN azienda ON (azienda.partita_iva=siti.piva_azienda)
				LEFT JOIN comuni ON (siti.comune_istat=comuni.istat)
				LEFT JOIN tipologiasito on siti.tipologiasito_id=tipologiasito.id
				WHERE 1=1 $where
				ORDER BY $order, siti.denominaz
				OFFSET $_REQUEST[start] LIMIT $_REQUEST[limit]";
			
			$rsql="SELECT count(*) AS cc
				FROM siti
				INNER JOIN azienda ON (azienda.partita_iva=siti.piva_azienda)
				LEFT JOIN comuni ON (siti.comune_istat=comuni.istat)
				LEFT JOIN tipologiasito on siti.tipologiasito_id=tipologiasito.id
				WHERE 1=1 $where
				--ORDER BY $order, siti.denominaz, omune_istat, tipologiasito_id";

			$r=$db->FetchRow($rsql);
			$extra="totaldata:$r[cc]";

			readJson($sql,$extra);
		break;
		case "sitiall":
			if (isset($_REQUEST['piva'])){
				$where="WHERE azienda.partita_iva='$_REQUEST[piva]' ";
			}else if((isset($_REQUEST['query']))&&($_REQUEST!='')){
				$ser=pg_escape_string($_REQUEST['query']);
				$where="WHERE siti.denominaz ILIKE '%$ser%' ";
			}else{
				$where="";
			}
			if(isset($_REQUEST['limit']) && isset($_REQUEST['start'])){
				$limit="LIMIT $_REQUEST[limit]	OFFSET $_REQUEST[start]";
			} else {
				$limit="";
			}
			$sql="SELECT siti.gid AS id, azienda.rag_soc AS rag_soc, siti.localita AS localita, siti.denominaz AS denominazione, comuni.nome AS comune, comuni.provincia AS provincia,
					st_y(st_transform(siti.the_geom,$my_prj)) AS lat, st_x(st_transform(siti.the_geom,$my_prj)) AS lon, azienda.id_azienda, superficie_ha
				FROM siti
				INNER JOIN azienda ON (azienda.partita_iva=siti.piva_azienda)
				LEFT JOIN comuni ON (azienda.istat_comune=comuni.istat)
				$where
				ORDER BY siti.gid DESC
				$limit";

			$rsql="SELECT count(*) AS cc
				FROM siti
				INNER JOIN azienda ON (azienda.partita_iva=siti.piva_azienda)
				LEFT JOIN comuni ON (azienda.istat_comune=comuni.istat)
				$where";

			$r=$db->FetchRow($rsql);
			$extra="totaldata:$r[cc]";

			readJson($sql,$extra);
		break;
		case "osservazioni":
			$campione=case_boolean('campione');
			if (true) {
				$sql="WITH abbattute AS(
						SELECT SUM(quantity) AS somma,osservazioni_id
						FROM simfito.abbattimenti
						GROUP BY osservazioni_id
					), analisi AS(
						SELECT
							analisys.osservazioni_id,
							count(*) as laboratory_total,
							sum(case analisysresult.positive when 1 then 1 else 0 end) AS laboratory_xpositive,
							sum(case analisysresult.positive when 2 then 1 else 0 end) AS laboratory_xnonappl,
							case when sum(case analisysresult.positive when 2 then 1 else 0 end)=count(*) then 2 when sum(case analisysresult.positive when 1 then 1 else 0 end)>0 then 1 else 0 end as laboratory_positive,
							case when sum(case analisysresult.positive when 2 then 1 else 0 end)=count(*) then 'Non Applicabile' when sum(case analisysresult.positive when 1 then 1 else 0 end)=0 then 'Negativo' else 'Positivo' end  AS lobaratory_result
						FROM simfitolab.analisys
						INNER JOIN simfito.campioni ON analisys.campioni_id=campioni.id
						LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id=analisysresult.id
						WHERE campioni.laboratoriostato_id=6
						GROUP BY osservazioni_id
					)
						SELECT idosservazioni, a.full_name AS ospite, b.full_name AS parassita,
							(CASE WHEN rilevato=0 THEN 'non presente' WHEN rilevato=1 THEN 'presente' ELSE 'da verificare' END) AS presente, rilevato,
							replace(replace(sospetti,E'\\r',''),E'\\n',E'\\\\n') as sospetti, $campione, campioni.codice /*,risultato*/, campioni.elementicampione, intensity.nome_intensity,
							grado_attacco.nome_grado,fase_fenologica, varieta, eta, organi, pericolosita, data_impianto, count(trappole.*) As n_trappole, appezzamento,dens_piante,
							fase_fenologica,coltura_prec, COALESCE(abbattute.somma, 0) AS n_abbattute,
							(case when n_osservate is null then 'nan' else n_osservate end),
							(case when piante_camp_vis is null then 'nan' else piante_camp_vis end),
							(case when piante_infest is null then 'nan' else piante_infest end),
							(case when sup_vis is null then 'nan' else sup_vis end),
							(case when sup_infest is null then 'nan' else sup_infest end),
							(case when completa then 'true' else 'false' end) AS completa,
							ST_AsGeoJSON(st_transform(osservazioni.the_geom,3857),15,2) AS geometry,
							intensity.id_intensity,grado_attacco.id_grado,
							lobaratory_result, laboratory_positive, tempo, campioni.tipocampione_id, tipocampione.description as tipocampione_description,
							unita as unit_tot, unita_chk as unit_chk, peso as peso_tot, peso_chk, lotti as lotti_tot, lotti_chk, lotti_camp,
							tipologiacontrollata_id as tipologia_id, tipologiacontrollata.descrizione as tipologiacontrollata_descrizione, provenienza
						FROM simfito.osservazioni
						LEFT JOIN abbattute ON abbattute.osservazioni_id=osservazioni.idosservazioni
						LEFT JOIN simfito.campioni ON campioni.id=osservazioni.campioni_id
						INNER JOIN t_vista AS a ON (osservazioni.hostcode=a.b_code)
						INNER JOIN t_vista AS b ON (osservazioni.pestcode=b.b_code)
						INNER JOIN simfito.intensity ON (osservazioni.attacco_int=intensity.id_intensity)
						INNER JOIN simfito.grado_attacco ON (osservazioni.attacco_grado=grado_attacco.id_grado)
						LEFT JOIN simfito.trappole ON trappole.id_osservazione=osservazioni.idosservazioni
						LEFT JOIN analisi ON osservazioni.idosservazioni=analisi.osservazioni_id
						LEFT JOIN tipocampione on campioni.tipocampione_id=tipocampione.id
						LEFT JOIN tipologiacontrollata on osservazioni.tipologiacontrollata_id=tipologiacontrollata.id
						WHERE idscheda=$_REQUEST[idscheda] and visiva
						GROUP BY osservazioni.idosservazioni,a.full_name,b.full_name,rilevato,sospetti,campione,campioni.codice/*,risultato*/,campioni.elementicampione, intensity.nome_intensity,grado_attacco.nome_grado, fase_fenologica,varieta,n_osservate,eta,organi,pericolosita,data_impianto,appezzamento,dens_piante, piante_camp_vis,fase_fenologica,coltura_prec,
						piante_infest,sup_vis,sup_infest,abbattute.somma,completa, osservazioni.the_geom,intensity.id_intensity,grado_attacco.id_grado,analisi.lobaratory_result,
						laboratory_positive, tempo, campioni.tipocampione_id, tipocampione.description,
						unita, unita_chk, peso, peso_chk, lotti, lotti_chk, lotti_camp, tipologiacontrollata_id, tipologiacontrollata.descrizione,provenienza
						--ORDER BY osservazioni.idosservazioni
					UNION
						SELECT CAST(null AS numeric) AS idosservazioni, a.full_name AS ospite, b.full_name AS parassita,
							analisysresult.name AS presente, CAST(null AS numeric) AS rilevato,
							null As sospetti, 1 AS campione, campioni.codice /*,null AS risultato*/, campioni.elementicampione, null AS nome_intensity,
							null AS nome_grado, null AS fase_fenologica, null AS varieta, null AS eta, null AS organi, null AS pericolosita, null AS data_impianto, 0 As n_trappole,
							null AS appezzamento, null AS dens_piante, null AS fase_fenologica, null AS coltura_prec, 0 AS n_abbattute, 'nan' AS n_osservate,
							'nan' AS piante_camp_vis, 'nan' AS piante_infest, 'nan' AS sup_vis, 'nan' AS sup_infest, 'true' AS completa,
							null AS geometry, null AS id_intensity, null AS id_grado,
							analisysresult.description AS lobaratory_result, analisysresult.positive AS laboratory_positive, null as tempo, null as tipocampione_id, null as tipocampione_description,
							null as unit_tot, null as unit_chk, null as peso_tot, null as peso_chk, null as lotti_tot, null as lotti_chk, null as lotti_camp,
							null as tipologia_id, null as tipologiacontrollata_descrizione, null as provenienza
						FROM simfitolab.analisys
						LEFT JOIN simfito.campioni ON campioni.id=analisys.campioni_id
						INNER JOIN t_vista AS a ON (analisys.host=a.b_code)
						INNER JOIN t_vista AS b ON (analisys.pest=b.b_code)
						LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id=analisysresult.id
						WHERE campioni.scheda_id=$_REQUEST[idscheda] AND NOT analisys.fromsimfito
					ORDER BY idosservazioni";
					//echo $sql;
				}
			else {
				$sql="WITH abbattute AS(
						SELECT SUM(quantity) AS somma,osservazioni_id
						FROM simfito.abbattimenti
						GROUP BY osservazioni_id
					), analisi AS(
						SELECT analisys.osservazioni_id,analisysresult.description AS lobaratory_result, analisysresult.positive AS laboratory_positive
						FROM simfitolab.analisys
						INNER JOIN simfito.campioni ON analisys.campioni_id=campioni.id
						LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id=analisysresult.id
						WHERE campioni.laboratoriostato_id=6
					)
						SELECT idosservazioni, a.full_name AS ospite, b.full_name AS parassita,
							(CASE WHEN rilevato=0 THEN 'non presente' WHEN rilevato=1 THEN 'presente' ELSE 'da verificare' END) AS presente, rilevato,
							replace(replace(sospetti,E'\\r',''),E'\\n',E'\\\\n') as sospetti, $campione, campioni.codice /*,risultato*/, campioni.elementicampione, intensity.nome_intensity,
							grado_attacco.nome_grado,fase_fenologica, varieta, eta, organi, pericolosita, data_impianto, count(trappole.*) As n_trappole, appezzamento,dens_piante,
							fase_fenologica,coltura_prec, COALESCE(abbattute.somma, 0) AS n_abbattute,
							(case when n_osservate is null then 'nan' else n_osservate end),
							(case when piante_camp_vis is null then 'nan' else piante_camp_vis end),
							(case when piante_infest is null then 'nan' else piante_infest end),
							(case when sup_vis is null then 'nan' else sup_vis end),
							(case when sup_infest is null then 'nan' else sup_infest end),
							(case when completa then 'true' else 'false' end) AS completa,
							ST_AsGeoJSON(st_transform(osservazioni.the_geom,3857),15,2) AS geometry,
							intensity.id_intensity,grado_attacco.id_grado,
							lobaratory_result, laboratory_positive, tempo
						FROM simfito.osservazioni
						LEFT JOIN abbattute ON abbattute.osservazioni_id=osservazioni.idosservazioni
						LEFT JOIN simfito.campioni ON campioni.id=osservazioni.campioni_id
						INNER JOIN t_vista AS a ON (osservazioni.hostcode=a.b_code)
						INNER JOIN t_vista AS b ON (osservazioni.pestcode=b.b_code)
						INNER JOIN simfito.intensity ON (osservazioni.attacco_int=intensity.id_intensity)
						INNER JOIN simfito.grado_attacco ON (osservazioni.attacco_grado=grado_attacco.id_grado)
						LEFT JOIN simfito.trappole ON trappole.id_osservazione=osservazioni.idosservazioni
						LEFT JOIN analisi ON osservazioni.idosservazioni=analisi.osservazioni_id
						WHERE idscheda=$_REQUEST[idscheda]
						GROUP BY osservazioni.idosservazioni,a.full_name,b.full_name,rilevato,sospetti,campione,campioni.codice/*,risultato*/,campioni.elementicampione, intensity.nome_intensity,grado_attacco.nome_grado, fase_fenologica,varieta,n_osservate,eta,organi,pericolosita,data_impianto,appezzamento,dens_piante, piante_camp_vis,fase_fenologica,coltura_prec,
						piante_infest,sup_vis,sup_infest,abbattute.somma,completa, osservazioni.the_geom,intensity.id_intensity,grado_attacco.id_grado,analisi.lobaratory_result,
						laboratory_positive, tempo
						--ORDER BY osservazioni.idosservazioni
					UNION
						SELECT CAST(null AS numeric) AS idosservazioni, a.full_name AS ospite, b.full_name AS parassita,
							analisysresult.name AS presente, CAST(null AS numeric) AS rilevato,
							null As sospetti, 1 AS campione, campioni.codice /*,null AS risultato*/, campioni.elementicampione, null AS nome_intensity,
							null AS nome_grado, null AS fase_fenologica, null AS varieta, null AS eta, null AS organi, null AS pericolosita, null AS data_impianto, 0 As n_trappole,
							null AS appezzamento, null AS dens_piante, null AS fase_fenologica, null AS coltura_prec, 0 AS n_abbattute, 'nan' AS n_osservate,
							'nan' AS piante_camp_vis, 'nan' AS piante_infest, 'nan' AS sup_vis, 'nan' AS sup_infest, 'true' AS completa,
							null AS geometry, null AS id_intensity, null AS id_grado,
							analisysresult.description AS lobaratory_result, analisysresult.positive AS laboratory_positive, null as tempo
						FROM simfitolab.analisys
						LEFT JOIN simfito.campioni ON campioni.id=analisys.campioni_id
						INNER JOIN t_vista AS a ON (analisys.host=a.b_code)
						INNER JOIN t_vista AS b ON (analisys.pest=b.b_code)
						LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id=analisysresult.id
						WHERE campioni.scheda_id=$_REQUEST[idscheda] AND NOT analisys.fromsimfito
					ORDER BY idosservazioni";
				}
			readJson($sql);
		break;
		case "osservazionicatture":
			$campione=case_boolean('campione');
			$tgid = ($_REQUEST['idtrappola']!='' ? $_REQUEST['idtrappola'] : -1);
			if(true) {
				$sql="WITH abbattute AS(
						SELECT SUM(quantity) AS somma,osservazioni_id
						FROM simfito.abbattimenti
						GROUP BY osservazioni_id
					), analisi AS(
						SELECT
							analisys.osservazioni_id,
							count(*) as laboratory_total,
							sum(case analisysresult.positive when 1 then 1 else 0 end) AS laboratory_xpositive,
							sum(case analisysresult.positive when 2 then 1 else 0 end) AS laboratory_xnonappl,
							case when sum(case analisysresult.positive when 2 then 1 else 0 end)=count(*) then 2 when sum(case analisysresult.positive when 1 then 1 else 0 end)>0 then 1 else 0 end as laboratory_positive,
							case when sum(case analisysresult.positive when 2 then 1 else 0 end)=count(*) then 'Non Applicabile' when sum(case analisysresult.positive when 1 then 1 else 0 end)=0 then 'Negativo' else 'Positivo' end  AS lobaratory_result
						FROM simfitolab.analisys
						INNER JOIN simfito.campioni ON analisys.campioni_id=campioni.id
						LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id=analisysresult.id
						WHERE campioni.laboratoriostato_id=6
						GROUP BY osservazioni_id
					)
						SELECT idosservazioni, a.full_name AS ospite, b.full_name AS parassita,
							(CASE WHEN rilevato=0 THEN 'non presente' WHEN rilevato=1 THEN 'presente' ELSE 'da verificare' END) AS presente, rilevato,
							replace(replace(sospetti,E'\\r',''),E'\\n',E'\\\\n') as sospetti, $campione, campioni.codice /*,risultato*/, campioni.elementicampione, intensity.nome_intensity,
							grado_attacco.nome_grado,fase_fenologica, varieta, eta, organi, pericolosita, data_impianto, count(trappole.*) As n_trappole, appezzamento,dens_piante,
							fase_fenologica,coltura_prec, COALESCE(abbattute.somma, 0) AS n_abbattute,
							(case when n_osservate is null then 'nan' else n_osservate end),
							(case when piante_camp_vis is null then 'nan' else piante_camp_vis end),
							(case when piante_infest is null then 'nan' else piante_infest end),
							(case when sup_vis is null then 'nan' else sup_vis end),
							(case when sup_infest is null then 'nan' else sup_infest end),
							(case when completa then 'true' else 'false' end) AS completa,
							ST_AsGeoJSON(st_transform(osservazioni.the_geom,3857),15,2) AS geometry,
							intensity.id_intensity,grado_attacco.id_grado,
							lobaratory_result, laboratory_positive, tempo, campioni.tipocampione_id, tipocampione.description as tipocampione_description,
							unita as unit_tot, unita_chk as unit_chk, peso as peso_tot, peso_chk, lotti as lotti_tot, lotti_chk, lotti_camp,
							tipologiacontrollata_id as tipologia_id, tipologiacontrollata.descrizione as tipologiacontrollata_descrizione, provenienza, hostcode, pestcode,catture,case cambioferomone when true then 'true' else 'false' end as cambioferomone
						FROM simfito.osservazioni
						LEFT JOIN abbattute ON abbattute.osservazioni_id=osservazioni.idosservazioni
						LEFT JOIN simfito.campioni ON campioni.id=osservazioni.campioni_id
						LEFT JOIN t_vista AS a ON (osservazioni.hostcode=a.b_code)
						LEFT JOIN t_vista AS b ON (osservazioni.pestcode=b.b_code)
						LEFT JOIN simfito.intensity ON (osservazioni.attacco_int=intensity.id_intensity)
						LEFT JOIN simfito.grado_attacco ON (osservazioni.attacco_grado=grado_attacco.id_grado)
						LEFT JOIN simfito.trappole ON trappole.id_osservazione=osservazioni.idosservazioni
						LEFT JOIN analisi ON osservazioni.idosservazioni=analisi.osservazioni_id
						LEFT JOIN tipocampione on campioni.tipocampione_id=tipocampione.id
						LEFT JOIN tipologiacontrollata on osservazioni.tipologiacontrollata_id=tipologiacontrollata.id
						WHERE idscheda=$_REQUEST[idscheda] and osservazioni.trappole_geometry_id=$tgid
						GROUP BY osservazioni.idosservazioni,a.full_name,b.full_name,rilevato,sospetti,campione,campioni.codice/*,risultato*/,campioni.elementicampione, intensity.nome_intensity,grado_attacco.nome_grado, fase_fenologica,varieta,n_osservate,eta,organi,pericolosita,data_impianto,appezzamento,dens_piante, piante_camp_vis,fase_fenologica,coltura_prec,
						piante_infest,sup_vis,sup_infest,abbattute.somma,completa, osservazioni.the_geom,intensity.id_intensity,grado_attacco.id_grado,analisi.lobaratory_result,
						laboratory_positive, tempo, campioni.tipocampione_id, tipocampione.description,
						unita, unita_chk, peso, peso_chk, lotti, lotti_chk, lotti_camp, tipologiacontrollata_id, tipologiacontrollata.descrizione,provenienza, hostcode, pestcode,catture,cambioferomone
						--ORDER BY osservazioni.idosservazioni
					UNION
						SELECT CAST(null AS numeric) AS idosservazioni, a.full_name AS ospite, b.full_name AS parassita,
							analisysresult.name AS presente, CAST(null AS numeric) AS rilevato,
							null As sospetti, 1 AS campione, campioni.codice /*,null AS risultato*/, campioni.elementicampione, null AS nome_intensity,
							null AS nome_grado, null AS fase_fenologica, null AS varieta, null AS eta, null AS organi, null AS pericolosita, null AS data_impianto, 0 As n_trappole,
							null AS appezzamento, null AS dens_piante, null AS fase_fenologica, null AS coltura_prec, 0 AS n_abbattute, 'nan' AS n_osservate,
							'nan' AS piante_camp_vis, 'nan' AS piante_infest, 'nan' AS sup_vis, 'nan' AS sup_infest, 'true' AS completa,
							null AS geometry, null AS id_intensity, null AS id_grado,
							analisysresult.description AS lobaratory_result, analisysresult.positive AS laboratory_positive, null as tempo, null as tipocampione_id, null as tipocampione_description,
							null as unit_tot, null as unit_chk, null as peso_tot, null as peso_chk, null as lotti_tot, null as lotti_chk, null as lotti_camp,
							null as tipologia_id, null as tipologiacontrollata_descrizione, null as provenienza, null as hostcode, null as pestcode,null as catture,null as cambioferomone
						FROM simfitolab.analisys
						LEFT JOIN simfito.campioni ON campioni.id=analisys.campioni_id
						INNER JOIN t_vista AS a ON (analisys.host=a.b_code)
						INNER JOIN t_vista AS b ON (analisys.pest=b.b_code)
						LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id=analisysresult.id
						WHERE campioni.scheda_id=$_REQUEST[idscheda] AND NOT analisys.fromsimfito
					ORDER BY idosservazioni";
					//echo $sql;
					//exit(0);
			}
			readJson($sql);
		break;
		case "tipologiasito":
				if(isset($_REQUEST["theme"])){
					$sql="SELECT * FROM tipologiasito WHERE theme_id=$_REQUEST[theme] AND enabled ORDER BY \"order\"";
				}
				else{
					$sql="SELECT * FROM tipologiasito AND enabled ORDER BY \"order\"";
				}
				readJson($sql);
		break;
		case "tipologiasito1":
				if(isset($_REQUEST["theme"])){
					$theme=$_REQUEST["theme"];
					if($_REQUEST["theme"]=='0'){
						$sql="SELECT * FROM tipologiasito WHERE theme_id is null ORDER BY \"order\"";
					}
					else{
						$sql="SELECT * FROM tipologiasito WHERE theme_id=$theme ORDER BY \"order\"";
					}
				}
				else{
					$sql="SELECT * FROM tipologiasito ORDER BY \"order\"";
				}
				readJson($sql);
		break;
		case "tipocampione":
			$sql="SELECT id AS tipocampione_id, CASE WHEN extra IS not null THEN description||' '||extra ELSE description END AS tipocampione_description
				FROM tipocampione
				WHERE enabled
				ORDER BY id";
			readJson($sql);
		break;
		case "tipologiecontrollate":
			$sql="SELECT id, descrizione FROM simfito.tipologiacontrollata WHERE descrizione ilike '%$_REQUEST[query]%' ORDER BY ordinamento";
			readJson($sql);
		break;
		case "paeseprovenienza":
			$sql="SELECT id_stati as id, nome_stati as descrizione FROM simfito.stati WHERE nome_stati ilike '%$_REQUEST[query]%' ORDER BY nome_stati";
			readJson($sql);
		break;
		case "tipocampioniall":
			$sql="SELECT id, description, extra, CASE WHEN enabled THEN 'true' ELSE 'false' END AS enabled, CASE WHEN system THEN 'true' ELSE 'false' END AS \"system\"
				FROM simfito.tipocampione
				ORDER BY enabled desc, \"system\" desc, id ";
			readJson($sql);
		break;
		case "osservazioneanalisi":
			$oid = $_REQUEST['idosservazione'];
			$sql = "SELECT analisys.id,elementindex,analisysresult.name,analisysresult.description,analisysresult.positive
					FROM simfitolab.analisys
					INNER JOIN  simfitolab.samples on analisys.samples_id=samples.id
					INNER JOIN simfito.campioni ON analisys.campioni_id=campioni.id
					LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id=analisysresult.id
					WHERE analisys.osservazioni_id=$oid and campioni.laboratoriostato_id=6
					ORDER BY elementindex";
			readJson($sql);
		break;
		case "pest_report":
			$campione=case_boolean('campione');
			$sql="SELECT id,pest as parassita,host as ospite
				FROM ordinari
				WHERE idscheda=$_REQUEST[idscheda] AND nuovo AND not validato";
			readJson($sql);
		break;
		case "motivoVisita":
			$sql="SELECT idtipo_visita as id, motivo FROM tipo_visita WHERE enabled ORDER BY motivo"; // WAS: ordine";
			readJson($sql);
		break;
		case "motivoVisitaAll":
			$sql="SELECT idtipo_visita as id, motivo, case when enabled then 'true' else 'false' end as enabled FROM tipo_visita ORDER BY motivo"; // WAS: ordine";
			readJson($sql);
		break;
		case "ultimaScheda":
			$sql="SELECT MAX(idschedatecnico) as numeroscheda FROM scheda WHERE id_tecnico=$_REQUEST[idTecnico]";
			readJson($sql);
		break;
		case "comuni":
			if (isset($_REQUEST['query'])){
				$ser=pg_escape_string($_REQUEST['query']);
				$where="nome ilike '%$ser%'";
			} else {
				$where="1=1";
			}
			if (isset($_REQUEST['provincia'])&&($_REQUEST['provincia']!='')){
				$sql="SELECT istat,nome,provincia FROM comuni WHERE $where AND provincia='$_REQUEST[provincia]' ORDER BY nome";
			} else {
				$sql="SELECT istat,nome,provincia FROM comuni WHERE $where ORDER BY istat";
			}
			readJson($sql);
		break;
		case "province":
			if (isset($_REQUEST['query']))
				$sql="SELECT prvistat as id, provincia FROM comuni WHERE provincia ilike '%$_REQUEST[query]%' GROUP BY prvistat, provincia ORDER BY provincia";
			else
				$sql="SELECT prvistat as id, provincia FROM comuni GROUP BY prvistat, provincia ORDER BY provincia";
			readJson($sql);
		break;
		case "bounds":
			$geometria="st_transform(the_geom,3857)";
			$where='';
			if(isset($_REQUEST['idfield'])){
				$where="WHERE \"$_REQUEST[idfield]\"='$_REQUEST[id]'";
			}
			//$sql="SELECT st_xmin($geometria) as xmin,st_ymin($geometria) as ymin,st_xmax($geometria) as xmax,st_ymax($geometria)as ymax FROM \"$_REQUEST[shp]\" $where GROUP BY the_geom";
			$sql=" WITH tmp AS(
					SELECT st_xmin($geometria) as xmin,st_ymin($geometria) as ymin,st_xmax($geometria) as xmax,st_ymax($geometria)as ymax
					FROM \"$_REQUEST[shp]\" $where
				)
				SELECT min(xmin) as xmin, min(ymin) as ymin, max(xmax) as xmax, max(ymax) as ymax
				FROM tmp";
			readJson($sql);
		break;
		case "bounds2":
			$geometria="st_transform(the_geom,3857)";
			$where='';
			if(isset($_REQUEST['idfield'])){
				$where="WHERE \"$_REQUEST[idfield]\"='$_REQUEST[id]'";
			}
			//$sql="SELECT st_xmin($geometria) as xmin,st_ymin($geometria) as ymin,st_xmax($geometria) as xmax,st_ymax($geometria)as ymax FROM \"$_REQUEST[shp]\" $where GROUP BY the_geom";
			$sql=" WITH tmp AS(
					SELECT st_xmin($geometria) as xmin,st_ymin($geometria) as ymin,st_xmax($geometria) as xmax,st_ymax($geometria)as ymax, superficie_ha
					FROM \"$_REQUEST[shp]\" $where
				)
				SELECT min(xmin) as xmin, min(ymin) as ymin, max(xmax) as xmax, max(ymax) as ymax, min(superficie_ha) as superficie
				FROM tmp";
			readJson($sql);
		break;
		case "scheda":
			$sql= "SELECT * FROM simfito.scheda WHERE idscheda=$_REQUEST[schedaid]";
			readJson($sql);	
		break;
		case "organisms":
			$sql="SELECT t_bayname.codeid AS codeid, t_bayname.full_name AS name, ita_name.full_name AS it_name, t_state.statname AS region,
					t_occurstatus.labelstatus AS situation, t_data_types.dt_name AS type, t_eppocodeinfos.hosts AS hosts,
					t_eppocodeinfos.pests AS pests
				FROM t_bayname
				LEFT JOIN t_occur ON t_bayname.codeid=t_occur.codeid
				LEFT JOIN t_state ON t_occur.idstate=t_state.idstate
				INNER JOIN t_baycode ON t_bayname.codeid=t_baycode.codeid
				INNER JOIN t_data_types ON t_data_types.dt_code=t_baycode.dt_code
				INNER JOIN t_occurstatus ON t_occurstatus.idstatus=t_occur.master
				INNER JOIN t_eppocodeinfos ON t_bayname.codeid=t_eppocodeinfos.codeid
				LEFT JOIN ita_name ON t_bayname.codeid=ita_name.codeid
				WHERE t_occur.isocode='IT' AND t_bayname.preferred=1
				ORDER by t_bayname.full_name, statname";
			readJson($sql);
		break;
		case "regulated":
			$sql="SELECT t_bayname.codeid AS codeid, t_qlist.qlistlabel AS reg, t_bayname.full_name AS name, ita_name.full_name AS it_name,
				r_concern.yr_add AS yr, r_concern.yr_trans AS yrtr, r_concern.yr_del AS yrdel, t_data_types.dt_name AS type
			FROM t_bayname
			INNER JOIN t_baycode ON t_bayname.codeid=t_baycode.codeid
			INNER JOIN r_concern ON r_concern.codeid=t_baycode.codeid
			INNER JOIN t_qlist ON r_concern.qlist=t_qlist.qlist
			INNER JOIN t_data_types ON t_data_types.dt_code=t_baycode.dt_code
			LEFT JOIN ita_name ON t_bayname.codeid=ita_name.codeid
			WHERE (r_concern.qlist='3' OR r_concern.qlist='4' OR r_concern.qlist='5'
				OR r_concern.qlist='6' OR r_concern.qlist='7' OR r_concern.qlist='8')
			AND t_bayname.preferred=1
			ORDER BY qlistlabel, t_bayname.full_name";
			readJson($sql);
		break;
		case "hosts":
			$sql="SELECT t_baycode.codeid, n1.full_name AS pest_name,
					r_attack.codeidhost as id_host, n2.full_name AS host_name, t_hostclass.labelclass AS class
				FROM t_baycode
				INNER JOIN t_bayname AS n1 ON (t_baycode.codeid = n1.codeid)
				INNER JOIN r_attack ON (n1.codeid = r_attack.codeid)
				INNER JOIN t_bayname AS n2  ON (r_attack.codeidhost = n2.codeid)
				INNER JOIN t_hostclass ON (r_attack.idclass = t_hostclass.idclass)
				WHERE n1.preferred = 1 AND n2.preferred = 1 AND n1.codeid = $_REQUEST[id]
				ORDER BY t_hostclass.idclass ASC, n2.full_name ASC";
			readJson($sql);
		break;
		case "host_comodities":
			$sql=" SELECT t_baycode.codeid, n1.full_name AS pest_name, r_path.codeidhost as id_host,
					n2.full_name AS host_name, r_path.commodcode, t_commodity.commodname
				FROM t_baycode
				INNER JOIN t_bayname AS n1 ON(t_baycode.codeid = n1.codeid)
				INNER JOIN r_path ON(n1.codeid = r_path.codeid)
				INNER JOIN t_bayname AS n2 ON(r_path.codeidhost = n2.codeid)
				INNER JOIN t_commodity ON(r_path.commodcode = t_commodity.commodcode)
				WHERE n1.preferred = 1 AND n2.preferred = 1 AND n1.codeid = 55557
				ORDER BY t_commodity.commodcode ASC, n2.full_name ASC";
			readJson($sql);
		break;
		case "pests":
			$db2=new CRUD($connection);
			//pestsJson($_REQUEST['id']);
			pestsJson($_REQUEST['codeid']);
			$db2->connection_close();
		break;
		case "ordPests":
			$sql="SELECT t_bayname.nameid ,t_bayname.codeid as pest_id, full_name AS pest_name, b_code as baycode_pest, dt_code, pest_priority.priority
				FROM ordinari
				inner join t_baycode on t_baycode.b_code=pest
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				LEFT JOIN simfito.pest_priority ON pest_priority.baycode=t_baycode.b_code
				WHERE host='$_REQUEST[bcode]' AND(isolang='la' OR isolang='it') AND validato
				group by t_bayname.nameid ,t_bayname.codeid, full_name, b_code, dt_code, pest_priority.priority
				ORDER BY t_bayname.full_name";
			readJson($sql);
		break;
		case "rndPests":
			$sql="SELECT t_bayname.nameid ,t_bayname.codeid as pest_id, full_name AS pest_name, b_code as baycode_pest, dt_code, pest_priority.priority
				FROM rendicontati
				inner join t_baycode on t_baycode.b_code=pest
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				LEFT JOIN simfito.pest_priority ON pest_priority.baycode=t_baycode.b_code
				WHERE host='$_REQUEST[bcode]' AND isolang='la' AND preferred=1 AND enabled
				group by t_bayname.nameid ,t_bayname.codeid, full_name, b_code, dt_code, pest_priority.priority
				ORDER BY t_bayname.full_name";
			readJson($sql);
		break;
		case "plant":
			$query=pg_escape_string($_REQUEST['query']);
			if ($query=="") $s="AND full_name ILIKE 'a%'";
			else $s="AND full_name ILIKE '%$query%'";
			$sql="SELECT t_bayname.nameid ,t_bayname.codeid, full_name AS name, b_code, dt_code
				FROM t_bayname
				INNER JOIN t_baycode ON t_bayname.codeid=t_baycode.codeid
				WHERE dt_code='PFL' AND (isolang='la' OR isolang='it') $s
				ORDER BY t_bayname.full_name";//AND t_bayname.preferred=1
			readJson($sql);
		break;
		case "host_ord":
			$query=pg_escape_string($_REQUEST['query']);
			if ($query=="") $s="AND full_name ILIKE 'a%'";
			else $s="AND full_name ILIKE '%$query%'";
			$sql="SELECT t_bayname.nameid ,t_bayname.codeid, full_name AS name, b_code, dt_code
				FROM ordinari
				inner join t_baycode on t_baycode.b_code=host
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				WHERE (isolang='la' OR isolang='it') AND validato $s
				group by t_bayname.nameid ,t_bayname.codeid, full_name, b_code, dt_code
				ORDER BY t_bayname.full_name";
			readJson($sql);
		break;
		case "host_rend":
			$query=pg_escape_string($_REQUEST['query']);
			if ($query=="") $s="AND full_name ILIKE 'a%'";
			else $s="AND full_name ILIKE '%$query%'";
			$sql="SELECT t_bayname.nameid ,t_bayname.codeid, full_name AS name, b_code, dt_code
				FROM rendicontati
				inner join t_baycode on t_baycode.b_code=host
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				WHERE (isolang='la' OR isolang='it') AND preferred=1 AND enabled $s
				group by t_bayname.nameid ,t_bayname.codeid, full_name, b_code, dt_code
				ORDER BY t_bayname.full_name";
			readJson($sql);
		break;
		case "pest_host":
			$query=pg_escape_string($_REQUEST['query']);
			if ($query=="") $s="";
			else $s="AND full_name ILIKE '%$query%'";
				$sql="SELECT distinct osservazioni.hostcode, full_name AS name
					FROM simfito.osservazioni
					INNER JOIN eppo.t_baycode on t_baycode.b_code=osservazioni.hostcode
					INNER JOIN eppo.t_bayname ON t_bayname.codeid=t_baycode.codeid
					WHERE isolang='la' AND preferred=1 AND pestcode='$_REQUEST[pestcode]' $s";
				readJson($sql);
		break;
		case "allorg":
			$query=pg_escape_string($_REQUEST['query']);
			if ($query=="") $s="AND full_name ILIKE 'a%'";
			else $s="AND full_name ILIKE '$query%'";
			$sql="SELECT t_bayname.nameid ,t_bayname.codeid, full_name AS name, b_code, dt_code
				FROM t_bayname
				INNER JOIN t_baycode ON t_bayname.codeid=t_baycode.codeid
				WHERE (isolang='la' OR isolang='it') $s
				ORDER BY t_bayname.full_name";//AND t_bayname.preferred=1
			readJson($sql);
		break;
		case "parassiti":
			$sql="SELECT DISTINCT pestcode, t_bayname.full_name AS name, count(pestcode) AS totale
				FROM osservazioni
				INNER JOIN t_baycode ON t_baycode.b_code=pestcode
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				WHERE osservazioni.stato=2 AND t_bayname.preferred=1 AND osservazioni.rilevato=1
				GROUP BY pestcode,t_bayname.full_name";
			readJson($sql);
		break;
		case 'parassitinew':
			$sql="SELECT DISTINCT pestcode, t_bayname.full_name AS name, count(pestcode) AS totale, min(data_sopralluogo) AS start,
					max(data_sopralluogo) AS \"end\"
				FROM osservazioni
				INNER JOIN t_baycode ON t_baycode.b_code=pestcode
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda
				WHERE osservazioni.stato=2 AND t_bayname.preferred=1 AND t_bayname.full_name ilike '%$_REQUEST[query]%'
				GROUP BY pestcode,t_bayname.full_name";
			readJson($sql);
		break;
		case 'parassititrappole':
			$sql="SELECT DISTINCT organismo AS pestcode, t_bayname.full_name AS name, count(organismo) AS totale, min(datacreazione) AS start,
					max(datacreazione) AS \"end\"
				FROM simfito.trappole_geometry
				INNER JOIN eppo.t_baycode ON t_baycode.b_code=organismo
				INNER JOIN eppo.t_bayname ON t_bayname.codeid=t_baycode.codeid
				--INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda
				WHERE /*osservazioni.stato=2 AND */t_bayname.preferred=1 AND t_bayname.full_name ilike '%$_REQUEST[query]%'
				GROUP BY organismo,t_bayname.full_name";
			readJson($sql);		
		break;
		case 'parassitinewpositivi':
			$sql="SELECT DISTINCT pestcode, t_bayname.full_name AS name, count(pestcode) AS totale, min(data_sopralluogo) AS start,
					max(data_sopralluogo) AS \"end\"
				FROM osservazioni
				INNER JOIN t_baycode ON t_baycode.b_code=pestcode
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda
				LEFT JOIN simfitolab.analisys ON osservazioni.idosservazioni = analisys.osservazioni_id
             	LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id = analisysresult.id
				WHERE osservazioni.stato=2 AND t_bayname.preferred=1 AND t_bayname.full_name ilike '%$_REQUEST[query]%'
					AND (
							((osservazioni.campioni_id = (-1) OR osservazioni.campioni_id IS NULL) AND osservazioni.rilevato = 1)
							OR
							(osservazioni.campioni_id <> (-1) AND analisysresult.positive = 1)
						)
				GROUP BY pestcode,t_bayname.full_name";
			readJson($sql);
		break;
		case "parassitiAll":
			$sql="SELECT DISTINCT pestcode, t_bayname.full_name AS name, count(pestcode) AS totale
				FROM osservazioni
				INNER JOIN t_baycode ON t_baycode.b_code=pestcode
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				WHERE osservazioni.stato=2 AND t_bayname.preferred=1 AND osservazioni.rilevato>=0
				GROUP BY pestcode,t_bayname.full_name";
			readJson($sql);
		break;
		case "ospiti":
			$and="";
			if(isset($_REQUEST['pestcode'])&&($_REQUEST['pestcode']!='')&&($_REQUEST['pestcode']!='null')){
				$and="AND osservazioni.pestcode='$_REQUEST[pestcode]'";
			}
			if(isset($_REQUEST['provincia'])&&($_REQUEST['provincia']!='')&&($_REQUEST['provincia']!='null')){
				$and.="AND comuni.provincia='$_REQUEST[provincia]' ";
			}
			if(isset($_REQUEST['cistat'])&&($_REQUEST['cistat']!='')&&($_REQUEST['cistat']!='null')){
				$and.="AND comuni.istat='$_REQUEST[cistat]' ";
			}
			if(isset($_REQUEST['query'])&&($_REQUEST['query']!='')&&($_REQUEST['query']!='null')){
				$ser=pg_escape_string($_REQUEST['query']);
				$and.="AND t_bayname.full_name ilike '%$ser%' ";
			}
			$sql="SELECT DISTINCT hostcode, t_bayname.full_name AS name
				FROM osservazioni
				INNER JOIN simfito.scheda ON scheda.idscheda=osservazioni.idscheda
				INNER JOIN simfito.siti ON siti.gid=scheda.gid_sito
				INNER JOIN comuni ON comuni.istat=siti.comune_istat
				INNER JOIN t_baycode ON t_baycode.b_code=hostcode
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				WHERE osservazioni.stato=2 AND t_bayname.preferred=1 $and";
			readJson($sql);
		break;
		case "parassiticontrollati":
			$and="";
			if(isset($_REQUEST['hostcode'])&&($_REQUEST['hostcode']!='')&&($_REQUEST['hostcode']!='null')){
				$and="AND osservazioni.hostcode='$_REQUEST[hostcode]' ";
			}
			if(isset($_REQUEST['provincia'])&&($_REQUEST['provincia']!='')&&($_REQUEST['provincia']!='null')){
				$and.="AND comuni.provincia='$_REQUEST[provincia]' ";
			}
			if(isset($_REQUEST['cistat'])&&($_REQUEST['cistat']!='')&&($_REQUEST['cistat']!='null')){
				$and.="AND comuni.istat='$_REQUEST[cistat]' ";
			}
			if(isset($_REQUEST['query'])&&($_REQUEST['query']!='')&&($_REQUEST['query']!='null')){
				$ser=pg_escape_string($_REQUEST['query']);
				$and.="AND t_bayname.full_name ilike '%$ser%' ";
			}

			$sql="SELECT DISTINCT pestcode, t_bayname.full_name AS name
				FROM osservazioni
				INNER JOIN simfito.scheda ON scheda.idscheda=osservazioni.idscheda
				INNER JOIN simfito.siti ON siti.gid=scheda.gid_sito
				INNER JOIN comuni ON comuni.istat=siti.comune_istat
				INNER JOIN t_baycode ON t_baycode.b_code=pestcode
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				WHERE osservazioni.stato=2 AND t_bayname.preferred=1 $and";
			//echo $sql;
			readJson($sql);
		break;
		case "periodo_disponibile":
			readJson("SELECT MIN(data_sopralluogo) AS first_date, MAX(data_sopralluogo) AS last_date FROM simfito.scheda WHERE stato=2 AND data_sopralluogo >='2012-01-01'");
		break;
		case "multibuffer":
			header("content-type: text/plain");

			if($_REQUEST['prv']!='null')
				$where=" AND comuni.prvistat=$_REQUEST[prv]";
			else
				$where="";

			switch($_REQUEST['type']){
				case "pest":
					$AS0="AS bcode_parassita";
					$code2="hostcode";
					$AScode2="AS bcode_ospite";
					$AS1="AS nome_parassita";
					$type=$_REQUEST['type'];
					$and="";
				break;
				case "host":
					$AS0="AS bcode_ospite";
					$code2="pestcode";
					$AScode2="AS bcode_parassita";
					$AS1="AS nome_ospite";
					$type=$_REQUEST['type'];
					$and="";
				break;
				case "perArea":
					$type='pest';
					$code2="hostcode";
					$and="AND osservazioni.hostcode='$_REQUEST[hcode]'";
				break;
			}

			$sql0="SELECT
						'Infestata' AS zona,
						st_asgeojson(
							st_union(
								st_transform(
									ST_Buffer(st_transform(siti.the_geom,32633),$_REQUEST[buffer0]),4326
								)
							)
						) AS geometry
					FROM osservazioni
					INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
					INNER JOIN siti ON scheda.gid_sito=siti.gid AND scheda.stato=2
					INNER JOIN comuni ON siti.comune_istat=comuni.istat $where
					INNER JOIN t_baycode ON t_baycode.b_code=$code2
					INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
					WHERE
						osservazioni.$type"."code='$_REQUEST[code]' AND t_bayname.preferred=1 and osservazioni.rilevato=1 $and
					GROUP BY zona";

			$sql1="SELECT
						'Contenimento' AS zona,
						st_asgeojson(
							st_difference(
								st_union(
									st_transform(
										ST_Buffer(st_transform(siti.the_geom,32633),$_REQUEST[buffer1]),4326
									)
								),st_union(
									st_transform(
										ST_Buffer(st_transform(siti.the_geom,32633),$_REQUEST[buffer0]),4326
									)
								)
							)
						) as geometry
					FROM osservazioni
					INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
					INNER JOIN siti ON scheda.gid_sito=siti.gid AND scheda.stato=2
					INNER JOIN comuni ON siti.comune_istat=comuni.istat $where
					INNER JOIN t_baycode ON t_baycode.b_code=$code2
					INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
					WHERE
						osservazioni.$type"."code='$_REQUEST[code]' AND t_bayname.preferred=1 and osservazioni.rilevato=1 $and
					GROUP BY zona";

			$sql2="SELECT
						'Tampone' AS zona,
						st_asgeojson(
							st_difference(
								st_union(
									st_transform(
										ST_Buffer(st_transform(siti.the_geom,32633),$_REQUEST[buffer2]),4326
									)
								),st_union(
									st_transform(
										ST_Buffer(st_transform(siti.the_geom,32633),$_REQUEST[buffer1]),4326
									)
								)
							)
						) as geometry
					FROM osservazioni
					INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
					INNER JOIN siti ON scheda.gid_sito=siti.gid AND scheda.stato=2
					INNER JOIN comuni ON siti.comune_istat=comuni.istat $where
					INNER JOIN t_baycode ON t_baycode.b_code=$code2
					INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
					WHERE
						osservazioni.$type"."code='$_REQUEST[code]' AND t_bayname.preferred=1 and osservazioni.rilevato=1 $and
					GROUP BY zona";

			$sql="$sql0 union $sql1 union $sql2";
			if($_REQUEST['download']){
					header('Pragma: public');
					header('Expires: 0');
					header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
					header('Content-Type: application/force-download');
					//header('Content-Type: application/octet-stream');
					header('Content-Type: application/download');;
					header("Content-Disposition: attachment;filename=export.geoJson");
					header('Content-Transfer-Encoding: binary ');
			}
			echo psg2gjsonA($sql);
		break;
		case "monitorati":
			header("content-type: text/plain");

	        if($_REQUEST['prv']!='null')
				$where=" AND comuni.prvistat=$_REQUEST[prv]";
			else
				$where="";
			$AS0="AS bcode_parassita";
			$code2="hostcode";
			$AScode2="AS bcode_ospite";
			$AS1="AS nome_parassita";
			$tipo="pest";

			$sql="$with SELECT scheda.idscheda,
					n_osservate AS piante_monitorate,
					piante_camp_vis AS piante_campionate_visivamente,
				    piante_infest AS piante_infestate,
				    n_abbattute AS piante_abbattute,
				    cast(sup_vis/10000 AS numeric(9,1)) as superfici_monitorata_visivamente_ha,
				    cast(sup_infest/10000 AS numeric(9,1)) as superfici_infestata_ha,
					$tipo"."code $AS0,
					$code2"." $AScode2,
					t_bayname.full_name $AS1,
					cast(siti.superficie_ha/10000 AS numeric(7,1)) AS superficie_monitorata_ha,
					comuni.nome AS comune,
					comuni.provincia AS provincia,
					CASE WHEN osservazioni.rilevato=1 THEN 'si' ELSE 'no' END AS rilevato,
					cast(st_x(st_transform(siti.the_geom,32633)) as numeric(15,2)) as lon,
					cast(st_y(st_transform(siti.the_geom,32633)) as numeric (15,2)) as lat,
	                st_asgeojson(
	                    st_transform(
	                        siti.the_geom,4326
	                    )
	                ) AS geometry
	            FROM $from2 osservazioni
	            INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
				INNER JOIN siti ON scheda.gid_sito=siti.gid AND scheda.stato=2
				INNER JOIN comuni ON siti.comune_istat=comuni.istat $where
				INNER JOIN t_baycode ON t_baycode.b_code=$tipo"."code
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				WHERE
					osservazioni.$tipo"."code='$_REQUEST[code]' AND t_bayname.preferred=1";

			if($_REQUEST['export']=='xls')
				specialXls('export',$sql);
			else {
				if($_REQUEST['download']){
					header('Pragma: public');
					header('Expires: 0');
					header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
					header('Content-Type: application/force-download');
					//header('Content-Type: application/octet-stream');
					header('Content-Type: application/download');;
					header("Content-Disposition: attachment;filename=export.geoJson");
					header('Content-Transfer-Encoding: binary ');
				}
				echo psg2gjsonA($sql);
			}
		break;
		case "nobuffer":
	        header("content-type: text/plain");

	        if($_REQUEST['prv']!='null')
				$where=" AND comuni.prvistat=$_REQUEST[prv]";
			else
				$where="";
			$from2=$with=$where2="";
			switch($_REQUEST['type']){
				case "pest":
					$AS0="AS bcode_parassita";
					$code2="hostcode";
					$AScode2="AS bcode_ospite";
					$AS1="AS nome_parassita";
					$tipo="pest";
				break;
				case "host":
					$AS0="AS bcode_ospite";
					$code2="pestcode";
					$AScode2="AS bcode_parassita";
					$AS1="AS nome_ospite";
					$tipo="host";
				break;
				case "perArea":
					$AS0="AS bcode_ospite";
					$code2="pestcode";
					$AScode2="AS bcode_parassita";
					$AS1="AS nome_ospite";
					$tipo="host";
					$with="WITH infestata AS(
						SELECT st_union(
								st_transform(
									ST_Buffer(st_transform(siti.the_geom,32633),$_REQUEST[buffer]),4326
								)
							)
						AS geometry
						FROM osservazioni
						INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
						INNER JOIN siti ON scheda.gid_sito=siti.gid AND scheda.stato=2
						INNER JOIN comuni ON siti.comune_istat=comuni.istat $where
						INNER JOIN t_baycode ON t_baycode.b_code=hostcode
						INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
						WHERE
							osservazioni.pestcode='$_REQUEST[pcode]' AND t_bayname.preferred=1 and osservazioni.rilevato=1
					)";
					$where2="AND st_intersects(infestata.geometry,siti.the_geom)";
					$from2='infestata,';
				break;
			}

			$sql="$with SELECT
					scheda.idscheda,
					n_osservate AS piante_monitorate,
					piante_camp_vis AS piante_campionate_visivamente,
				    piante_infest AS piante_infestate,
				    n_abbattute AS piante_abbattute,
				    cast(sup_vis/10000 AS numeric(9,1)) as superfici_monitorata_visivamente_ha,
				    cast(sup_infest/10000 AS numeric(9,1)) as superfici_infestata_ha,
					$tipo"."code $AS0,
					$code2"." $AScode2,
					t_bayname.full_name $AS1,
					cast(siti.superficie_ha/10000 AS numeric(7,1)) AS superficie_monitorata_ha,
					comuni.nome AS comune,
					comuni.provincia AS provincia,
					'Rilevazione' AS zona,
					cast(st_x(st_transform(siti.the_geom,32633)) as numeric(15,2)) as lon,
					cast(st_y(st_transform(siti.the_geom,32633)) as numeric (15,2)) as lat,
	                st_asgeojson(
	                    st_transform(
	                        siti.the_geom,4326
	                    )
	                ) AS geometry
	            FROM $from2 osservazioni
	            INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
				INNER JOIN siti ON scheda.gid_sito=siti.gid AND scheda.stato=2
				INNER JOIN comuni ON siti.comune_istat=comuni.istat $where
				INNER JOIN t_baycode ON t_baycode.b_code=$tipo"."code
				INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
				WHERE
					osservazioni.$tipo"."code='$_REQUEST[code]' AND t_bayname.preferred=1 and osservazioni.rilevato=1 $where2";

			if($_REQUEST['export']=='xls')
				specialXls('export',$sql);
			else {
				if($_REQUEST['download']){
					header('Pragma: public');
					header('Expires: 0');
					header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
					header('Content-Type: application/force-download');
					//header('Content-Type: application/octet-stream');
					header('Content-Type: application/download');;
					header("Content-Disposition: attachment;filename=export.geoJson");
					header('Content-Transfer-Encoding: binary ');
				}
				echo psg2gjsonA($sql);
			}
	  	break;
		case "users":
			if($_REQUEST['prv']!='')
				$where="WHERE tecnici.idtipo_tecnico>1 AND NOT cancellato";// AND id_provincia='$_REQUEST[prv]'";
			else
				$where="WHERE NOT cancellato";
			$sql="SELECT id_tecnico, tipo_tecnico.tipotecnico, tecnici.idtipo_tecnico, cognome, nome, username, email, ufficio, codicefiscale, data_inizio_att,
					data_nascita, sesso, comune_nascita, provincia_nascita, titolo, cap_ufficio, id_provincia, province.sigla, sesso, pswrd, residenza_comune,
					residenza_indirizzo,telefono,mobile,web,CASE WHEN validated THEN 'true' ELSE 'false' END AS validated
				FROM tecnici
				INNER JOIN tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
				LEFT JOIN province ON tecnici.id_provincia=province.id
				$where
				ORDER BY validated,tecnici.idtipo_tecnico, cognome";
			if($_REQUEST['xls']=='true'){
				xml('Lista Tecnici',$sql);
			}else{
				$risultato=json_decode($db->ReadTableAsJson($sql));
				$sql2="SELECT count(*) as nuovi
					FROM tecnici
					INNER JOIN tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
					LEFT JOIN province ON tecnici.id_provincia=province.id
					$where and not validated";

					$nuovi=$db->fetchrow($sql2);
					$risultato->nuovi=$nuovi["nuovi"];
					//var_dump($nuovi);
					//var_dump($risultato);
					//readJson($sql,$extra);
					echo json_encode($risultato);;
				//readJson($sql);
			}
		break;
		case "usersformail":
			$sql="SELECT id_tecnico, tipo_tecnico.tipotecnico, tecnici.idtipo_tecnico, cognome, nome, cognome||' '||nome AS cognomeenome, email
				  FROM tecnici
				  INNER JOIN tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
				  WHERE tecnici.idtipo_tecnico>1
				  ORDER BY cognome";
			readJson($sql);
		break;
		case "user":
			$sql="SELECT id_tecnico, tipo_tecnico.tipotecnico, tecnici.idtipo_tecnico, cognome, nome, username, email, ufficio, codicefiscale, data_inizio_att,
					data_nascita, sesso, comune_nascita, provincia_nascita, titolo, cap_ufficio, id_provincia, province.sigla, sesso, pswrd, residenza_comune,
					residenza_indirizzo,telefono,mobile,web
				FROM tecnici
				INNER JOIN tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
				LEFT JOIN province ON tecnici.id_provincia=province.id
				WHERE id_tecnico=$_REQUEST[id] AND NOT cancellato";
			readJson($sql);
		break;
		case "associatecnico":
			$where='tecnici.idtipo_tecnico >= 2 AND NOT cancellato';
			if($_REQUEST['query']==null || $_REQUEST['query']==''){

			}
			else{
				$where.=" and nome||' '||cognome ilike '%$_REQUEST[query]%'";
			}
			$sql="SELECT id_tecnico, upper(nome||' '||cognome) AS nome, tipo_tecnico.tipotecnico, tecnici.idtipo_tecnico, codicefiscale, ufficio, email
				FROM tecnici
				INNER JOIN tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
				LEFT JOIN province ON tecnici.id_provincia=province.id
				WHERE $where
				ORDER BY nome";
			readJson($sql);
		break;
		case "rimuovitecnico":
			$sql="SELECT tecnici.id_tecnico, upper(nome||' '||cognome) AS nome, tipo_tecnico.tipotecnico, tecnici.idtipo_tecnico, codicefiscale, ufficio, email
				FROM tecnici
				INNER JOIN tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
				LEFT JOIN schede_tecnici ON tecnici.id_tecnico=schede_tecnici.id_tecnico
				LEFT JOIN province ON tecnici.id_provincia=province.id
				WHERE tecnici.idtipo_tecnico >= 2 AND NOT cancellato AND schede_tecnici.idscheda=$_REQUEST[idscheda]
				ORDER BY nome";
			readJson($sql);
		break;
		case "tipotecnico":
			$sql="SELECT idtipo_tecnico, tipotecnico
				FROM tipo_tecnico
				ORDER BY idtipo_tecnico";
			readJson($sql);
		break;
		case "tipotecnico1":
			$sql="	SELECT idtipo_tecnico, tipotecnico
					FROM simfito.tipo_tecnico
				UNION
					SELECT -1 AS idtipo_tecnico, 'Tutti' AS tipotecnico
				UNION
					SELECt -2 AS idtipo_tecnico, 'Selezionati' AS tipotecnico
				ORDER BY idtipo_tecnico";
			readJson($sql);
		break;
		case "idprovince":
			$sql="SELECT id, sigla, denominazione
				FROM province
				ORDER BY sigla";
			readJson($sql);
		break;
		case "allegati":
			$path="$att_path$_REQUEST[idscheda]/";
			readDirAsJson($path);
		break;
		case "codici":
			$sql="SELECT DISTINCT campionecode, cast(substring(campionecode from 'C([0-9]{0,})') as numeric) as endcode
				FROM osservazioni
				INNER JOIN scheda ON osservazioni.idscheda=scheda.idscheda
				INNER JOIN tecnici ON tecnici.id_tecnico=scheda.id_tecnico
				WHERE tecnici.id_tecnico=$_REQUEST[idtecnico] AND campionecode<>''
				ORDER BY endcode desc";
			readJson($sql);
		break;
		case "codici_new":
			/*$sql="WITH A AS (
					SELECT tecnici.id_tecnico AS tecnico, MAX(cast(substring(codice from 'C([0-9]{0,})') as numeric)) as endcode, 'false' AS nuovo
					FROM simfito.osservazioni
					INNER JOIN simfito.scheda ON osservazioni.idscheda=scheda.idscheda
					INNER JOIN simfito.tecnici ON tecnici.id_tecnico=scheda.id_tecnico
					INNER JOIN simfito.campioni ON osservazioni.campioni_id=campioni.id
					WHERE tecnici.id_tecnico=$_REQUEST[idtecnico]
					GROUP BY tecnici.id_tecnico
				)
				(
					SELECT id, codice, cast(substring(codice from 'C([0-9]{0,})') as numeric) AS endcode, codice||' in uso' AS descrizione, 'false' AS nuovo
					FROM simfito.osservazioni
					INNER JOIN simfito.scheda ON osservazioni.idscheda=scheda.idscheda
					INNER JOIN simfito.tecnici ON tecnici.id_tecnico=scheda.id_tecnico
					INNER JOIN simfito.campioni ON osservazioni.campioni_id=campioni.id
					WHERE tecnici.id_tecnico=$_REQUEST[idtecnico] AND scheda.idscheda=$_REQUEST[idscheda]
					ORDER BY endcode desc
				)
				UNION
				(
					SELECT -1,
						CASE WHEN endcode IS null THEN tecnico || 'C' || '1' ELSE tecnico||'C'||(endcode+1) END AS campionecode,
						CASE WHEN endcode IS null THEN 1 ELSE endcode+1 END AS endcode,
						CASE WHEN endcode IS null THEN tecnico || 'C' || '1 nuovo' ELSE tecnico||'C'||(endcode+1)|| ' nuovo' END AS descrizione,
						'true' AS nuovo
					FROM A
				)
				ORDER BY endcode desc";*/
			$sql="WITH A AS (
					SELECT $_REQUEST[idtecnico] AS tecnico, MAX(cast(substring(codice from 'C([0-9]{0,})') as numeric)) as endcode, 'false' as nuovo
					FROM simfito.campioni
					INNER JOIN simfito.scheda ON campioni.scheda_id=scheda.idscheda
					INNER JOIN simfito.tecnici ON tecnici.id_tecnico=scheda.id_tecnico
					WHERE tecnici.id_tecnico=$_REQUEST[idtecnico]
					--GROUP BY tecnici.id_tecnico
				)
				(
					SELECT id,
					codice,
					cast(substring(codice from 'C([0-9]{0,})') AS numeric) AS endcode,
					codice||' in uso' AS descrizione,
					'false' as nuovo,
					elementicampione,
					tipocampione_id

					FROM simfito.campioni
					INNER JOIN simfito.scheda ON campioni.scheda_id=scheda.idscheda
					INNER JOIN simfito.tecnici ON tecnici.id_tecnico=scheda.id_tecnico
					WHERE tecnici.id_tecnico=$_REQUEST[idtecnico] AND scheda.idscheda=$_REQUEST[idscheda]
				)
				UNION
				(
					SELECT -1 AS id,
						CASE WHEN endcode IS null THEN tecnico || 'C' || '1' ELSE tecnico||'C'||(endcode+1) END AS codice,
						CASE WHEN endcode IS null THEN 1 ELSE endcode+1 END AS endcode,
						CASE WHEN endcode IS null THEN tecnico || 'C' || '1 nuovo' ELSE tecnico||'C'||(endcode+1)|| ' nuovo' END AS descrizione,
						'true' AS nuovo,
						0 AS elementicampione,
						null as tipocampione_id
					FROM A
				)
				ORDER BY endcode DESC";

			/*$sql="WITH A AS(
					SELECT tecnici.id_tecnico AS tecnico, MAX(cast(substring(codice from 'C([0-9]{0,})') as numeric)) as endcode, 'false' as nuovo
					FROM simfito.campioni
					INNER JOIN simfito.scheda ON campioni.scheda_id=scheda.idscheda
					INNER JOIN simfito.tecnici ON tecnici.id_tecnico=scheda.id_tecnico
					WHERE tecnici.id_tecnico=$_REQUEST[idtecnico]
					GROUP BY tecnici.id_tecnico
				)
				SELECT -1 as id,
					CASE WHEN endcode IS null THEN tecnico || 'C' || '1' ELSE tecnico || 'C' || (endcode+1) END AS codice,
					CASE WHEN endcode IS null THEN 1 ELSE endcode+1 END AS endcode,
					CASE WHEN endcode IS null THEN tecnico || 'C' || '1' ELSE tecnico||'C'||(endcode+1) END AS descrizione,
					'true' AS nuovo
				FROM A"*/;
			readJson($sql);
		break;
		case "codici_prossimo":
			$sql="SELECT tecnici.id_tecnico||'C'||MAX(cast(substring(codice from 'C([0-9]{0,})') AS numeric)) AS \"ultimo\",
				tecnici.id_tecnico||'C'||MAX(cast(substring(codice from 'C([0-9]{0,})') AS numeric))+1 AS \"prossimo\"
				FROM simfito.campioni
				INNER JOIN simfito.scheda ON campioni.scheda_id=scheda.idscheda
				INNER JOIN simfito.tecnici ON tecnici.id_tecnico=scheda.id_tecnico
				WHERE tecnici.id_tecnico=$_REQUEST[idtecnico]
				GROUP BY tecnici.id_tecnico";
			readJson($sql);
		break;
		case "trappole_old":
			$sql="SELECT trappole.id,id_tipo,codice,numero_individui,tipo_trappole.descrizione,n_piante_rap
				FROM trappole
				INNER JOIN tipo_trappole ON trappole.id_tipo=tipo_trappole.id
				WHERE id_osservazione='$_REQUEST[idosservazione]'";
			readJson($sql);
		break;
		case "trappole":
			/*$sql="SELECT coalesce(trappole.id,-1) AS id, trappole_geometry.id AS t_g_id, tipo_trappole_id AS id_tipo, trappole_geometry.codice, numero_individui,
						tipo_trappole.descrizione, n_piante_rap, coalesce(id_osservazione,-1) as idosservazione, note
				FROM simfito.trappole_geometry
				LEFT JOIN simfito.trappole ON trappole.trappole_geometry_id=trappole_geometry.id
				INNER JOIN simfito.tipo_trappole ON trappole_geometry.tipo_trappole_id=tipo_trappole.id
				WHERE gid='$_REQUEST[gid]'";*/


			$sql="WITH a AS (
					SELECT trappole.id, trappole_geometry_id, numero_individui, n_piante_rap, id_osservazione, note
					FROM simfito.trappole
					WHERE id_osservazione='$_REQUEST[idosservazione]'
				), b AS (
					SELECT trappole_geometry.id, tipo_trappole_id AS id_tipo, codice, tipo_trappole.descrizione, nome, datacreazione
					FROM simfito.trappole_geometry
					INNER JOIN simfito.tipo_trappole ON trappole_geometry.tipo_trappole_id=tipo_trappole.id
					WHERE gid='$_REQUEST[gid]' AND statotrappole_id=0
				), c as (
					select scheda.data_sopralluogo
					from simfito.scheda
					inner join simfito.osservazioni on scheda.idscheda=osservazioni.idscheda
					where idosservazioni='$_REQUEST[idosservazione]'
				)
				SELECT coalesce(a.id,-1) AS idtrp , b.id as t_g_id, id_tipo, codice, numero_individui, tipo_trappole.descrizione, n_piante_rap,
						coalesce(id_osservazione, -1) as id_osservazione, note, b.nome as nome,b.datacreazione, c.data_sopralluogo
				FROM b
				natural join c
				LEFT JOIN a ON a.trappole_geometry_id=b.id
				INNER JOIN simfito.tipo_trappole ON b.id_tipo=tipo_trappole.id
				where datacreazione<=data_sopralluogo";
			readJson2($sql);
		break;
		case "trappole_geom":
			//$where='WHERE statotrappole.id=0';
			$where="WHERE true";
			if(isset($_REQUEST["gid"])){
				if($_REQUEST['gid']>0){
					$where.=" AND siti.gid=$_REQUEST[gid]";
				}
			}
			if(isset($_REQUEST["scheda_id"])){
				$where.=" AND datacreazione<='$_REQUEST[schda_id]'";
			}
			$sql="SELECT trappole_geometry.id,scheda_id,rimozionescheda_id, codice, to_char(datacreazione,'YYYY-MM-DD') as datacreazione, to_char(datavariazione,'YYYY-MM-DD') as datavariazione, 
					st_asgeojson(st_transform(trappole_geometry.the_geom,3857),15,2) AS geometry, statotrappole.descrizione as stato, 
					siti.denominaz, statotrappole.id as stato_id, coalesce(trappole_geometry.nome,'N/A') as nome, azienda.rag_soc||'-'||siti.denominaz as aziendasito,
					CASE WHEN anno IS null THEN date_part('Year',datacreazione) ELSE anno END AS anno, tipo_trappole.descrizione as tipotrappola,
					tecnici.cognome||' '||tecnici.nome AS tecnico, coalesce(t_pest.full_name,'N/A') as mainpest,
					host,suprap,suptot,unitrap, coalesce(t_host.full_name,'N/A') as mainhost, organismo as pest,
					case singleuse when true then 'true' else 'false' end as singleuse
				FROM simfito.trappole_geometry
				INNER JOIN simfito.statotrappole on simfito.trappole_geometry.statotrappole_id=simfito.statotrappole.id
				INNER JOIN simfito.siti ON siti.gid = trappole_geometry.gid
				LEFT JOIN simfito.azienda ON siti.piva_azienda=azienda.partita_iva
				LEFT JOIN simfito.tipo_trappole on trappole_geometry.tipo_trappole_id=tipo_trappole.id
				LEFT JOIN simfito.tecnici on trappole_geometry.tecnico_id=tecnici.id_tecnico
				LEFT JOIN t_vista as t_pest on trappole_geometry.organismo=t_pest.b_code
				LEFT JOIN t_vista as t_host on trappole_geometry.host=t_host.b_code
				$where
				order by stato_id, datacreazione desc;";
			readJson($sql);
		break;
		case "trappole_geom2":
			$where='WHERE true';//'WHERE statotrappole.id=0';
			if($_REQUEST["x"]!=''){
				$proj=explode(':',$_REQUEST["prj"]);
				$where.=" AND ST_Intersects(
					st_transform(
						trappole_geometry.the_geom, 32633), 
						st_buffer(st_transform(ST_GeomFromText('POINT($_REQUEST[x] $_REQUEST[y])',$proj[1]),32633),
						$_REQUEST[r]
					)
				)";
			}
			$order="stato_id, datacreazione desc";
			if(isset($_REQUEST["gid"])){
				if($_REQUEST['gid']>0){
					$where.=" AND siti.gid=$_REQUEST[gid]";
				}
			}

			if(isset($_REQUEST['filter'])){
				$xx=json_decode($_REQUEST['filter'],true);
				for($i=0;$i<count($xx);$i++){ //elimina l'ambiguità di idscheda
					if($xx[$i]['property']=='id'){
						$xx[$i]['property']='trappole_geometry.id';
					}else if($xx[$i]['property']=='tipotrappola'){
						$xx[$i]['property']='tipo_trappole.descrizione';
					}else if($xx[$i]['property']=='nome'){
						$xx[$i]['property']='trappole_geometry.nome';
					}else if($xx[$i]['property']=='mainpest'){
						$xx[$i]['property']='t_vista.full_name';
					}else if($xx[$i]['property']=='aziendasito'){
						$xx[$i]['property']="azienda.rag_soc||'-'||siti.denominaz";
					}else if($xx[$i]['property']=='tecnico'){
						$xx[$i]['property']="tecnici.cognome||' '||tecnici.nome";
					}	
				
				}
				$where.= filter_parser(json_encode($xx));
			}

			if(isset($_REQUEST['sort'])){
				$order=sorter_parser($_REQUEST['sort']);
			}

			$sql="SELECT trappole_geometry.id, codice, to_char(datacreazione,'YYYY-MM-DD') as datacreazione, to_char(datavariazione,'YYYY-MM-DD') as datavariazione, 
					st_asgeojson(st_transform(trappole_geometry.the_geom,3857),15,2) AS geometry, statotrappole.descrizione as stato, 
					siti.denominaz, statotrappole.id as stato_id, coalesce(trappole_geometry.nome,'N/A') as nome, azienda.rag_soc||'-'||siti.denominaz as aziendasito,
					CASE WHEN anno IS null THEN date_part('Year',datacreazione) ELSE anno END AS anno, tipo_trappole.descrizione as tipotrappola,
					tecnici.cognome||' '||tecnici.nome AS tecnico, coalesce(t_vista.full_name,'N/A') as mainpest, tempo, organismo, tempo_rimozione, durata_erogatore,
					tecnicirimozione.cognome||' '||tecnicirimozione.nome AS tecnico_rimozione
				FROM simfito.trappole_geometry
				INNER JOIN simfito.statotrappole on simfito.trappole_geometry.statotrappole_id=simfito.statotrappole.id
				INNER JOIN simfito.siti ON siti.gid = trappole_geometry.gid
				LEFT JOIN simfito.azienda ON siti.piva_azienda=azienda.partita_iva
				LEFT JOIN simfito.tipo_trappole on trappole_geometry.tipo_trappole_id=tipo_trappole.id
				LEFT JOIN simfito.tecnici on trappole_geometry.tecnico_id=tecnici.id_tecnico
				LEFT JOIN simfito.tecnici AS tecnicirimozione on trappole_geometry.tecnicorimozione_id=tecnicirimozione.id_tecnico
				LEFT JOIN t_vista on trappole_geometry.organismo=t_vista.b_code
				$where
				order by $order
				LIMIT $_REQUEST[limit]
				OFFSET $_REQUEST[start]
				";
			//echo($sql);
			$rsql="SELECT count(*) AS cc
				FROM simfito.trappole_geometry
				INNER JOIN simfito.statotrappole on simfito.trappole_geometry.statotrappole_id=simfito.statotrappole.id
				INNER JOIN simfito.siti ON siti.gid = trappole_geometry.gid
				LEFT JOIN simfito.azienda ON siti.piva_azienda=azienda.partita_iva
				LEFT JOIN simfito.tipo_trappole on trappole_geometry.tipo_trappole_id=tipo_trappole.id
				LEFT JOIN simfito.tecnici on trappole_geometry.tecnico_id=tecnici.id_tecnico
				LEFT JOIN simfito.tecnici AS tecnicirimozione on trappole_geometry.tecnicorimozione_id=tecnicirimozione.id_tecnico
				LEFT JOIN t_vista on trappole_geometry.organismo=t_vista.b_code
				$where";

			$r=$db->FetchRow($rsql);
			$extra="totaldata:$r[cc]";

			//$risultato=json_decode($db->ReadTableAsJson($sql,$extra));
			readJson($sql,$extra);
		break;
		case "trappole_report_combo":
			if (isset($_REQUEST['query']) && $_REQUEST['query']!='') {
				$ww = pg_escape_string($_REQUEST['query']);
				$where = "t_vista.full_name ilike '%$ww%'";
			}
			else {
				$where = 'true';
			}
			$query="SELECT distinct t_vista.full_name as mainpest, organismo
				FROM simfito.trappole_geometry
				INNER JOIN t_vista on trappole_geometry.organismo=t_vista.b_code
				WHERE $where
				ORDER by mainpest";
			readJson($query);
		break;
		case "tipo_trappole":
			$sql="SELECT id, descrizione
				FROM tipo_trappole
				WHERE not deleted
				ORDER BY id";
			readJson($sql);
		break;
		case "fasifenologiche":
		   $fenogruppo=chk_fenogruppo($_REQUEST['idobs']);
		   $sql="SELECT id AS id_fase_fenologicha, descrizione as fase_fenologica, info FROM fasi_fenologiche WHERE gruppo=$fenogruppo ORDER BY id";
		   readJson($sql);
		break;
		case "perparassita":
			if($_REQUEST['prv']!='null')
				$where=" AND comuni.prvistat=$_REQUEST[prv]";
			else
				$where="";
			$sql="SELECT
				sum(n_osservate) AS piante_monitorate,

				sum(piante_camp_vis) AS piante_campionate_visivamente,
				sum(piante_infest) AS piante_infestate,
				sum(n_abbattute) AS piante_abbattute,
				cast(sum(sup_vis)/10000 AS numeric(9,1)) as superfici_monitorata_visivamente_ha,
				cast(sum(sup_infest)/10000 AS numeric(9,1)) as superfici_infestata_ha,

				cast(sum(siti.superficie_ha)/10000 AS numeric(7,1)) AS superficie_monitorata_ha,
				cast(count(siti.gid)*($_REQUEST[infestata]*$_REQUEST[infestata]*3.14)/10000 AS numeric(7,1)) AS superficie_infestata_ha,
				comuni.nome AS comune,
				comuni.provincia AS provincia
			FROM
				osservazioni
			INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda
			INNER JOIN siti ON scheda.gid_sito=siti.gid
			INNER JOIN comuni ON siti.comune_istat=comuni.istat $where
			INNER JOIN t_baycode ON t_baycode.b_code=hostcode
			INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
			WHERE
				pestcode='$_REQUEST[pestcode]' AND scheda.stato=2 AND t_bayname.preferred=1 AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
				AND osservazioni.rilevato=1
			GROUP BY
				comuni.nome,comuni.provincia";
			$titolo="Report per il parassita $_REQUEST[pestcode], dal $_REQUEST[start] al $_REQUEST[end]";
			if($_REQUEST['export']=='xls')
				xml($titolo,$sql);
			else
				readJson($sql);
		break;
		case "perospite":
			if($_REQUEST['prv']!='null')
				$where=" AND comuni.prvistat=$_REQUEST[prv]";
			else
				$where="";
			$sql="SELECT
				sum(n_osservate) AS piante_monitorate,

				sum(piante_camp_vis) AS piante_campionate_visivamente,
				sum(piante_infest) AS piante_infestate,
				sum(n_abbattute) AS piante_abbattute,
				cast(sum(sup_vis)/10000 AS numeric(9,1)) as superfici_monitorata_visivamente_ha,
				cast(sum(sup_infest)/10000 AS numeric(9,1)) as superfici_infestata_ha,

				pestcode AS bcode_parassita,
				t_bayname.full_name AS nome_parassita,
				cast(sum(siti.superficie_ha)/10000 AS numeric(7,1)) AS superficie_monitorata_ha,
				cast(count(siti.gid)*($_REQUEST[infestata]*$_REQUEST[infestata]*3.14)/10000 AS numeric(7,1)) AS superficie_infestata_ha,
				comuni.nome AS comune,
				comuni.provincia AS provincia
			FROM
				osservazioni
			INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda
			INNER JOIN siti ON scheda.gid_sito=siti.gid
			INNER JOIN comuni ON siti.comune_istat=comuni.istat $where
			INNER JOIN t_baycode ON t_baycode.b_code=pestcode
			INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
			WHERE
				hostcode='$_REQUEST[hostcode]' AND scheda.stato=2 AND t_bayname.preferred=1 AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
				and osservazioni.rilevato=1
			GROUP BY
				pestcode,comuni.nome,comuni.provincia,t_bayname.full_name";
			$titolo="Report per l'ospite $_REQUEST[hostcode], dal $_REQUEST[start] al $_REQUEST[end]";
			if($_REQUEST['export']=='xls')
				xml($titolo,$sql);
			else
				readJson($sql);
		break;
		case 'alert':
			$idscheda=$_REQUEST['id'];
			$sql="SELECT 'positivo' as tipo, count(*) as count FROM osservazioni WHERE rilevato=1 AND idscheda=$idscheda
				UNION
				SELECT 'nuova segnalazione' as tipo, count(*) as cont FROM pest_report WHERE idscheda=$idscheda";
			readJson($sql);
		break;
		case 'pestMun':
			if($_REQUEST['prv']!='null')
				$where="WHERE comuni.prvistat=$_REQUEST[prv]";
			/*else if($_REQUEST['provincia'])
				$where="WHERE comuni.provincia='$_REQUEST[provincia]'"; //cambiare*/
			else
				$where="";
			if($_REQUEST['class']){
				$sql="SELECT comuni.nome AS denominazione, count(osservazioni.*) AS value
				FROM
					comuni
				INNER JOIN siti ON comuni.istat=siti.comune_istat
				INNER JOIN scheda ON scheda.gid_sito=siti.gid and scheda.stato=2 AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
				INNER JOIN osservazioni ON osservazioni.idscheda=scheda.idscheda AND osservazioni.pestcode='$_REQUEST[pest]' AND osservazioni.rilevato=1
				$where
				GROUP BY comuni.nome";
				readJson($sql);
			}else{
				$sqlC="SELECT comuni.nome AS denominazione,count(osservazioni.*) AS rilevazioni,st_asgeojson(ST_Force_2D(comuni.the_geom)) AS geometry
				FROM
					comuni
				INNER JOIN siti ON comuni.istat=siti.comune_istat
				INNER JOIN scheda ON scheda.gid_sito=siti.gid and scheda.stato=2 AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
				INNER JOIN osservazioni ON osservazioni.idscheda=scheda.idscheda AND osservazioni.pestcode='$_REQUEST[pest]' AND osservazioni.rilevato=1
				$where
				GROUP BY comuni.nome,comuni.the_geom";
				$sqlB="SELECT 'buffer' AS denominazione,-999.99 AS rilevazioni,st_asgeojson(
					st_transform(
						st_difference(
							st_union(
								st_buffer(st_transform(comuni.the_geom,32633),$_REQUEST[buffer])
							),st_union(
								st_transform(ST_Force_2D(comuni.the_geom),32633)
							)
						),4326
					)
				) AS geometry
				FROM
					comuni
				INNER JOIN siti ON comuni.istat=siti.comune_istat
				INNER JOIN scheda ON scheda.gid_sito=siti.gid and scheda.stato=2 AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
				INNER JOIN osservazioni ON osservazioni.idscheda=scheda.idscheda AND osservazioni.pestcode='$_REQUEST[pest]' AND osservazioni.rilevato=1
				$where
				GROUP BY denominazione, rilevazioni";
				$sql="$sqlC UNION $sqlB";
				if($_REQUEST['download']){
					header('Pragma: public');
					header('Expires: 0');
					header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
					header('Content-Type: application/force-download');
					//header('Content-Type: application/octet-stream');
					header('Content-Type: application/download');;
					header("Content-Disposition: attachment;filename=export.geoJson");
					header('Content-Transfer-Encoding: binary ');
				}
				echo psg2gjsonA($sql);
			}
		break;
		case "perComune":
			if($_REQUEST['prv']!='null')
				$where="WHERE comuni.prvistat=$_REQUEST[prv]";
			if($_REQUEST['export']=='xls'){
				$titolo="Comuni interessati da $_REQUEST[pest] con buffer d'incidenza: $_REQUEST[buffer] [m]";
				$sql="with infestate as(
						SELECT
							st_union(
								st_transform(
									ST_Buffer(st_transform(siti.the_geom,32633),$_REQUEST[buffer]),4326
								)
							) AS geometry
						FROM osservazioni
						INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
						INNER JOIN siti ON scheda.gid_sito=siti.gid AND scheda.stato=2
						INNER JOIN comuni ON siti.comune_istat=comuni.istat $where
						INNER JOIN t_baycode ON t_baycode.b_code='$_REQUEST[pest]'
						INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
						WHERE
							osservazioni.pestcode='$_REQUEST[pest]' AND t_bayname.preferred=1 and osservazioni.rilevato=1
				)
				SELECT comuni.nome as \"comune\",comuni.provincia AS \"provincia\"
					FROM
						comuni, infestate
					WHERE st_intersects(comuni.the_geom,infestate.geometry)";
				xml($titolo,$sql);
			}else{
				$sql="with infestate as(
						SELECT
							st_union(
								st_transform(
									ST_Buffer(st_transform(siti.the_geom,32633),$_REQUEST[buffer]),4326
								)
							) AS geometry
						FROM osservazioni
						INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
						INNER JOIN siti ON scheda.gid_sito=siti.gid AND scheda.stato=2
						INNER JOIN comuni ON siti.comune_istat=comuni.istat $where
						INNER JOIN t_baycode ON t_baycode.b_code='$_REQUEST[pest]'
						INNER JOIN t_bayname ON t_bayname.codeid=t_baycode.codeid
						WHERE
							osservazioni.pestcode='$_REQUEST[pest]' AND t_bayname.preferred=1 and osservazioni.rilevato=1
				)
				SELECT comuni.nome as \"comune\",comuni.provincia AS \"provincia\",st_asgeojson(ST_Force_2D(comuni.the_geom)) AS geometry
					FROM
						comuni, infestate
					WHERE st_intersects(comuni.the_geom,infestate.geometry)";
				if($_REQUEST['download']){
					header('Pragma: public');
					header('Expires: 0');
					header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
					header('Content-Type: application/force-download');
					//header('Content-Type: application/octet-stream');
					header('Content-Type: application/download');;
					header("Content-Disposition: attachment;filename=export.geoJson");
					header('Content-Transfer-Encoding: binary ');
				}
				echo psg2gjsonA($sql);
			}
		break;
		case "pestMunGrid":
			if($_REQUEST['prv']!='null')
				$where="WHERE comuni.prvistat=$_REQUEST[prv]";
			/*else if($_REQUEST['provincia'])
				$where="WHERE comuni.provincia='$_REQUEST[provincia]'"; //cambiare*/
			else
				$where="";
			$sql="SELECT nome AS comune,count(osservazioni.*) AS rilevazioni
				FROM
					comuni
				INNER JOIN siti ON comuni.istat=siti.comune_istat
				INNER JOIN scheda ON scheda.gid_sito=siti.gid and scheda.stato=2 AND scheda.data_sopralluogo>='$_REQUEST[start]' AND scheda.data_sopralluogo<='$_REQUEST[end]'
				INNER JOIN osservazioni ON osservazioni.idscheda=scheda.idscheda AND osservazioni.pestcode='$_REQUEST[pest]' AND osservazioni.rilevato=1
				$where
				GROUP BY comuni.nome";
			$titolo="Report per il parassita $_REQUEST[pest], per comune, dal $_REQUEST[start] al $_REQUEST[end]";
			if($_REQUEST['export']=='xls')
				xml($titolo,$sql);
			else
				readJson($sql);
		break;
		case "shp_comuni":
			$sql="SELECT istat as \"istat\",nome as \"comune\",provincia AS \"provincia\", st_asgeojson(st_transform(the_geom,4326)) AS geometry
				FROM comuni";
			if($_REQUEST['download']){
				header('Pragma: public');
				header('Expires: 0');
				header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
				header('Content-Type: application/force-download');
				//header('Content-Type: application/octet-stream');
				header('Content-Type: application/download');;
				header("Content-Disposition: attachment;filename=export.geoJson");
				header('Content-Transfer-Encoding: binary ');
			}
			echo psg2gjson($sql);
		break;
		case "lista_segnalazioni":
			if(isset($_REQUEST['tuid'])&&($_REQUEST['tuid']*1<=1)){
				$where0='WHERE 1=1';
			}
			else{
				$where0="WHERE tecnici.id_tecnico='$_REQUEST[uid]'";
			}

			if(isset($_REQUEST['sort'])){
				$order=sorter_parser($_REQUEST['sort']);
			}
			else{
				$order="nuova desc,id desc,data desc";
			}

			if(isset($_REQUEST['filter'])){
				$where= filter_parser($_REQUEST['filter']);
			}

			$sql="SELECT id, host, c.full_name AS host_name, pest, d.full_name AS pest_name, tecnici.nome,tecnici.cognome, data,rigetto,
					CASE WHEN validato THEN 'true' ELSE 'false' END AS validato,
					CASE WHEN nuova_segnalazione THEN 'true' ELSE 'false' END AS nuova
				FROM ordinari
				INNER JOIN t_baycode AS a ON a.b_code=host
				INNER JOIN t_baycode AS b ON b.b_code=pest
				INNER JOIN t_bayname AS c ON c.codeid=a.codeid AND c.preferred=1
				INNER JOIN t_bayname AS d ON d.codeid=b.codeid AND d.preferred=1
				LEFT JOIN tecnici ON ordinari.userid=tecnici.id_tecnico
				$where0 $where
				ORDER BY $order
				LIMIT $_REQUEST[limit]
				OFFSET $_REQUEST[start]";
			//echo $sql;

			$rsql="SELECT count(*) AS cc
				FROM ordinari
				INNER JOIN t_baycode AS a ON a.b_code=host
				INNER JOIN t_baycode AS b ON b.b_code=pest
				INNER JOIN t_bayname AS c ON c.codeid=a.codeid AND c.preferred=1
				INNER JOIN t_bayname AS d ON d.codeid=b.codeid AND d.preferred=1
				LEFT JOIN tecnici ON ordinari.userid=tecnici.id_tecnico
				$where0 $where";

			//readJson($sql);


			$r=$db->FetchRow($rsql);
			$extra="totaldata:$r[cc]";

			$risultato=json_decode($db->ReadTableAsJson($sql,$extra));
			$sql2="SELECT count(*) AS nuovi
				FROM ordinari
				INNER JOIN t_baycode AS a ON a.b_code=host
				INNER JOIN t_baycode AS b ON b.b_code=pest
				INNER JOIN t_bayname AS c ON c.codeid=a.codeid AND c.preferred=1
				INNER JOIN t_bayname AS d ON d.codeid=b.codeid AND d.preferred=1
				LEFT JOIN tecnici ON ordinari.userid=tecnici.id_tecnico
				$where0 $where AND (nuova_segnalazione AND not validato)";
			$nuovi=$db->fetchrow($sql2);
			$risultato->nuovi=$nuovi["nuovi"];
			//var_dump($nuovi);
			//var_dump($risultato);
			//readJson($sql,$extra);
			echo json_encode($risultato);
		break;
		case "mainreport":
			$titolo="Report_generale";

			$and='';
			/*if($_REQUEST['prv']!='null')
				$where="WHERE comuni.prvistat=$_REQUEST[prv]";*/
			if(isset($_REQUEST['start']))
				$and.=" AND scheda.data_Sopralluogo>='$_REQUEST[start]'";
			if(isset($_REQUEST['end']))
				$and.=" AND scheda.data_Sopralluogo<='$_REQUEST[end]'";

			if((isset($_REQUEST['tecnico']))&&(($_REQUEST['tecnico']!='all')&&(strtolower($_REQUEST['tecnico'])!='tutti')))
				$and.=" AND tecnici.id_tecnico='$_REQUEST[tecnico]'"; //TECNICO (id)

			if((isset($_REQUEST['host']))&&(($_REQUEST['host']!='all')&&(strtolower($_REQUEST['host'])!='tutti')))
				$and.=" AND hostcode='$_REQUEST[host]'"; //HOST
			if((isset($_REQUEST['pest']))&&(($_REQUEST['pest']!='all')&&(strtolower($_REQUEST['pest'])!='tutti')))
				$and.=" AND pestcode='$_REQUEST[pest]'";

			if((isset($_REQUEST['rilevato']))&&(($_REQUEST['rilevato']!='all')&&(strtolower($_REQUEST['rilevato'])!='tutti')))
				$and.=" AND osservazioni.rilevato='$_REQUEST[rilevato]'";

	        if((isset($_REQUEST['tipo'])&&(strtolower($_REQUEST['tipo'])!='tutti')))
	            $and.=" AND azienda.$_REQUEST[tipo]=true";

	        if((isset($_REQUEST['comune'])&&(strtolower($_REQUEST['comune'])!='tutti')))
	            $and.=" AND siti.comune_istat='$_REQUEST[comune]'";
	        if((isset($_REQUEST['provincia'])&&(strtolower($_REQUEST['provincia'])!='tutti')))
	            $and.=" AND comuni.provincia='$_REQUEST[provincia]'";

			$sql="select scheda.idscheda as \"id scheda\",stato_scheda.descrizione as \"stato scheda\",tipo_visita.motivo as \"motivo monitaroggio\",
				scheda.data_sopralluogo as \"data sopralluogo\",

				tecnici.cognome as \"cognome tecnico\",tecnici.nome as \"nome tecnico\",tipo_tecnico.tipotecnico as \"tipo tecnico\",
				tecnici.codicefiscale as \"codice fiscale tecnico\",tecnici.email as \"email tecnico\", tecnici.telefono as \"telefono tecnico\",
				tecnici.mobile as \"cellulare tecnico\",

				azienda.partita_iva as \"partita iva azienda\",azienda.rag_soc as \"ragione sociale azienda\",
				case when azienda.rup then 'si' else 'no' end as \"azienda rup\", case when azienda.vivaio then 'si' else 'no' end as \"vivaio\",
				case when azienda.fito then 'si' else 'no' end as \"fito\", comaz.nome as \"azineda comune\", comaz.provincia as \"azienda provincia\",
				azienda.localita as \"azineda localita'\", azienda.indirizzo as \"azienda indirizzo\", azienda.cap as \"azienda C.A.P\",
				azienda.referente as \"azienda referente\", azienda.posizione_ref as \"azienda posizione referente\", azienda.telefono as \"azienda telefono\",
				azienda.fax as \"azienda fax\",azienda.email as \"azienda email\",

				siti.gid as \"sito id\",
				siti.denominaz as \"sito denominazione\",siti.localita as \"sito localita'\", siti.indirizzo as \"sito indirizzo\",
				round(cast( siti.superficie_ha as numeric(200,8)),0) as \"sito superficie [ha]\",
				siti.quota as \"sito quota [m]\",comuni.nome as \"sito comune\",
				comuni.provincia as \"sito provincia\",
				round(cast(st_x(st_transform(siti.the_geom,32633)) as numeric(20,4)),0) as \"sito x\",
				round(cast(st_y(st_transform(siti.the_geom,32633)) as numeric(20,4)),0) as \"sito y\",

				osservazioni.idosservazioni,osservazioni.hostcode as \"codice pianta ospite\",hname.full_name AS \"nome pianta ospite\",
				osservazioni.pestcode as \"codice organismo nocivo\",pname.full_name AS \"nome organismo nocivo\",
				CASE WHEN osservazioni.campione THEN 'si' ELSE 'no' END AS \"Campione per laboratorio\",
				osservazioni.sospetti as \"sintomi sospetti\",
				osservazioni.attacco_grado as \"grado attacco\", osservazioni.attacco_int as \"intensita' attacco\",
				osservazioni.fase_fenologica as \"fase fenologica\", osservazioni.n_osservate as \"numero piante osservate\", osservazioni.organi as \"organi colpiti\",
				osservazioni.pericolosita as \"pericolosita'\",osservazioni.varieta as \"varieta'\", osservazioni.data_impianto as \"data impianto\",
				osservazioni.piante_camp_vis as \"piante campionate visivamente\", obs_rilevato.descrizione as rilevato,
				osservazioni.piante_infest as \"piante infestate\", osservazioni.sup_vis as \"superficie campionata visivamente\",
				osservazioni.sup_infest as \"superficie dichiarata infestat\", osservazioni.n_abbattute as \"piante abbattute\",

				trappole.codice as \"trappola codice\", tipo_trappole.descrizione as \"trappola tipo\",
				trappole.numero_individui as \"trappola individui catturati\",
				trappole.n_piante_rap as \"trappola piante rappresentative\", trappole.note as \"trappola note\"
			from scheda
			INNER JOIN stato_scheda on scheda.stato=stato_scheda.id
			INNER JOIN tipo_visita on tipo_visita.idtipo_visita=scheda.idtipo_visita
			INNER JOIN tecnici on tecnici.id_tecnico=scheda.id_tecnico
			INNER JOIN tipo_tecnico on tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
			INNER JOIN osservazioni on osservazioni.idscheda=scheda.idscheda
			INNER JOIN siti on siti.gid=scheda.gid_sito
			INNER JOIN azienda on siti.piva_azienda=azienda.partita_iva
			INNER JOIN obs_rilevato on osservazioni.rilevato=obs_rilevato.id
			INNER JOIN t_baycode as tbh ON tbh.b_code=hostcode
			INNER JOIN t_bayname as hname ON hname.codeid=tbh.codeid AND hname.preferred=1
			INNER JOIN t_baycode as tbp ON tbp.b_code=pestcode
			INNER JOIN t_bayname as pname ON pname.codeid=tbp.codeid AND pname.preferred=1
			left join trappole on osservazioni.idosservazioni=trappole.id_osservazione
			left join tipo_trappole on trappole.id_tipo=tipo_trappole.id
			left join comuni as comaz on azienda.istat_comune=comaz.istat
			left join comuni on siti.comune_istat=comuni.istat
			where scheda.stato>0 $and
			order by scheda.data_sopralluogo desc, scheda.idscheda desc";
			//echo $sql;
	        xml($titolo,$sql);
		break;
		case "sesso":
			readJson("SELECT * FROM sesso ORDER BY id DESC");
		break;
		case "osservazionibbox":
			$sql= "SELECT box2d(st_transform(st_union(the_geom),3857)) as bbox FROM osservazioni WHERE idscheda=$_REQUEST[idscheda]";
			readJson($sql);
		break;
		case "laboratorio":
			$sql="SELECT * FROM laboratorio ORDER BY id";
			readJson($sql);
		break;
		case "abbattimenti":
			$sql="SELECT abbattimenti.*, data_sopralluogo, 'Abbattimento' as descrizione, osservazioni.piante_infest
				FROM simfito.abbattimenti
				INNER JOIN simfito.osservazioni ON abbattimenti.osservazioni_id=osservazioni.idosservazioni
				INNER JOIN simfito.scheda ON osservazioni.idscheda=scheda.idscheda
				WHERE osservazioni_id=$_REQUEST[osservazioni_id]
				ORDER BY date";
			readJson($sql);
		break;
		case "config":
			switch($_REQUEST['sub']){
				case 'scheda0001':
					$sql="SELECT value FROM simfito.config WHERE code='$_REQUEST[sub]'";
					readJson($sql);
				break;
				case 'trappole0001':
					$sql="SELECT value FROM simfito.config WHERE code='$_REQUEST[sub]'";
					readJson($sql);
				break;
				default:
					errore('Caso non implementato');
				break;
			}
		break;
		case "preferred1":
			$filter='true';
			$sql="SELECT t_bayname.codeid as id,b_code, full_name
				FROM t_bayname 
				INNER JOIN t_baycode ON t_bayname.codeid=t_baycode.codeid
				WHERE isolang in ('la', 'it') AND preferred=1 AND full_name <> '' AND full_name ilike '%$_REQUEST[query]%'
				ORDER BY full_name";
			readJson($sql);
		break;
		case "themes":
			$sql="SELECT DISTINCT theme, theme_id as id
				FROM simfito.tipologiasito
				WHERE enabled
				ORDER BY theme_id";
			readJson($sql);
		break;
		case "themes1":
			$sql="SELECT DISTINCT coalesce(theme, 'Siti senza tema') as theme, coalesce(theme_id,0) as id
			FROM simfito.tipologiasito
			ORDER BY id";
			readJson($sql);
		break;
		case "temporesiduo":
			$idtecnico = $_REQUEST['idtecnico'];
			$idscheda = $_REQUEST['idscheda'];
			$datasel = "(SELECT data_sopralluogo FROM simfito.scheda WHERE idscheda=$idscheda)";
			if (true) {
				/*$sql = "
					WITH x AS (
					SELECT coalesce(sum(tempo),0) AS residuo, to_char(scheda.data_sopralluogo, 'DD/MM/YYYY') AS data
						FROM simfito.osservazioni
						INNER JOIN simfito.scheda ON osservazioni.idscheda=scheda.idscheda
						WHERE scheda.stato <> -1 and scheda.id_tecnico=$idtecnico AND data_sopralluogo=$datasel
						GROUP BY data_sopralluogo
					UNION ALL
					SELECT coalesce(sum(tempo),0) AS residuo, to_char(date_trunc('day',datacreazione), 'DD/MM/YYYY') AS data
						FROM simfito.trappole_geometry
						WHERE tecnico_id=$idtecnico AND date_trunc('day',datacreazione)=$datasel
						GROUP BY date_trunc('day',datacreazione)
					UNION ALL
					SELECT coalesce(sum(tempo_rimozione),0) AS residuo, to_char(date_trunc('day',datavariazione), 'DD/MM/YYYY') AS data
						FROM simfito.trappole_geometry
						WHERE statotrappole_id!=0 AND tecnicorimozione_id=$idtecnico AND date_trunc('day',datavariazione)=$datasel
						GROUP BY date_trunc('day',datavariazione)
					UNION ALL
					SELECT 0 AS residuo,to_char(scheda.data_sopralluogo,'DD/MM/YYYY') as data
						FROM simfito.scheda WHERE idscheda=$idscheda
					)
					SELECT 8*60-sum(residuo) AS residuo,data FROM x GROUP BY data";*/
				$sql = "
					WITH x AS (
					SELECT coalesce(sum(tempo),0) AS residuo, to_char(scheda.data_sopralluogo, 'DD/MM/YYYY') AS data
						FROM simfito.osservazioni
						INNER JOIN simfito.scheda ON osservazioni.idscheda=scheda.idscheda
						WHERE scheda.stato <> -1 and scheda.id_tecnico=$idtecnico AND data_sopralluogo=$datasel
						GROUP BY data_sopralluogo
					UNION ALL
					SELECT coalesce(sum(tempo),0) AS residuo, to_char(date_trunc('day',datacreazione), 'DD/MM/YYYY') AS data
						FROM simfito.trappole_geometry
						INNER JOIN simfito.scheda ON trappole_geometry.scheda_id=scheda.idscheda
						--WHERE tecnico_id=$idtecnico AND date_trunc('day',datacreazione)=$datasel
						WHERE scheda.stato <> -1 and scheda.id_tecnico=$idtecnico AND data_sopralluogo=$datasel
						GROUP BY date_trunc('day',datacreazione)
					UNION ALL
					SELECT coalesce(sum(tempo_rimozione),0) AS residuo, to_char(date_trunc('day',datavariazione), 'DD/MM/YYYY') AS data
						FROM simfito.trappole_geometry
						WHERE statotrappole_id!=0 AND tecnicorimozione_id=$idtecnico AND date_trunc('day',datavariazione)=$datasel
						GROUP BY date_trunc('day',datavariazione)
					UNION ALL
					SELECT 0 AS residuo,to_char(scheda.data_sopralluogo,'DD/MM/YYYY') as data
						FROM simfito.scheda WHERE idscheda=$idscheda
					)
					SELECT 8*60-sum(residuo) AS residuo,data FROM x WHERE data=to_char($datasel,'DD/MM/YYYY')  GROUP BY data";
			}
			else {
				$sql="SELECT coalesce(8*60 - sum(tempo), 8*60) AS residuo, to_char(scheda.data_sopralluogo, 'DD/MM/YYYY') AS data
				FROM simfito.osservazioni
				INNER JOIN simfito.scheda ON osservazioni.idscheda=scheda.idscheda
				WHERE scheda.stato <> -1 and scheda.id_tecnico=$idtecnico AND data_sopralluogo=(SELECT data_sopralluogo FROM simfito.scheda WHERE idscheda=$idscheda)
				GROUP BY data_sopralluogo";
			}
			readJson($sql);
		break;
		case "temporesiduo2":
			$idtecnico = $_REQUEST['idtecnico'];
			$date = $_REQUEST['data'];
			if (true) {
				$sql = "
					WITH x AS (
					SELECT coalesce(sum(tempo),0) AS residuo, to_char(scheda.data_sopralluogo, 'DD/MM/YYYY') AS data
						FROM simfito.osservazioni
						INNER JOIN simfito.scheda ON osservazioni.idscheda=scheda.idscheda
						WHERE scheda.stato <> -1 and scheda.id_tecnico=$idtecnico AND data_sopralluogo='$date'
						GROUP BY data_sopralluogo
					UNION ALL
					SELECT coalesce(sum(tempo),0) AS residuo, to_char(date_trunc('day',datacreazione), 'DD/MM/YYYY') AS data
						FROM simfito.trappole_geometry
						WHERE tecnico_id=$idtecnico AND date_trunc('day',datacreazione)='$date'
						GROUP BY date_trunc('day',datacreazione)
					UNION ALL
					SELECT coalesce(sum(tempo_rimozione),0) AS residuo, to_char(date_trunc('day',datavariazione), 'DD/MM/YYYY') AS data
						FROM simfito.trappole_geometry
						WHERE statotrappole_id!=0 AND tecnicorimozione_id=$idtecnico AND date_trunc('day',datavariazione)='$date'
						GROUP BY date_trunc('day',datavariazione)
					UNION ALL
					SELECT 0 AS residuo,to_char('$date'::date,'DD/MM/YYYY') as data
					)
					SELECT 8*60-sum(residuo) AS residuo,data FROM x GROUP BY data";
			}
			else {
				$sql="SELECT coalesce(8*60 - sum(tempo), 8*60) AS residuo, to_char(scheda.data_sopralluogo, 'DD/MM/YYYY') AS data
				FROM simfito.osservazioni
				INNER JOIN simfito.scheda ON osservazioni.idscheda=scheda.idscheda
				WHERE scheda.stato <> -1 and scheda.id_tecnico=$idtecnico AND data_sopralluogo=(SELECT data_sopralluogo FROM simfito.scheda WHERE idscheda=$idscheda)
				GROUP BY data_sopralluogo";
			}
			readJson($sql);
		break;
		case 'reportue':
			$sql="SELECT *,translate(pest,',[]\"',' ') as pestx,case when enabled then 'true' else 'false' end as enabled FROM simfito.reportue ORDER BY id DESC";
			readJson($sql);
		break;
		case 'tipotrappole':
			$sql="SELECT id, descrizione, description, CASE WHEN deleted THEN 'false' ELSE 'true' END AS \"enabled\" FROM simfito.tipo_trappole ORDER BY id DESC, deleted DESC";
			readJson($sql);
		break;
		case 'areas':
			$sql="SELECT id, anno, params,datefrom,dateto,pest,ST_AsGeoJSON(st_transform(the_geom,3857),15,2) AS geometry, CASE WHEN enabled THEN 'true' ELSE 'false' END AS \"enabled\",tampone,contenimento,name,
				area_infestata,area_tampone,area_contenimento,area_user_infestata,area_user_tampone,area_user_contenimento
				FROM simfito.areas order by pest,anno,datefrom nulls first";
			readJson($sql);
		break;
		case 'areasmerge':
			$sql="SELECT id, '(' || id ||') ' || name as descrizione FROM simfito.areas WHERE the_geom is not null ORDER BY name";
			readJson($sql);
		break;
		case 'buffer_lista_comuni':
			$id = $_REQUEST['id'];
			$sql = "SELECT the_geom is null as gg,params,tampone,contenimento FROM simfito.areas WHERE id=$id";
			$pp = $db->FetchRow($sql); 
			if ($pp['gg']=='t') {
				$ppp = json_decode($pp['params'],true);
				$ppx = '{"' . str_replace([':',','],['":"','","'],str_replace(';',',',$ppp['viewparams'])) . '"}';
				$ppv = json_decode($ppx,true);

//				echo "$pp[params]<br>";
//				echo "$ppp[viewparams]<br>";
//				echo "$ppx<br>";				
//				var_dump($ppv);echo "<br>";
				$sql = "WITH yy AS(
WITH xx AS (
         SELECT st_transform(siti.the_geom, 32633) AS gg,
            osservazioni.pestcode
           FROM simfito.siti
             JOIN simfito.scheda ON scheda.gid_sito = siti.gid
             JOIN simfito.osservazioni ON osservazioni.idscheda = scheda.idscheda
             LEFT JOIN simfitolab.analisys ON osservazioni.idosservazioni = analisys.osservazioni_id
             LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id = analisysresult.id
          WHERE osservazioni.pestcode = '%pestcode%' AND scheda.data_sopralluogo >= '%start%' AND scheda.data_sopralluogo <= '%end%' and scheda.stato=2 
                AND (((osservazioni.campioni_id = (-1) OR osservazioni.campioni_id IS NULL) AND osservazioni.rilevato = 1) 
			OR (osservazioni.campioni_id <> (-1) AND analisysresult.positive = 1)
		) AND (case when ('%tiposito%'='null') then true else tipologiasito_id= %tiposito% end)
        )
 SELECT 1 AS id, 1 AS xtype, 'zona infestata' AS descrizione,
    st_union(st_buffer(xx.gg, %buffer1%, 16)) AS the_geom
   FROM xx
UNION
 SELECT 2 AS id, 2 AS xtype, 'zona tampone' AS descrizione,
    st_difference(st_union(st_buffer(xx.gg, %buffer2%, 16)), st_union(st_buffer(xx.gg, %buffer1%, 16))) AS the_geom
   FROM xx
UNION
 SELECT 3 AS id, 3 AS xtype, 'zona di contenimento' AS descrizione,
    st_difference(st_union(st_buffer(xx.gg, %buffer3%, 16)), st_union(st_buffer(xx.gg, %buffer2%, 16))) AS the_geom
   FROM xx
)
SELECT distinct xtype,descrizione,nome,provincia from yy INNER JOIN comuni ON st_intersects(yy.the_geom,st_transform(comuni.the_geom,32633)) WHERE not st_isempty(yy.the_geom) order by xtype,nome";
				$sql = str_replace(['%start%','%end%','%pestcode%','%tiposito%','%buffer1%','%buffer2%','%buffer3%'],[$ppv['start'],$ppv['end'],$ppv['pestcode'],$ppv['tiposito'],$ppv['buffer1'],$ppv['buffer2'],$ppv['buffer3']],$sql);
			}
			else {
				$sql = "WITH yy AS(
WITH xx AS ( SELECT the_geom as gg FROM simfito.areas where id=%id% )
 SELECT 1 AS xtype, 'zona infestata' AS descrizione,xx.gg AS the_geom FROM xx
UNION
 SELECT 2 AS xtype, 'zona tampone' AS descrizione,st_difference(st_buffer(xx.gg, %tampone%, 16), xx.gg) AS the_geom FROM xx
UNION
 SELECT 3 AS xtype, 'zona di contenimento' AS descrizione,st_difference(st_buffer(xx.gg, %contenimento%, 16),st_buffer(xx.gg, %tampone%, 16)) AS the_geom FROM xx
)
SELECT distinct xtype,descrizione,nome,provincia from yy INNER JOIN comuni ON st_intersects(yy.the_geom,st_transform(comuni.the_geom,3857)) WHERE not st_isempty(yy.the_geom) order by xtype,nome";
				$sql = str_replace(['%id%','%tampone%','%contenimento%'],[$id,$pp['tampone'],$pp['contenimento']],$sql);
			}
//			echo "$sql<br>";
			headerCSV('comuni_infestati.csv');
			readCSV($sql,['descrizione','nome','provincia'],['Tipo area','Comune','Provincia']);
		break;
		case 'chk_trap':
			$gid_sito=$_REQUEST['gid_sito'];
			$coordinates=json_decode($_REQUEST['coordinates']);
			//echo $coordinates;
			//$js='{"success":true,"data":{"gid_sito":'.$gid_sito.', "coordinates":'.$coordinates.'}}';
			$sql="with a as (SELECT the_geom from simfito.siti where gid=$gid_sito)
				SELECT CASE WHEN st_intersects(
						st_buffer(st_transform(a.the_geom,3857),
							CASE WHEN st_geometrytype(a.the_geom) = 'ST_Point' THEN 200 ELSE 100 END
						),
						ST_GeomFromText('POINT($coordinates[0] $coordinates[1])',3857)
					) THEN 'true' ELSE 'false' END AS intersect
				from a";
			readJson($sql);
		break;
		case "reports":
			$idtecnico = $_REQUEST['idTecnico'];
			$tipotecnico = $_REQUEST['tipoTecnico'];
			if ($tipotecnico==0)
				$where = "tipotecnico_id=0 OR owner=$idtecnico";
			else
				$where = "owner=$idtecnico";
			$sql = "SELECT reports.*,statoreport.descrizione as statoreport_descrizione,tecnici.nome || ' ' || tecnici.cognome as owner_name FROM reports INNER JOIN statoreport on statoreport.id=reports.statoreport_id INNER JOIN tecnici on tecnici.id_tecnico=reports.owner WHERE $where ORDER BY id DESC";
			readJson($sql);
		break;
		case "reportsdownload":
			$jobid = $_REQUEST['id'];
			$sql = "SELECT * FROM reports WHERE id=$jobid";
			$r = $db->FetchRow($sql);
			$fname = $r['fullfilename'];
			if (file_exists(getcwd() . "/../data/$jobid.xls"))
				$outout = getcwd() . "/../data/$jobid.xls";
			else if (file_exists(getcwd() . "/../data/$jobid.xlsx"))
				$outout = getcwd() . "/../data/$jobid.xlsx";
			else if (file_exists(getcwd() . "/../data/$jobid.zip"))
				$outout = getcwd() . "/../data/$jobid.zip";
//			echo "'$fname' '$outout'";
//			exit(0);
			doheader($fname);
			readfile($outout);
		break;
		case "reportsdelete":
//			echo "reportsdelete";exit(0);
			$jobid = $_REQUEST['id'];
			$sql = "SELECT * FROM reports WHERE id=$jobid";
			$r = $db->FetchRow($sql);
			$xlsout = getcwd() . "/../data/$jobid.xls";
			@unlink($xlsout);
			$sql = "DELETE FROM reports WHERE id=$jobid";
			$db->SQL($sql);
			$reply = ['success'=>true];
			echo json_encode($reply);
		break;
	}
}	
//$db->connection_close();
?>
