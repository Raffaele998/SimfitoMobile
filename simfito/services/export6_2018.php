<?php

//
// export per rendicontazione versione !!SENZA!! celle soppresse
//


require_once("../etc/db_config.php");
require_once("crud.php");
require_once('phpexcel/PHPExcel.php');

require_once('export_pest.php');
require_once('export_lib.php');

$connection="host=localhost port=5432 user=postgres password=ariespac3 dbname=simfito4";

$db=new CRUD($connection);
$db->connect();
$db->sQL("set search_path to simfitolab,simfito,eppo,public");

// cerca nella tabella delle durate la coppia tecnico/datasopralluogo
function find_duration($ress,$idtecnico,$datasopralluogo) {
	//echo "match $idtecnico,$datasopralluogo<br>";
	for($i=0;$i<count($ress);$i++) {
		if ($ress[$i]['id_tecnico']==$idtecnico && $ress[$i]['data_sopralluogo']==$datasopralluogo)
			return $ress[$i];
	}
	return null;
}

$xls = null;			// oggetto xls
$ws = null;				// oggetto worksheet
$wsj = 2;				// riga corrente nel worksheet
$xlsfiles = array();	// nomi dei files xls parziali

$coord = "
round(st_x(st_centroid(siti.the_geom))::numeric,5) as x,
round(st_y(st_centroid(siti.the_geom))::numeric,5) as y, 
--round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as x2,
--round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as y2, 
--round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as x3,
--round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as y3, 
";

$mastersql = "with tecnici_full as (
  select idscheda,tecnici.id_tecnico,1 as pri,cognome,nome from scheda inner join tecnici on scheda.id_tecnico=tecnici.id_tecnico 
  union
  select idscheda,tecnici.id_tecnico,2 as pri,cognome,nome from schede_tecnici inner join tecnici on schede_tecnici.id_tecnico=tecnici.id_tecnico
),
tecnici_no as (
	select idscheda,count(*)+1 as tno from schede_tecnici group by idscheda
), 
host as (
  select b_code,full_name from t_baycode 
  inner join t_bayname on t_baycode.codeid=t_bayname.codeid
  where isolang='la' and preferred=1
)
SELECT 
--*
tecnici_full.id_tecnico as idtecnico,cognome || ' ' || nome as tecnico,pri,
coalesce(tecnici_no.tno,1) as tecnici_num,
scheda.idscheda as scheda_idscheda,data_sopralluogo,full_name,pestcode,
$coord
siti.superficie_ha as siti_sup,
osservazioni.sup_vis as sup_vis,
n_osservate,
1 as nsiti,
999 as nhours, 
elementicampione,
campioni.codice as campioni_codice,
0 as sampleduration,
--0 as trap_id,0 as trap_code,0 as trap_typology,
analisyssection.name as test_typology,
method.name as method_name,
0 as testno,
analisysresult.name as results_name,
case analisysresult.positive 
  when 0 then 'Negativo' 
  when 1 then 'Positivo' 
  when 2 then 'Non applicabile' 
  else '' 
end as results,
0 as cert_n,
0 as site_sup
FROM scheda
inner join osservazioni on scheda.idscheda=osservazioni.idscheda
inner join host on osservazioni.hostcode=host.b_code
inner join siti on scheda.gid_sito=siti.gid
inner join tecnici_full on scheda.idscheda=tecnici_full.idscheda
left join tecnici_no on scheda.idscheda=tecnici_no.idscheda 
left join campioni on osservazioni.campioni_id=campioni.id 
left join analisys on campioni.id=analisys.campioni_id and osservazioni.hostcode=analisys.host and osservazioni.pestcode=analisys.pest
left join agent on analisys.agent_id=agent.id
left join method on agent.method_id=method.id 
left join analisyssection on analisys.analisyssection_id=analisyssection.id 
left join analisysresult on analisys.analisysresult_id=analisysresult.id
where 
scheda.stato=2
and data_sopralluogo>='%start%' and data_sopralluogo<='%end%'
and pestcode in (%pest%)
order by scheda.idscheda,full_name,pestcode,pri,cognome,nome";



$report_setup = array(
	array("tecnico","name of technician"),
	array("tecnici_num","no. of technician"),
	array("scheda_idscheda","n.report"),
	array("data_sopralluogo","date"),
	array("full_name","host"),
	array("","tipology of area or location"),
	array("","farm type"),
	array("x","geog. coord. x"),
	array("y","geog. coord. y"),
	array("",".."),
	array("",".."),
	array("",".."),
	array("",".."),
	array("siti_sup","sup. [ha]"),
	array("sup_vis","sup. camp. [ha]"),
	array("n_osservate","n. tree"),
	array("nsiti","n. sites"),
	array("nhours","n. hours"),
	array("sampleduration","sample n. hours"),
	array("elementicampione","n. samples"),
	array("campioni_codice","sample's code"),
	array("","trap id"),
	array("","trap. code"),
	array("","trap typology"),
	array("","trap coll. hours"),
	array("test_typology","tipology of test"),
	array("method_name","method of test"),
	array("testno","n. test"),
	array("results","results"),
	array("","n. cert."),
);

// colonne emesse dal report
$cols = array();
// i campi nella query corrispondenti ( DEVONO andare di pari passo )
$fields = array();

for($i=0;$i<count($report_setup);$i++) {
	$cols[] = $report_setup[$i][1];
	$fields[] = $report_setup[$i][0];
}

//
// parametri di configurazione utente
//
$dailyhours = '480.0';	// numero di ore lavorative giornaliero ( mettere il .0 !! )
$maxduration = '120.0';	// durata massima in minuti
$deltax = 100;
$deltay = 0;
$empty_coord = '--';
//
// parametri di input
//
$mode = ( isset($_REQUEST['mode']) ? $_REQUEST['mode'] : 'xls' );			// allowed : 'html', 'xls'
$start = (isset($_REQUEST['start']) ? $_REQUEST['start'] : '2018-01-01' );	// data iniziale
$end = (isset($_REQUEST['end']) ? $_REQUEST['end'] : '2018-06-30' );		// data finale
$debug = ( isset($_REQUEST['debug']) ? true : false );						// debug mode


// -- codice -- 

if ($mode!='xls')
	echo "<b>MODE '$mode' DALLA DATA $start ALLA DATA $end</b><br>";

// prepara la lista dei pest da gestire
$allpests = '';
foreach($pests as $pest)
	$allpests .= "'$pest',";
$allpests = substr($allpests,0,-1);

	$sql = "with x as (
select scheda.idscheda,id_tecnico,data_sopralluogo
from osservazioni
inner join scheda on osservazioni.idscheda=scheda.idscheda
where pestcode in ($allpests) 
	and data_sopralluogo>='$start' and data_sopralluogo<='$end' and scheda.stato=2
union all
select scheda.idscheda,schede_tecnici.id_tecnico,data_sopralluogo
from osservazioni
inner join scheda on osservazioni.idscheda=scheda.idscheda
inner join schede_tecnici on scheda.idscheda=schede_tecnici.idscheda
where pestcode in ($allpests) 
	and data_sopralluogo>='$start' and data_sopralluogo<='$end' and scheda.stato=2
)
select tecnici.id_tecnico,cognome,nome,data_sopralluogo,count(*) as num_osservazioni,floor(case when $dailyhours/count(*)>$maxduration then $maxduration else $dailyhours/count(*) end) as duration
from x
inner join tecnici on x.id_tecnico=tecnici.id_tecnico
group by tecnici.id_tecnico,cognome,nome,data_sopralluogo
order by cognome,nome,data_sopralluogo";


	if ($mode!='xls')
		echo "<b>SQL 1:</b> $sql<br>";

	$n = 0;
	$restd = array();
	$db->Read($sql);
	while($r = $db->fetch_assoc()) {
		//echo "READING $n >> $r[id_tecnico] , $r[cognome] , $r[nome], $r[data_sopralluogo] , $r[num_osservazioni] , $r[duration]$sep";
		$restd [] = $r;
		$n++;
	}

	if (true && $mode!='xls') {
		echo "FETCHED $n<br>";
		tabledump("Info tecnici",$restd);
		echo "$sep$sep";
	}

	foreach($macropests as $ipest=>$mpest) {
		$ppests = '';
		foreach($mpest as $pest)
			$ppests .= "'$pest',";
		$ppests = substr($ppests,0,-1);

		$sql = str_replace('%start%',$start,$mastersql);
		$sql = str_replace('%end%',$end,$sql);
		$sql = str_replace('%pest%',$ppests,$sql);

		if ($mode!='xls')
			echo "<b>SQL 2:</b> $sql<br>";

		$n = 0;
		$ress = array();
		$db->Read($sql);
		$r_prev = array();
		while($r = $db->fetch_assoc()) {
			$extr = find_duration($restd,$r['idtecnico'],$r['data_sopralluogo']);
			if (false && $mode!='xls') {
				var_dump($extr);echo "<br>";
			}
			$r['nhours'] = round($extr['duration']/60.0,2);
			if ($r['campioni_codice']!='') {
				$r['sampleduration'] = 0.1;
				$r['testno'] = 1;
				$r['nhours'] -= 0.1; 
			}
			if ($r['pri']>1) {
				$r['sup_vis'] = '';
				$r['n_osservate'] = '';
				$r['elementicampione'] = '';
				$r['campioni_codice'] = '';
				$r['testno'] = 0;
				$r['tecnici_num'] = ''; 
			}
			if($r['scheda_idscheda']==$r_prev['scheda_idscheda']) {
				$r['nsiti'] = '';
			}
			$ress[] = $r;
			$r_prev = $r;
			$n++;
		}
		if ($mode!='xls') {
			echo "FETCHED $n<br>";
			tabledump("Schede",$ress);
			echo "$sep$sep";
		}
		else {
			datastart($ipest,'');
			dataheader($cols);
			foreach($ress as $row) {
				datarow($row,$fields);
			}
			datadone();

		}
		
	}
	postprocess();

/*

with tecnici_full as (
  select idscheda,tecnici.id_tecnico,1 as pri,cognome,nome from scheda inner join tecnici on scheda.id_tecnico=tecnici.id_tecnico 
  union
  select idscheda,tecnici.id_tecnico,2 as pri,cognome,nome from schede_tecnici inner join tecnici on schede_tecnici.id_tecnico=tecnici.id_tecnico
),
host as (
  select b_code,full_name from t_baycode 
  inner join t_bayname on t_baycode.codeid=t_bayname.codeid
  where isolang='la' and preferred=1
)
select 
*  
from scheda
inner join tecnici_full on scheda.idscheda=tecnici_full.idscheda
inner join osservazioni on scheda.idscheda=osservazioni.idscheda
left join campioni on osservazioni.campioni_id=campioni.id 
inner join host on osservazioni.hostcode=host.b_code
where 
scheda.stato=2
and data_sopralluogo>='%start%' and data_sopralluogo<='%end%'
and pestcode in (%host%)
order by scheda.idscheda,cognome,nome,full_name

*/


?>
