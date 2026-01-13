<?php

require_once("../etc/db_config.php");
require_once("crud.php");
require_once('phpexcel/PHPExcel.php');

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

$sql = "
WITH host as (select b_code,full_name from t_baycode INNER JOIN t_bayname ON t_baycode.codeid=t_bayname.codeid where preferred=1 and isolang='la')
SELECT 
tecnici.nome || ' ' || tecnici.cognome as tecnici_nomecognome,tecnici.id_tecnico as tecnici_id_tecnico,
scheda.idscheda as scheda_idscheda,
osservazioni.idosservazioni as osservazioni_idosservazioni,
scheda.data_sopralluogo as scheda_data_sopralluogo,
tipo_visita.motivo as tipo_visita_motivo,
st_x(st_transform(st_centroid(siti.the_geom),4326)) as siti_the_geom_x,
st_y(st_transform(st_centroid(siti.the_geom),4326)) as siti_the_geom_y,
siti.superficie_ha as siti_superficie_ha,
osservazioni.n_osservate as osservazioni_n_osservate,
1 as siti_numerositi,
osservazioni.hostcode as osservazioni_hostcode,
host.full_name as host_full_name,
1 as samples_numerosamples,
osservazioni.campionecode as osservazioni_campionecode,
osservazioni.campione as osservazioni_campione,
tipo_trappole.descrizione as tipo_trappole_descrizione,
1 as trappole_numero,
trappole.codice as trappole_codice
FROM osservazioni
LEFT JOIN scheda ON osservazioni.idscheda=scheda.idscheda 
LEFT JOIN siti ON scheda.gid_sito=siti.gid
LEFT JOIN trappole on trappole.id_osservazione=osservazioni.idosservazioni
LEFT JOIN tipo_trappole on trappole.id_tipo=tipo_trappole.id
LEFT JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
LEFT JOIN tecnici ON scheda.id_tecnico=tecnici.id_tecnico
LEFT JOIN host on osservazioni.hostcode=host.b_code
WHERE scheda.stato=2 and %where%
ORDER BY scheda_data_sopralluogo desc,scheda.idscheda desc";

$hcolumns = array(
	"TRACEABILITY",
	"",
	"",
	"TECHINCAL INFORMATION",
	"",
	"",	"",
	"",
	"",
	"VISUAL INSPECTION",
	"",
	"",
	"SAMPLE TACKING",
	"",
	"",
	"",
	"",
	"",
	"",
	"TRAPS",
	"",
	"",
	"",
	"",
	"PLACING OF TRAPS",
	"",
	"",
	"COLLECTING OF TRAPS",
	"",
	"",
	"",

);

$columns = array(
	"name of technician",
	"n.report",
	"date",
	"tipology of area or location",
	"geographical coord x",
	"geographical coord y",
	"sup [mq]",
	"n. trees",
	"n. sites",
	"Piante ospiti",
	"n. hours",
	"unit cost",
	"total cost",
	"n. samples",
	"samples code",
	"consumables cost",
	"n. hours",
	"unit cost",
	"tot personal cost",
	"total cost",
	"tipology",
	"n. traps placed",
	"unit cost",
	"total cost",
	"attractant cost",
	"n.hours",
	"unit cost",
	"total cost",
	"n.hours",
	"unit cost",
	"total cost",
	"total cost",
);

$fields = array(
	"tecnici_nomecognome",
	"scheda_idscheda",
	"scheda_data_sopralluogo",
	"tipo_visita_motivo",
	"siti_the_geom_x",
	"siti_the_geom_y",
	"siti_superficie_ha",
	"osservazioni_n_osservate",
	"siti_numerositi",
	"host_full_name",
	"#1",
	"",
	"",
	"samples_numerosamples",
	"osservazioni_campionecode",
	"",
	"",
	"",
	"",
	"",	
	"tipo_trappole_descrizione",
	"trappole_numero",
	"",
	"",
	"",	
	"",
	"",
	"",	
	"",
	"",
	"",	

);


$connection="host=95.110.192.55 port=5432 user=postgres password=ariespac3 dbname=simfito3";

$db=new CRUD($connection);
$db->connect();

$xls = new PHPExcel;
$xls->setActiveSheetIndex(0);
$ws = $xls->getActiveSheet();

$pest = 'ANOLCN';


$sql1 = "SELECT full_name from t_bayname inner join t_baycode on t_bayname.codeid=t_baycode.codeid where b_code='$pest' and preferred=1 and isolang='la'";
$r1 = $db->FetchRow($sql1);
$fname = "$r1[full_name].xls";


$sql2 = "select id_tecnico,data_sopralluogo,count(*) as cc from osservazioni left join scheda on scheda.idscheda=osservazioni.idscheda 
where scheda.stato=2 and data_sopralluogo>='2017-01-01' and data_sopralluogo<='2017-06-30' 
group by data_sopralluogo,id_tecnico order by data_sopralluogo,id_tecnico";

$db->Read($sql2);
while ($r=$db->fetch_assoc()) {
//	echo "$r[id_tecnico] $r[data_sopralluogo] $r[cc]<br>";
	$times[ $r['data_sopralluogo'] . '-' . $r['id_tecnico'] ] = $r['cc'];
}  


$sql = str_replace('%where%',"pestcode='$pest' and data_sopralluogo>='2017-01-01' and data_sopralluogo<='2017-06-30'",$sql);

//echo "$sql<br>";


$j = 1;

$k = 0;
foreach($hcolumns as $v) {
	$ws->setCellValueByColumnAndRow($k,$j,$v);
	$k++;
}
$j++;

$k = 0;
foreach($columns as $v) {
	$ws->setCellValueByColumnAndRow($k,$j,$v);
	$k++;
}
$j++;

$db->Read($sql);
while ($r = $db->fetch_assoc()) {
	$k = 0;
	foreach($fields as $f) {
		if ($f=='') {
			$v = '';
		}
		else if ($f=='#1') {
			$v = 'xxx';
		}
		else
		{
			$v = $r[$f];
		}
		$ws->setCellValueByColumnAndRow($k,$j,$v);
		$k++;
	}
	$j++;
}

//echo "$j<br>";
//exit(0);

$xlsWriter = new PHPExcel_Writer_Excel2007($xls);
doheader($fname);
$xlsWriter->save('php://output');


?>


