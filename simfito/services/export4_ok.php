<?php

require_once("../etc/db_config.php");
require_once("crud.php");
require_once('phpexcel/PHPExcel.php');

$connection="host=localhost port=5432 user=postgres password=ariespac3 dbname=simfito4";

$db=new CRUD($connection);
$db->connect();
$db->sQL("set search_path to simfitolab,simfito,eppo,public");

$xls = null;			// oggetto xls
$ws = null;				// oggetto worksheet
$wsj = 2;				// riga corrente nel worksheet
$xlsfiles = array();	// nomi dei files xls parziali

$deltax = 100;
$deltay = 0;
$empty_coord = '--';

// i pest da processare
$pests = array(
	'1ALECG','1DACUG','ALECBA','ALECCN','ALECCO','ALECCT','ALECGA','ALECHU',
	'ALECIN','ALECMA','ALECNG','ALECNI','ALECNU','ALECOB','ALECPI','ALECRU',
	'ALECSI','ALECSN','ALECSO','ALECSP','ALECWO','ALECZI','ANOLCN','ANOLGL',
	'ANTHEU','AROMBU','BURSXY','CORBSE','CTV000','DACUBI','DACUCI','DACUFE',
	'DACUFR','DACUHA','DACUHU','DACULO','DACUNE','DACUPE','DACUSP','EPIXAB',
	'EPIXAL','EPIXAR','EPIXAT','EPIXCA','EPIXCU','EPIXDI','EPIXFA','EPIXFS',
	'EPIXFU','EPIXIN','EPIXNC','EPIXNG','EPIXPA','EPIXPI','EPIXPR','EPIXPU',
	'EPIXSI','EPIXSP','EPIXSU','EPIXTU','GEOHMO','GUIGCI','HETDPA','HETDRO',
	'MONCAL','MONCCA','MONCCL','MONCGA','MONCGP','MONCGR','MONCIM','MONCMC',
	'MONCMR','MONCNI','MONCNM','MONCNO','MONCOB','MONCOR','MONCRB','MONCRU',
	'MONCSA','MONCSB','MONCSC','MONCSL','MONCSP','MONCSR','MONCST','MONCSU',
	'MONCTI','MONCUR','MONCVE','PHYP64','PISOAP','PISOCE','PISODU','PISOEN',
	'PISOFA','PISOHA','PISOMU','PISONE','PISONI','PISONO','PISOOB','PISOPC',
	'PISOPN','PISOPP','PISORA','PISORO','PISOSC','PISOSI','PISOSP','PISOST',
	'PISOSW','PISOTE','PISOVA','PITOJU','PSDMAK','PSDMS1','PSDMS2','PSDMS3',
	'RALSSO','SCAPLI','SYNCEN','TOLCND','TOXOCI','XYLEFA','XYLEFM','XYLEFP',
	'XYLEFS','PHILSU',

	'TETTVI','PHILSP','1PHILG','DACUDO'
);

$macropests = array(

	"Aleurocanthus spp." => array(
		'1ALECG','ALECBA','ALECCN','ALECCT',
		'ALECCO','ALECGA','ALECHU','ALECIN',
		'ALECMA','ALECNG','ALECNI','ALECNU',
		'ALECOB','ALECPI','ALECRU','ALECSI',
		'ALECSP','ALECSN','ALECSO','ALECWO',
		'ALECZI'
	),
	"ANOPLOPHORA CHINENSIS" => array('ANOLCN'),
	"ANOPLOPHORA GLABRIPENNIS" => array('ANOLGL'),
	"Anthonomus eugenii" => array('ANTHEU'),
	"AROMIA BUNGII" => array('AROMBU'),
	"BURSAPHELENCHUS XYLOPHILUS" => array('BURSXY'),
	"Citrus tristeza virus" => array('CTV000'),
	"Clavibacter michiganense subsp. sepedonicus" => array(CORBSE),
	"Dacus dorsalis" => array(
		'1DACUG','DACUBI','DACUCI','DACUFE',
		'DACUFR','DACUHA','DACUHU','DACULO',
		'DACUNE','DACUPE','DACUSP'
	),

	"Epitrix cucumeris, Epitrix similaris, ecc" => array(
		'EPIXAB','EPIXAL','EPIXAR','EPIXAT',
		'EPIXCA','EPIXCU','EPIXDI','EPIXFA',
		'EPIXFS','EPIXFU','EPIXPA','EPIXIN',
		'EPIXNC','EPIXNG','EPIXPI','EPIXPR',
		'EPIXPU','EPIXSI','EPIXSP','EPIXSU',
		'EPIXTU'
	),
	"Globodera rostochiensis, Globodera pallida" => array('HETDPA','HETDRO'),
	"Grapevine flavescenza doree" => array('PHYP64'),
	"MONOCHAMUS SPP. (non europei)" => array(
		'MONCAL','MONCCA','MONCCL','MONCGA',
		'MONCGP','MONCGR','MONCIM','MONCMR',
		'MONCMC','MONCNI','MONCNO','MONCNM',
		'MONCOB','MONCOR','MONCRB','MONCRU',
		'MONCSL','MONCSA','MONCSR','MONCSC',
		'MONCST','MONCSP','MONCSB','MONCSU',
		'MONCTI','MONCUR','MONCVE'
	),
	"CICADELLA VIRIDIS" => array('TETTVI'),
	"Philaenus spumarius"=> array('PHILSU'),
	"Philaenus sp"=> array('PHILSP'),
	"Philaenus"=> array('1PHILG'),
	"Phyllosticta citricarpa" => array('GUIGCI'),
	"Pissodes spp (non-European)" => array(
		'PISOAP','PISONO','PISOCE','PISODU',
		'PISOEN','PISOFA','PISOHA','PISOMU',
		'PISONE','PISONI','PISOOB','PISOPC',
		'PISOPN','PISOPP','PISORA','PISORO',
		'PISOSC','PISOSW','PISOSI','PISOSP',
		'PISOST','PISOTE','PISOVA'
	),
	"Pityophthorus juglandis - Geosmithia morbida" => array('GEOHMO','PITOJU'),
	"Pseudomonas syringae pv. actinidiae" => array('PSDMAK'),
	"Ralstonia solanacearum" => array('RALSSO','PSDMS1','PSDMS2','PSDMS3'),
	"Scaphoideus titanus" => array('SCAPLI'),
	"Synchytrium endobioticum" => array('SYNCEN'),
	"ToLCNDV" => array('TOLCND'),
	"Toxoptera citricida" => array('TOXOCI'),
	"XYLELLA FASTIDIOSA" => array('XYLEFA'),
	"XYLELLA FASTIDIOSA subsp MULTIPLEX" => array('XYLEFM'),
	"XYLELLA FASTIDIOSA subsp PAUCA" => array('XYLEFP'),
	"XYLELLA FASTIDIOSA subsp SANDYI" => array('XYLEFS'),
	"BACTROCERA" => array('DACUDO')
);

$cols = array(
	"name of technician",
	"n.report",
	"date",
	"host",
	"tipology of area or location",
	"farm type",
	"geog. coord. x",
	"geog. coord. y",
	"..","..","..","..",
	"sup. [ha]",
	"n. tree",
	"n. sites",
	"n. hours",
	"n. samples",
	"sample's code",
	"sample's hours",
	"trap id",
	"trap. code",
	"trap typology",
	"trap coll. hours",
	"tipology of test",
	"n. test",
	"results",
	"n. cert.",
	"site sup.[ha]",
	"sforamento area"
);

$sep = "<br>";
$starttbl = "<table border=1>";
$comma = "</td><td>";
$pre = "<tr><td>";
$post = "</td></tr>";
$stoptbl = "</table>";

function datastart($name,$detail) {
global $mode;
global $sep,$starttbl;
global $xls,$ws,$wsj,$xlsfiles;
	$fname = "$name.xlsx";
	$xlsfiles[] = $fname;
	switch($mode) {
	case 'html':
		echo "<b>PEST $name</b>:$sep($detail)$sep";
		echo $starttbl;
	break;
	case 'xls':
		@unlink("/tmp/$fname");
		$xls = new PHPExcel;
		$xls->setActiveSheetIndex(0);
		$ws = $xls->getActiveSheet();
		$wsj = 2;
	break;
	}
}

function dataheader($cols) {
global $mode;
global $pre,$post,$comma;
global $xls,$ws,$wsj;
	switch($mode) {
	case 'html':
		echo "$pre";
		for($i=0;$i<count($cols);$i++) {
			echo $cols[$i];
			if ($i<(count($cols)-1))
				echo $comma;
		}
		echo "$post";
	break;
	case 'xls':
		for($i=0;$i<count($cols);$i++) {
			$ws->setCellValueByColumnAndRow($i,$wsj,$cols[$i]);
		}
		$wsj++;
	break;
	}
}

function datarow($row) {
global $mode;
global $pre,$post,$comma;
global $xls,$ws,$wsj;
	switch($mode) {
	case 'html':
		echo "$pre";
		for($i=0;$i<count($row);$i++) {
			echo $row[$i];
			if ($i<(count($row)-1))
				echo $comma;
		}
		echo "$post";
	break;
	case 'xls':
		for($i=0;$i<count($row);$i++) {
			if ($row[$i]!='')
				$ws->setCellValueByColumnAndRow($i,$wsj,$row[$i]);
			else
				$ws->setCellValueByColumnAndRow($i,$wsj,'');

		}
		$wsj++;
	break;
	}
}

function datadone() {
global $mode;
global $stoptbl,$sep;
global $xls,$ws,$wsj,$xlsfiles;
	switch($mode) {
	case 'html':
		echo $stoptbl;
		echo $sep;
	break;
	case 'xls':
		$fname = $xlsfiles[count($xlsfiles)-1];
		$ffname = "/tmp/$fname";
		$xlsWriter = new PHPExcel_Writer_Excel2007($xls);
		$xlsWriter->save($ffname);
	break;
	}
}

function postprocess() {
global $mode;
global $xls,$ws,$wsj,$xlsfiles;
	switch($mode) {
	case 'html':
		;
	break;
	case 'xls':
		$filename = "/tmp/report.zip";
		@unlink("/tmp/report.zip");
		$zip = new ZipArchive();
		if ($zip->open($filename, ZipArchive::CREATE)!==TRUE) {
    		echo "cannot open <$filename>\n";
			return -1;
		}
		$n = 0;
		foreach($xlsfiles as $i=>$f) {
			// echo "PP $ff<br>";
			$ff = "/tmp/$f";
			$zip->addFile($ff,$f);
			$n++;
		}
		$zip->close();

		header('Content-Type: application/octet-stream');
		header('Content-Disposition: attachment; filename="report.zip"');

		readfile($filename);

		return $n;
	break;
	}
}


$grouped = true;

$evaluate_sectecnici = true;

//
// parametri di configurazione utente
//
$mode = ( isset($_REQUEST['mode']) ? $_REQUEST['mode'] : 'html' );						// allowed : 'html', 'xls'
$xmode = ( isset($_REQUEST['xmode']) ? $_REQUEST['xmode'] : '' );
$dailyhours = '480.0';	// numero di ore lavorative giornaliero ( mettere il .0 !! )
$maxduration = '120.0';	// durata massima in minuti
$start = (isset($_REQUEST['start']) ? $_REQUEST['start'] : '2017-01-01' );	// data iniziale
$end = (isset($_REQUEST['end']) ? $_REQUEST['end'] : '2017-12-31' );	// data finale


if ($mode!='xls')
	echo "<b>DALLA DATA $start ALLA DATA $end</b><br>";

// prepara la lista dei pest da gestire
$allpests = '';
foreach($pests as $pest)
	$allpests .= "'$pest',";
$allpests = substr($allpests,0,-1);


if ($evaluate_sectecnici) {

	$sql = "with x as (
select scheda.idscheda,id_tecnico,data_sopralluogo
from osservazioni
inner join scheda on osservazioni.idscheda=scheda.idscheda
where pestcode in ($allpests)
	and data_sopralluogo>='$start' and data_sopralluogo<='$end'
union all
select scheda.idscheda,schede_tecnici.id_tecnico,data_sopralluogo
from osservazioni
inner join scheda on osservazioni.idscheda=scheda.idscheda
inner join schede_tecnici on scheda.idscheda=schede_tecnici.idscheda
where pestcode in ($allpests)
	and data_sopralluogo>='$start' and data_sopralluogo<='$end'
)
select tecnici.id_tecnico,cognome,nome,data_sopralluogo,count(*) as num_osservazioni,floor(case when $dailyhours/count(*)>$maxduration then $maxduration else $dailyhours/count(*) end) as duration
from x
inner join tecnici on x.id_tecnico=tecnici.id_tecnico
group by tecnici.id_tecnico,cognome,nome,data_sopralluogo
order by cognome,nome,data_sopralluogo desc";

}
else {

	$sql = "select tecnici.id_tecnico,cognome,nome,data_sopralluogo,count(*) as num_osservazioni,floor(case when $dailyhours/count(*)>$maxduration then $maxduration else $dailyhours/count(*) end) as duration
from osservazioni
inner join scheda on osservazioni.idscheda=scheda.idscheda
inner join tecnici on scheda.id_tecnico=tecnici.id_tecnico
where pestcode in ($allpests) and data_sopralluogo>='$start' and data_sopralluogo<='$end'
group by tecnici.id_tecnico,cognome,nome,data_sopralluogo
order by cognome,nome,data_sopralluogo desc";

}

/*

QUERY VARIE DI TENTATIVO E TEST

with x as (
select scheda.idscheda,id_tecnico,data_sopralluogo
from osservazioni
inner join scheda on osservazioni.idscheda=scheda.idscheda
where pestcode in ($allpests)
	and data_sopralluogo>='$start' and data_sopralluogo<='$end'
union all
select scheda.idscheda,schede_tecnici.id_tecnico,data_sopralluogo
from osservazioni
inner join scheda on osservazioni.idscheda=scheda.idscheda
inner join schede_tecnici on scheda.idscheda=schede_tecnici.idscheda
where pestcode in ($allpests)
	and data_sopralluogo>='$start' and data_sopralluogo<='$end'
)
select tecnici.id_tecnico,cognome,nome,data_sopralluogo,count(*) as num_osservazioni,floor(case when $dailyhours/count(*)>$maxduration then $maxduration else $dailyhours/count(*) end) as duration
from x
inner join tecnici on x.id_tecnico=tecnici.id_tecnico
group by tecnici.id_tecnico,cognome,nome,data_sopralluogo
order by cognome,nome,data_sopralluogo desc

-----

WITH
tipiaz as (select azienda_id ,string_agg(descrizione,' , ') as tipi_azienda from azienda_tipoazienda inner join tipoazienda on azienda_tipoazienda.tipoazienda_id=tipoazienda.id group by azienda_id),
xscheda as (
select scheda.* from scheda where scheda.id_tecnico=108
union all
select scheda.* from scheda inner join schede_tecnici on scheda.idscheda=schede_tecnici.idscheda where schede_tecnici.id_tecnico=108
 )
SELECT *,
round(st_x(st_centroid(siti.the_geom))::numeric,5) as x,round(st_y(st_centroid(siti.the_geom))::numeric,5) as y,
round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),$deltax,$deltay),4326))::numeric,5) as x2,round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),$deltax,$deltay),4326))::numeric,5) as y2,
round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-$deltax,$deltay),4326))::numeric,5) as x3,round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-$deltax,$deltay),4326))::numeric,5) as y3,
campioni.codice as campioni_codice,
trappole.id as trappole_id,trappole.codice as trappole_codice,tipo_trappole.descrizione as tipo_trappole_descrizione,
tipo_visita.motivo as tipo_visita_motivo,
case
  when (( osservazioni.campioni_id=-1 or osservazioni.campioni_id is null ) and (osservazioni.rilevato=1) ) then 'Positivo'
  when (( osservazioni.campioni_id=-1 or osservazioni.campioni_id is null ) and (osservazioni.rilevato<>1) ) then 'Negativo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=2) and (analisysresult.positive=1) ) then 'Positivo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=2) and (analisysresult.positive=0) ) then 'Negativo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=3) ) then 'Non applicabile'
  else '' end
as osservazioni_parassitapresente,
report.id as nreferto,
method.name || ' ' || agent.name as typ_analisys,
full_name as hostname,
siti.superficie_ha as siti_superficie_ha
FROM osservazioni
inner join t_baycode on osservazioni.hostcode=t_baycode.b_code
inner join t_bayname on t_baycode.codeid=t_bayname.codeid
inner join xscheda on osservazioni.idscheda=xscheda.idscheda
inner join tipo_visita on xscheda.idtipo_visita=tipo_visita.idtipo_visita
inner join siti on xscheda.gid_sito=siti.gid
inner join azienda on siti.piva_azienda=azienda.partita_iva
left join tipiaz on azienda.id_azienda=tipiaz.azienda_id
left join campioni on osservazioni.campioni_id=campioni.id
left join trappole on osservazioni.idosservazioni=trappole.id_osservazione
left join tipo_trappole on trappole.id_tipo=tipo_trappole.id
LEFT JOIN analisys on osservazioni.idosservazioni=analisys.osservazioni_id
LEFT JOIN analisysresult on analisys.analisysresult_id=analisysresult.id
LEFT JOIN agent on analisys.agent_id=agent.id
LEFT JOIN method on agent.method_id=method.id
LEFT JOIN report on osservazioni.campioni_id=report.campioni_id
where
t_bayname.isolang='la' and t_bayname.preferred=1 and
pestcode in ('1ALECG','ALECBA','ALECCN','ALECCT',
		'ALECCO','ALECGA','ALECHU','ALECIN',
		'ALECMA','ALECNG','ALECNI','ALECNU',
		'ALECOB','ALECPI','ALECRU','ALECSI',
		'ALECSP','ALECSN','ALECSO','ALECWO',
		'ALECZI'
) and data_sopralluogo='2017-07-06'
order by xscheda.idscheda desc

----

with
tipiaz as (select azienda_id ,string_agg(descrizione,' , ') as tipi_azienda from azienda_tipoazienda inner join tipoazienda on azienda_tipoazienda.tipoazienda_id=tipoazienda.id group by azienda_id),
xscheda as (
select scheda.* from scheda where


SELECT *,
round(st_x(st_centroid(siti.the_geom))::numeric,5) as x,round(st_y(st_centroid(siti.the_geom))::numeric,5) as y,
round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as x2,round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as y2,
round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as x3,round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as y3,
campioni.codice as campioni_codice,
trappole.id as trappole_id,trappole.codice as trappole_codice,tipo_trappole.descrizione as tipo_trappole_descrizione,
tipo_visita.motivo as tipo_visita_motivo,
case
  when (( osservazioni.campioni_id=-1 or osservazioni.campioni_id is null ) and (osservazioni.rilevato=1) ) then 'Positivo'
  when (( osservazioni.campioni_id=-1 or osservazioni.campioni_id is null ) and (osservazioni.rilevato<>1) ) then 'Negativo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=2) and (analisysresult.positive=1) ) then 'Positivo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=2) and (analisysresult.positive=0) ) then 'Negativo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=3) ) then 'Non applicabile'
  else '' end
as osservazioni_parassitapresente,
report.id as nreferto,
method.name || ' ' || agent.name as typ_analisys,
full_name as hostname,
siti.superficie_ha as siti_superficie_ha
FROM osservazioni
inner join t_baycode on osservazioni.hostcode=t_baycode.b_code
inner join t_bayname on t_baycode.codeid=t_bayname.codeid
inner join scheda on osservazioni.idscheda=scheda.idscheda
inner join tipo_visita on scheda.idtipo_visita=tipo_visita.idtipo_visita
inner join siti on scheda.gid_sito=siti.gid
inner join azienda on siti.piva_azienda=azienda.partita_iva
left join tipiaz on azienda.id_azienda=tipiaz.azienda_id
left join campioni on osservazioni.campioni_id=campioni.id
left join trappole on osservazioni.idosservazioni=trappole.id_osservazione
left join tipo_trappole on trappole.id_tipo=tipo_trappole.id
LEFT JOIN analisys on osservazioni.idosservazioni=analisys.osservazioni_id
LEFT JOIN analisysresult on analisys.analisysresult_id=analisysresult.id
LEFT JOIN agent on analisys.agent_id=agent.id
LEFT JOIN method on agent.method_id=method.id
LEFT JOIN report on osservazioni.campioni_id=report.campioni_id
where
t_bayname.isolang='la' and t_bayname.preferred=1 and
pestcode in ('1ALECG','ALECBA','ALECCN','ALECCT',
		'ALECCO','ALECGA','ALECHU','ALECIN',
		'ALECMA','ALECNG','ALECNI','ALECNU',
		'ALECOB','ALECPI','ALECRU','ALECSI',
		'ALECSP','ALECSN','ALECSO','ALECWO',
		'ALECZI'
) and scheda.id_tecnico=108 and data_sopralluogo='2017-07-06'

order by scheda.idscheda desc

*/

//echo "SQL: $sql<br>";

$n = 0;
$db->Read($sql);
while($r = $db->fetch_assoc()) {
	//echo "READING $n >> $r[id_tecnico] , $r[cognome] , $r[nome], $r[data_sopralluogo] , $r[num_osservazioni] , $r[duration]$sep";
	$ress[] = $r;
	$n++;
}

//echo "FETCHED $n<br>";
//echo "$sep$sep";

if ($grouped) {
	foreach($macropests as $ipest=>$mpest) {
		$ppests = '';
		foreach($mpest as $pest)
			$ppests .= "'$pest',";
		$ppests = substr($ppests,0,-1);
		datastart($ipest,$ppests);
		dataheader($cols);
		foreach($ress as $idx=>$res) {
			// echo "PROCESSING: $ipest $idx >> $res[id_tecnico] , $res[cognome] , $res[nome] , $res[data_sopralluogo]$sep";
			if ($evaluate_sectecnici) {

				$sql = "WITH
tipiaz as (select azienda_id ,string_agg(descrizione,' , ') as tipi_azienda from azienda_tipoazienda inner join tipoazienda on azienda_tipoazienda.tipoazienda_id=tipoazienda.id group by azienda_id),
xscheda as (
select scheda.* from scheda where scheda.id_tecnico=$res[id_tecnico]
union all
select scheda.* from scheda inner join schede_tecnici on scheda.idscheda=schede_tecnici.idscheda where schede_tecnici.id_tecnico=$res[id_tecnico]
 )
SELECT *,
round(st_x(st_centroid(siti.the_geom))::numeric,5) as x,round(st_y(st_centroid(siti.the_geom))::numeric,5) as y,
round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as x2,round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as y2,
round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as x3,round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as y3,
campioni.codice as campioni_codice,
trappole.id as trappole_id,trappole.codice as trappole_codice,tipo_trappole.descrizione as tipo_trappole_descrizione,
tipo_visita.motivo as tipo_visita_motivo,
case
  when (( osservazioni.campioni_id=-1 or osservazioni.campioni_id is null ) and (osservazioni.rilevato=1) ) then 'Positivo'
  when (( osservazioni.campioni_id=-1 or osservazioni.campioni_id is null ) and (osservazioni.rilevato<>1) ) then 'Negativo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=2) and (analisysresult.positive=1) ) then 'Positivo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=2) and (analisysresult.positive=0) ) then 'Negativo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=3) ) then 'Non applicabile'
  else '' end
as osservazioni_parassitapresente,
report.id as nreferto,
method.name || ' ' || agent.name as typ_analisys,
full_name as hostname,
siti.superficie_ha as siti_superficie_ha
FROM osservazioni
inner join t_baycode on osservazioni.hostcode=t_baycode.b_code
inner join t_bayname on t_baycode.codeid=t_bayname.codeid
inner join xscheda on osservazioni.idscheda=xscheda.idscheda
inner join tipo_visita on xscheda.idtipo_visita=tipo_visita.idtipo_visita
inner join siti on xscheda.gid_sito=siti.gid
inner join azienda on siti.piva_azienda=azienda.partita_iva
left join tipiaz on azienda.id_azienda=tipiaz.azienda_id
left join campioni on osservazioni.campioni_id=campioni.id
left join trappole on osservazioni.idosservazioni=trappole.id_osservazione
left join tipo_trappole on trappole.id_tipo=tipo_trappole.id
LEFT JOIN analisys on osservazioni.idosservazioni=analisys.osservazioni_id
LEFT JOIN analisysresult on analisys.analisysresult_id=analisysresult.id
LEFT JOIN agent on analisys.agent_id=agent.id
LEFT JOIN method on agent.method_id=method.id
LEFT JOIN report on osservazioni.campioni_id=report.campioni_id
where
t_bayname.isolang='la' and t_bayname.preferred=1 and
pestcode in ($ppests) and data_sopralluogo='$res[data_sopralluogo]'
order by xscheda.idscheda desc";

			}
			else {

				$sql = "
with tipiaz as (select azienda_id ,string_agg(descrizione,' , ') as tipi_azienda from azienda_tipoazienda inner join tipoazienda on azienda_tipoazienda.tipoazienda_id=tipoazienda.id group by azienda_id)
SELECT *,
round(st_x(st_centroid(siti.the_geom))::numeric,5) as x,round(st_y(st_centroid(siti.the_geom))::numeric,5) as y,
round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as x2,round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as y2,
round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as x3,round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as y3,
campioni.codice as campioni_codice,
trappole.id as trappole_id,trappole.codice as trappole_codice,tipo_trappole.descrizione as tipo_trappole_descrizione,
tipo_visita.motivo as tipo_visita_motivo,
case
  when (( osservazioni.campioni_id=-1 or osservazioni.campioni_id is null ) and (osservazioni.rilevato=1) ) then 'Positivo'
  when (( osservazioni.campioni_id=-1 or osservazioni.campioni_id is null ) and (osservazioni.rilevato<>1) ) then 'Negativo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=2) and (analisysresult.positive=1) ) then 'Positivo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=2) and (analisysresult.positive=0) ) then 'Negativo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=3) ) then 'Non applicabile'
  else '' end
as osservazioni_parassitapresente,
report.id as nreferto,
method.name || ' ' || agent.name as typ_analisys,
full_name as hostname,
siti.superficie_ha as siti_superficie_ha
FROM osservazioni
inner join t_baycode on osservazioni.hostcode=t_baycode.b_code
inner join t_bayname on t_baycode.codeid=t_bayname.codeid
inner join scheda on osservazioni.idscheda=scheda.idscheda
inner join tipo_visita on scheda.idtipo_visita=tipo_visita.idtipo_visita
inner join siti on scheda.gid_sito=siti.gid
inner join azienda on siti.piva_azienda=azienda.partita_iva
left join tipiaz on azienda.id_azienda=tipiaz.azienda_id
left join campioni on osservazioni.campioni_id=campioni.id
left join trappole on osservazioni.idosservazioni=trappole.id_osservazione
left join tipo_trappole on trappole.id_tipo=tipo_trappole.id
LEFT JOIN analisys on osservazioni.idosservazioni=analisys.osservazioni_id
LEFT JOIN analisysresult on analisys.analisysresult_id=analisysresult.id
LEFT JOIN agent on analisys.agent_id=agent.id
LEFT JOIN method on agent.method_id=method.id
LEFT JOIN report on osservazioni.campioni_id=report.campioni_id
where
t_bayname.isolang='la' and t_bayname.preferred=1 and
pestcode in ($ppests) and scheda.id_tecnico=$res[id_tecnico] and data_sopralluogo='$res[data_sopralluogo]'
order by scheda.idscheda desc";

			}
			//echo "SQL $sql<br>";
			//exit(0);
			$schedacurr='';
			$ccodecurr='';
			$db->Read($sql);
			$n=0;
			while($r = $db->fetch_assoc()) {
				$area = $r['appezzamento']/10000;
				$area_sito = $r['siti_superficie_ha']/10000;
				// idtipovisita "forestale" 3 20 33
				if ( ($r['idtipo_visita']==3 || $r['idtipo_visita']==20 || $r['idtipo_visita']==33) && $area>1.0 ) {
					$x2 = $r['x2'];
					$y2 = $r['y3'];
					$x3 = $r['x3'];
					$y3 = $r['y3'];
				}
				else {
					$x2 = $empty_coord;
					$y2 = $empty_coord;
					$x3 = $empty_coord;
					$y3 = $empty_coord;
				}
				if ($schedacurr==$r[idscheda]) {
					$nsiti='';
					$txtscheda = '';
				}
				else {
					$nsiti='1';
					$txtscheda = $r[idscheda];
					$tot_area = 0;
					$sfora = 'No';
					$tot_area = 0;
				}
				$schedacurr=$r[idscheda];

				if ($ccodecurr==$r['campioni_codice']) {
					$nsamples = '';
				}
				else {
					$nsamples = $r['elementicampione'];
				}
				$ccodecurr=$r['campioni_codice'];

				$tot_area += $area;
				if ($tot_area>$area_sito)
					$sfora = 'Si';
				$trueduration = floor(10*$res[duration]/60)/10;

				if ($r[campioni_codice]!='') {
					if ($trueduration>.1) {
						$sampleduration = .1;
						$trueduration -=  .1;
					}
					else {
						$sampleduration = $trueduration;
						$trueduration = 0.0;
					}
				}
				else {
					$sampleduration = '';
				}

				if ($r[trappole_id]!='') {
					$totalduration = '';
					$trappduration = $trueduration;
				}
				else {
					$totalduration = $trueduration;
					$trappduration = '';
				}
				if ($totalduration==0)
					$totalduration = '';
				if ($trappduration==0)
					$trappduration = '';
				$tecnico = strtoupper("$res[cognome] $res[nome]");
				$typtest = $r['typ_analisys'];
				if ($r['nreferto']!='') {
					$ntest = 1;
					//$xr = $db->FetchRow("select campioni_id,host,pest,count(*) as analisysextra from analisys where osservazioni_id is null and campioni_id=$r[campioni_id] group by campioni_id,host,pest");

				}
				else {
					$ntest = '';
				}
				$risultato = $r['osservazioni_parassitapresente'];		//   osservazioni.rilevato 0 assente 1 presente 2 da verificare
				if ($r['nreferto']=='')
					$nreferto = $r['nreferto'];
				else
					$nreferto = "http://$hostapp/simfitolab/services/report.php?mode=pdf&table=report&idv=$r[nreferto]";

				$row = array(
					$tecnico,
 					$txtscheda,
					$res['data_sopralluogo'],
					$r['hostname'],
					$r['tipo_visita_motivo'],
					$r['tipi_azienda'],
					$r['x'],
					$r['y'],
					$x2,$y2,$x3,$y3,
					$area,
					$r['n_osservate'],
					$nsiti,
					$totalduration,
					$nsamples,
					$r['campioni_codice'],
					$sampleduration,
					$r['trappole_id'],
					$r['trappole_codice'],
					$r['tipo_trappole_descrizione'],
					$trappduration,
					$typtest,
					$ntest,
					$risultato,
					$nreferto,
					$area_sito,
					$sfora
				);
				$n++;
				if($xmode!='nogen')
					datarow($row);
			}
			//echo "got $n rows<br>";
		}
		datadone();
	}
	postprocess();

}
else {
	foreach($pests as $pest) {
		echo "<b>PEST $pest</b>:$sep";
		echo $starttbl;
		echo "$pre tecnico $comma n.report $comma data $comma motivo $comma coord. x $comma coord. y $comma -- $comma -- $comma -- $comma -- $comma";
		echo "area $comma  n.alberi $comma n.siti $comma n.minuti $comma elementi campione $comma codice campione $comma id trappola $comma codice trappola $comma tipo trappola $post" ;
		foreach($ress as $idx=>$res) {
			// echo "PROCESSING: $pest $idx >> $res[id_tecnico] , $res[cognome] , $res[nome] , $res[data_sopralluogo]$sep";
			$sql = "SELECT *,
round(st_x(st_centroid(siti.the_geom))::numeric,5) as x,round(st_y(st_centroid(siti.the_geom))::numeric,5) as y,
round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as x2,round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as y2,
round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as x3,round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as y3,
campioni.codice as campioni_codice,
trappole.id as trappole_id,trappole.codice as trappole_codice,tipo_trappole.descrizione as tipo_trappole_descrizione,
tipo_visita.motivo as tipo_visita_motivo
FROM osservazioni
inner join scheda on osservazioni.idscheda=scheda.idscheda
inner join tipo_visita on scheda.idtipo_visita=tipo_visita.idtipo_visita
inner join siti on scheda.gid_sito=siti.gid
left join campioni on osservazioni.campioni_id=campioni.id
left join trappole on osservazioni.idosservazioni=trappole.id_osservazione
left join tipo_trappole on trappole.id_tipo=tipo_trappole.id
where pestcode='$pest' and id_tecnico=$res[id_tecnico] and data_sopralluogo='$res[data_sopralluogo]'
order by scheda.idscheda desc";
			// echo "SQL $sql$sep";
			$db->Read($sql);
			while($r = $db->fetch_assoc()) {
				$area = $r['appezzamento']/10000;
				// idtipovisita "forestale" 3 20 33
				if ( ($r['idtipo_visita']==3 || $r['idtipo_visita']==20 || $r['idtipo_visita']==33) && $area>1.0 ) {
					$x2 = $r['x2'];
					$y2 = $r['y2'];
					$x3 = $r['x3'];
					$y3 = $r['y3'];
				}
				else {
					$x2 = '--';
					$y2 = '--';
					$x3 = '--';
					$y3 = '--';
				}
				$tecnico = toupper("$res[cognome] $res[nome]");
				echo "$pre $tecnico $comma $r[idscheda] $comma $res[data_sopralluogo] $comma $r[tipo_visita_motivo] $comma $r[x] $comma $r[y] $comma $x2 $comma $y2 $comma $x3 $comma $y3 $comma ";
				echo "$area $comma  $r[n_osservate] $comma -- $comma $res[duration] $comma ";
				echo "$r[elementicampione] $comma $r[campioni_codice] $comma ";
				echo "$r[trappole_id] $comma $r[trappole_codice] $comma $r[tipo_trappole_descrizione] $post" ;
			}
		}
		echo $stoptbl;
		echo "$sep";
	}
}

//echo $sql;


?>
