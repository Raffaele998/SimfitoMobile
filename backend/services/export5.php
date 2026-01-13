<?php

//
// export per rendicontazione versione !!SENZA!! celle soppresse versione 2019
// nuovo raggruppamento dei dati
//

require_once("../etc/db_config.php");
require_once("crud.php");
require_once('phpexcel/PHPExcel.php');

require_once('export_pest.php');
require_once('export_lib.php');

$connection="host=localhost port=5432 user=postgres password=ariespac3 dbname=simfito4";

$kill = '-k-';
$null = '-n-';
$zero = '-0-';

$db=new CRUD($connection);
$db->connect();
$db->SQL("set search_path to simfitolab,simfito,eppo,public");

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

//$coord = "
//round(st_x(st_centroid(siti.the_geom))::numeric,5) as x,
//round(st_y(st_centroid(siti.the_geom))::numeric,5) as y, 
//--round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as x2,
//--round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),90,20),4326))::numeric,5) as y2, 
//--round(st_x(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as x3,
//--round(st_y(st_transform(st_translate(st_transform(st_centroid(siti.the_geom),32633),-85,30),4326))::numeric,5) as y3, 
//";

$coord = "
round(st_x(st_centroid(siti.the_geom))::numeric,5) as x,
round(st_y(st_centroid(siti.the_geom))::numeric,5) as y, 
";

/*
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
tecnici_full.id_tecnico as idtecnico,cognome || ' ' || nome as tecnico,pri,
coalesce(tecnici_no.tno,1) as tecnici_num,
scheda.idscheda as scheda_idscheda,data_sopralluogo,full_name,pestcode,

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
	array("agent_name","method of test"),			// ERA: method_name
	array("testno","n. test"),
	array("results","results"),
	array("","n. cert."),
);

*/


include_once('export5_qry.php');

//!! NOTA BENE : i campi __xxxx sono ottenuti in fase di postprocessing e non con la query
$report_setup = array(
	array('tecnici_nome','Name of inspector'),							// A
	array('protocollo','ID trip authorization'),						// B
	array('idscheda','ID monitoring report'), 							// C
	array('data_sopralluogo','Date'), 									// D
	array('tipovisita_motivo','tipology of area or location'),	// E era tipologiasito_description
    array('scheda_motivo','motivo ispezione'),							// F
    array('comuni_comune','comune'),									// G 
    array('comuni_provincia','provincia'),								// H
	array('x','Geographical coordinates x'),							// I
	array('y','Geographical coordinates y'),							// J
	array('',''),														// K
	array('',''),														// L
	array('',''),														// M
	array('',''),														// N
	array('s_ha','sup (ha)'),											// O
	array('oss_sup_vis_ha_x','sup vis (ha)'),							// P
	array('hosts','Host'),												// Q
	array('n_osservate_tot','N. trees'),								// R
	array('n_monitoraggio','N. survey'),								// S
//	array('tempo_tot','A N. hours'),									// 
//	array('tecnici_no','B N. hours'),								
	array('full_tempo_tot','Visual inspections - N. hours'),			// T
	array('costo_orario_avg','Visual inspections - Unit cost'),			// U
	array('costo_tot','Visual inspections - Total cost'),				// V !!! =full_tempo_tot*costo_orario_avg
	array('campioni_no','N. samples'),									// W
	array('campionicodice','Samples code'),								// X
	array('tipocampione','Typology of samples'),						// Y
	array('','Consumable cost'),										// Z
	array('sample_duration','Sample tacking - N. hours'),				// AA
	array('__sample_costo_orario_avg','Sample tacking - Unit cost'),	// AB
	array('__sample_tot_pers_cost','Sample tacking - Total personal cost'),	// AC
//	array('','Sample tacking - Total cost'),							// 
	array('trap_codice','Trapping - Trap code'),						// AD
	array('tipo_trappole_descr_en','Trapping - Tipology'),				// AE
	array('trap_no','Trapping - N. traps placed'),						// AF
	array('','Trapping - Unit cost'),									// AG
//	array('','Trapping - Total cost'),									// 
	array('','Trapping - N. attractant'),								// AH
	array('','Trapping - Unit cost'),									// AI	
//	array('','Trapping - Total cost'),									// 
//	array('','Trapping - Total cost consumable'),				
	array('trap_tempo_tot','Placing trap - N. hours'),					// AJ
	array('trap_costo','Placing trap - Unit cost'),						// AK
	array('trap_costo_tot','Placing trap - Total cost'),				// AL
	array('__trap_control_tempo','Control of traps - N. hours'),		// AM
	array('__trap_control_costo_orario_avg','Control of traps - Unit cost'),	// AN
	array('__trap_control_costo_tot','Control of traps - Total cost'),	// AO
	array('','Collecting traps - N. hours'),							// AP
	array('','Collecting traps - Unit cost'),							// AQ
//	array('','Collecting traps - Total cost'),						
//	array('','Traps - Total cost'),
	array('campionicodice','Testing - Sample code'),					// AR
	array('agent_name','Testing - Tipology of test'),					// AS ERA: method_name
	array('analisys_no','Testing - N. test'),							// AT
	array('','Testing - Unit cost'),									// AU
//	array('','Testing - Total cost'),
	array('ar5','Result of survey'),									// AV
	array('analisys_pos_no','Sum positive'),							// AX
	array('analisys_no','Total'),										// AY
	array('','Note'),													// AW
	array('oss_note','Oss. note'),										// AZ
	array('report_link','Report link')									// BA
);

// le colonne emesse dal report
// e i campi nella query corrispondenti ( DEVONO andare di pari passo )
$cols = array();
$fields = array();
for($i=0;$i<count($report_setup);$i++) {
	$fields[] = $report_setup[$i][0];
	$cols[] = $report_setup[$i][1];
}

//
// parametri di configurazione utente
//
$dailyhours = '480.0';	// numero di ore lavorative giornaliero ( mettere il .0 !! )
$maxduration = '120.0';	// durata massima in minuti
$deltax = 100;
$deltay = 0;
$empty_coord = '--';

$static_data = true;	// le informazioni sui report/pest sono statiche 

//
// parametri di input
//
$mode = ( isset($_REQUEST['mode']) ? $_REQUEST['mode'] : 'xls' );			// allowed : 'html', 'xls'
$start = (isset($_REQUEST['start']) ? $_REQUEST['start'] : '2019-01-01' );	// data iniziale
$end = (isset($_REQUEST['end']) ? $_REQUEST['end'] : '2019-06-30' );		// data finale
$debug = ( isset($_REQUEST['debug']) ? true : false );						// debug mode

$year = substr($start,0,4);

//echo "cippa'$year'<br>";

if ($collect_from_db) {

	$sql = "select coalesce(max(anno),-1) as myear from simfito.reportue where anno<=$year";
//	echo "$sql<br>";
	$res = pg_query($sql);
//	echo pg_num_rows($res) . "<br>";
	if (pg_num_rows($res)==0) {
		echo "<b>Non sono disponibili dati per l'anno '$year'</b>";
		exit(0);
	}
	else {
		$r = pg_fetch_assoc($res);
		if ($r['myear']==-1) {
			echo "<b>Non sono disponibili dati per l'anno '$year'</b>";
			exit(0);
		}	
		else {
			$yearx = $r['myear']; 
			$cc = collect_pests($yearx);
			$pests = $cc[0];
			$macropests = $cc[1];
		}
	}
}

//var_dump($pests);echo "<br>";
//var_dump($macropests);echo "<br>";
//exit(0);

//
// -- codice -- 
//
if ($mode!='xls')
	echo "<b>MODE '$mode' DALLA DATA $start ALLA DATA $end</b><br>";


if (!$static_data) {
}

// prepara la lista dei pest da gestire
$allpests = '';
foreach($pests as $pest)
	$allpests .= "'$pest',";
$allpests = substr($allpests,0,-1);

// prepasso, 
	$sql = "WITH x as (
SELECT scheda.idscheda,id_tecnico,data_sopralluogo
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
		$restd[] = $r;
		$n++;
	}

	if (true && $mode!='xls') {
		echo "FETCHED $n<br>";
//		tabledump("Info tecnici",$restd);
		echo "$sep$sep";
	}

	foreach($macropests as $ipest=>$mpest) {
		$ppests = '';
		foreach($mpest as $pest)
			$ppests .= "'$pest',";
		$ppests = substr($ppests,0,-1);

		// dati principali
		$sql = str_replace('%start%',$start,$mastersql);
		$sql = str_replace('%end%',$end,$sql);
		$sql = str_replace('%pest%',$ppests,$sql);

		// dati per le trappole
		$sqltr = str_replace('%start%',$start,$trappolesql);
		$sqltr = str_replace('%end%',$end,$sqltr);
		$sqltr = str_replace('%pest%',$ppests,$sqltr);

		if ($mode!='xls')
			echo "<b>PEST $ipest <br>SQL MASTER:</b><br><pre>$sql</pre><br><b>SQL TRAPPOLE:</b><br><pre>$sqltr</pre><br>";

		$n = 0;
		$ress = array();
		// la parte principale
		$db->Read($sql);
		$r_prev = array();
		while($r = $db->fetch_assoc()) {
			//var_dump($r);echo "<br>";
			$extr = find_duration($restd,$r['idtecnico'],$r['data_sopralluogo']);
			if (false && $mode!='xls') {
				var_dump($extr);echo "<br>";
			}
			$r['nhours'] = round($extr['duration']/60.0,2);
//			if ($r['campionicodice']!='') {
//				$r['sampleduration'] = 0.1;
//				$r['testno'] = 1;
//				$r['nhours'] -= 0.1; 
//			}
//			if ($r['pri']>1) {
//				$r['sup_vis'] = '';
//				$r['n_osservate'] = '';
//				$r['elementicampione'] = '';
//				$r['campionicodice'] = '';
//				$r['testno'] = 0;
//				$r['tecnici_num'] = ''; 
//			}
			if ($r['idscheda']==$r_prev['idscheda']) {
				$r['nsiti'] = $null;
				$r['n_monitoraggio'] = $null;
				$r['s_ha'] = $null;
//				$r['full_tempo_tot'] = '';
				$r['s_ha'] = '';
//				echo "<b>$n match</b> '$r[idscheda]' '$r_prev[idscheda]'<br>";
				if ($r['campionicodice']==$r_prev['campionicodice']) {
					$r['campioni_no']=$null;
				}
			}
			if ($r['oss']==$r_prev['oss']) {
				$r['n_osservate_tot'] = $null;
				$r['tempo_tot'] = $null;
				$r['costo_tot'] = $null;
			}
			if ($r['sample_duration']!='') {
				$r['__sample_costo_orario_avg'] = $r['costo_orario_avg'];
				$r['__sample_tot_pers_cost'] = $r['costo_orario_avg']*$r['sample_duration'];
			}
			else {
				$r['__sample_costo_orario_avg'] = $null;
				$r['__sample_tot_pers_cost'] = $null;
			}
			if ($r['trap_no']!=0) {
				$r['__trap_control_tempo'] = $r['full_tempo_tot'];
				$r['__trap_control_costo_orario_avg'] = $r['costo_orario_avg'];
				$r['__trap_control_costo_tot'] = $r['costo_tot'];

				$r['full_tempo_tot'] = 0;
				$r['costo_orario_avg'] = 0;
				$r['costo_tot'] = 0;
			}
			else {
				$r['__trap_control_tempo'] = $zero;
				$r['__trap_control_costo_orario_avg'] = $zero;
				$r['__trap_control_costo_tot'] = $zero;
			}
			$ress[] = $r;
			$r_prev = $r;
			$n++;
		}
		if ($mode!='xls') {
			echo "N MASTER $n<br>";
			tabledump('master',$ress);
		}
		// la parte sulle trappole
		$nt = 0;
		$rest = array();
		$db->Read($sqltr);
		$r_prev = array();
		while($r = $db->fetch_assoc()) {
			$rest[] = $r;
			$n++;
			$nt++;
		}
		if ($mode!='xls') {
			echo "N TOTALE $n N TRAPPOLE $nt<br>";
		}
		if ($mode!='xls') {
			echo "FETCHED $n<br>";
			if ($mode=='dump') {
				tabledump("Schede",$ress);
				echo "$sep$sep";
			}
		}
		else {
			// accumula i risultati
			$resxx = array();
			for($i=0;$i<count($rest);$i++) {
				$resxx[] = $rest[$i];
			}
			for($i=0;$i<count($ress);$i++) {
				$resxx[] = $ress[$i];
			}
			datastart($ipest,'');
			dataheader($cols);
			foreach($resxx as $row) {
				datarow($row,$fields);
			}
			datadone();
		}
	}
	postprocess();

/*

WITH tecnici_full as (
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
