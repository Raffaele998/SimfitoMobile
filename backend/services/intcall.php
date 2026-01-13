<?php
//
// da simfito a simfitolab
//
require_once("/var/www/simfito/etc/db_config.php");
require_once("/var/www/simfito/src/php/crud.php");

/********** MAIN **********/
function errore($error_reason)
{
	$result["succes"]=false;
	$result["errors"]["reason"]=$error_reason;
	write_log(json_encode($result));
	exit;
}

function write_log($data)
{
	$file_pointer = fopen("/var/www/simfito/src/php/log_intcall", "a+"); 
	fwrite($file_pointer, $data."\n"); 
	fclose($file_pointer); 

}

function trasmit($data)
{
	$key="slab!2014";
	$dataJson = json_encode($data); 
	$token=md5($data['simfitoCode'].$key);
	//var_dump($data);
	write_log($dataJson);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://localhost:8081/simfitolab/cxf/simfito/create/'.$token);
	
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $dataJson);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	curl_setopt($ch,CURLOPT_TIMEOUT,120);                                                                     
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
	    'Content-Type: application/json',                                                                                
	    'Content-Length: ' . strlen($dataJson))                                                                       
	);                                                                                                                   
	
	$result=curl_exec($ch);
	
	if( !$result) {
	 	write_log(errore(trigger_error(curl_error($ch)))); 
	}
	curl_close($ch); 
	
	write_log($result);
	$res=json_decode($result);
	$success=$res->success;
	
	if(($success)||($res->data=="org.springframework.dao.DuplicateKeyException")){ //ATTENZIONE la seconda condizione dovrebbe corrispondere al fatta che il dato è stato trasemsso ma non registrata la trasmissione
		set_trasmitted($data["simfitoCode"]);
	}else{
		write_log("<br/>ERROR <br/>Msg: ".$res->message."<br/>Data: ".$res->data."<br/> Count: ".$res->count."<br/>----------<br/>");
	} 	
	
}

function set_trasmitted($simfitoCode)
{
	global $db;
	//echo $simfitoCode.'<br/>';
	$sql="UPDATE osservazioni SET trasmitted=true WHERE campionecode='$simfitoCode'";
	if(!$db->SQL($sql))
		errore("Errore nella query");
	$result["success"] = true;
	return $result;
}

global $connection;
$db=new CRUD($connection);
if(!$db->connect())
	write_log("errore di connessione");
$prj=32633;

$sql = "SELECT osservazioni.campionecode AS \"simfitoCode\", osservazioni.parent_code as \"parentSimfitoCode\",
       		 scheda.id_tecnico AS \"idTechnical\", tecnici.nome AS \"firstnameTechnical\", tecnici.cognome AS \"surnameTechnical\", tecnici.email AS \"emailTechnical\", 
	         tecnici.telefono AS \"phoneTechnical\", tecnici.ufficio AS \"firstnameRequester\",
	         azienda.id_azienda AS \"idCompany\", azienda.rag_soc AS \"companyName\", azienda.partita_iva AS \"ivaCompany\", 
	         (CASE WHEN azienda.istat_comune=' ' THEN '000000' WHEN azienda.istat_comune is null THEN '000000' ELSE azienda.istat_comune END) AS \"idMunicipalityCompany\",
	         azienda.istat_comune AS \"istatMunicipalityCompany\", 
	         (CASE WHEN comuni.nome IS null THEN 'Non disponibile' WHEN comuni.nome='' THEN 'Non disponibile' ELSE comuni.nome END) AS \"descriptionMunicipalityCompany\", 
	         (CASE WHEN comuni.provincia IS null THEN 'Non disponibile' WHEN comuni.provincia='' THEN 'Non disponibile' ELSE comuni.provincia END) AS \"provinceMunicipalityCompany\",
	         azienda.indirizzo AS \"addressCompany\", azienda.cap AS \"capCompany\", azienda.email AS \"emailCompany\", azienda.telefono AS \"phoneCompany\",	
	         osservazioni.varieta AS \"cultivar\", osservazioni.coltura_prec as \"rotation\",	       
	         st_X(st_transform(siti.the_geom,$prj))||','||st_Y(st_transform(siti.the_geom,$prj)) AS \"coordinates\", scheda.data_sopralluogo AS \"samplingDate\", 
	         osservazioni.sospetti AS \"symptomatology\", osservazioni.attacco_grado AS \"idSpreadSymptom\", grado_attacco.nome_grado AS \"descriptionSpreadSymptom\",	
	         a.nameid as hostcode, b.nameid as pestcode      
	FROM osservazioni
	INNER JOIN la_name as a ON osservazioni.hostcode=a.b_code
	--INNER JOIN t_bayname as aa ON a.codeid=aa.codeid
	INNER JOIN la_name as b ON osservazioni.pestcode=b.b_code
	--INNER JOIN t_bayname as bb ON b.codeid=bb.codeid
	INNER JOIN scheda ON scheda.idscheda=osservazioni.idscheda
	INNER JOIN tecnici ON scheda.id_tecnico=tecnici.id_tecnico
	INNER JOIN siti ON siti.gid=scheda.gid_sito
	INNER JOIN azienda ON azienda.partita_iva=siti.piva_azienda
	INNER JOIN grado_attacco ON grado_attacco.id_grado=osservazioni.attacco_grado
	LEFT JOIN comuni ON comuni.istat=azienda.istat_comune 	
	WHERE osservazioni.campione AND scheda.stato=2 
	--and (osservazioni.campionecode != '') 
	AND NOT osservazioni.trasmitted 
	--AND aa.isolang='la' AND bb.isolang='la'	
	ORDER BY osservazioni.campionecode, hostcode, pestcode";

$simple_code="";
$hostcode="";
$db->Read($sql);
$send=false;
while ($row=$db->fetch_assoc()){
	$send=true;
	if($row["simfitoCode"]!=$simple_code){
		if($simple_code!=""){
			trasmit($data);
			//var_dump($data);
		}
		$simple_code=$row["simfitoCode"];
		//$hostcode=$row["hostcode"];
		$data = array(
			"simfitoCode" => $row["simfitoCode"], 
			"parentSimfitoCode" => $row["parentSimfitoCode"],//optional //simfito code della scheda padre riggettata!
			"idTechnical" => $row["idTechnical"],
			"firstnameTechnical"=> $row["firstnameTechnical"],
			"surnameTechnical"=> $row["surnameTechnical"],
			"emailTechnical"=> $row["emailTechnical"],
			"phoneTechnical"=> $row["phoneTechnical"],

			"firstnameRequester"=> $row["firstnameRequester"],
            "surnameRequester"=> $row["firstnameRequester"],


			"idCompany"=> $row["idCompany"],
			"companyName"=> $row["companyName"],
			"ivaCompany"=> $row["ivaCompany"],
			"idMunicipalityCompany"=> $row["idMunicipalityCompany"], 
			"istatMunicipalityCompany"=> $row["istatMunicipalityCompany"],
			"descriptionMunicipalityCompany"=> $row["descriptionMunicipalityCompany"],
			"provinceMunicipalityCompany"=> $row["provinceMunicipalityCompany"],
			"addressCompany"=> $row["addressCompany"],
			"capCompany"=> $row["capCompany"],
			"coordinatesCompany"=>"", //
			"noteCompany"=>"", //
			"emailCompany"=> $row["emailCompany"],
			"phoneCompany"=> $row["phoneCompany"],
			"idWhy"=>"10", //required and FIXED
			"descriptionWhy"=>"ricerca parassita", //required and FIXED
			"cultivar"=> $row["cultivar"],
			"rotation"=> $row["rotation"],
			"coordinates"=> $row["coordinates"], // coordinate del sito in EPSG:32633
			"samplingDate"=> $row["samplingDate"],//required (yyyy-mm-dd)
			"symptomatology"=> str_replace(array("\n","\r")," ",$row["symptomatology"]),
			"idSpreadSymptom"=> $row["idSpreadSymptom"],
			"descriptionSpreadSymptom"=> $row["descriptionSpreadSymptom"],
			"samplingDescription"=>"",
			"samplingReference"=>""
		);
		$data["guestSimfitoList"][]=array(
			"codeidBayer"=>$row["hostcode"],
			"parasiteSimfitoList"=>array(
				array("codeidBayer"=>$row["pestcode"])
			)
		);
		$hostcode=$row["hostcode"];
		$pestcode=$row["pestcode"];
	}else{
		if($row["hostcode"]==$hostcode){ //codeid
			if($row["pestcode"]!=$pestcode){
				$idx=count($data["guestSimfitoList"])-1;
				$data["guestSimfitoList"][$idx]["parasiteSimfitoList"][]=array("codeidBayer"=>$row["pestcode"]);
				$pestcode=$row["pestcode"];
			}
		}else{
			$data["guestSimfitoList"][]=array(  //codeid
				"codeidBayer"=>$row["hostcode"],
				"parasiteSimfitoList"=>array(
					array("codeidBayer"=>$row["pestcode"])
				)
			);
			$hostcode=$row["hostcode"];
			$pestcode=$row["pestcode"];
		}
	}
	
}
if($send)
	trasmit($data);
else{
	write_log("No data to trasmit\n");
	echo "No data\n";
}
?>
