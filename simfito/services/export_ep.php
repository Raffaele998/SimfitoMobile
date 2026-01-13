<?php
session_start();

require_once("../etc/db_config.php");
require_once("crud.php");
require_once('phpexcel/PHPExcel.php');

function exec_from_cli() {
	return php_sapi_name()=='cli';
}

function months($m) {
$src = ['12','11','10','9','8','7','6','5','4','3','2','1'];
$dst = ['December','November','October','September','August','July','June','May','April','March','February','January'];
	$mm = str_replace(',','; ',str_replace($src,$dst,$m));
	return $mm;
}
//$mt = '1,2,3,4,5,6,7,8,9,10,11,12';
//echo months($mt) . '<br>';

function xls_launch($jobid) {
	exec("php export_ep.php $jobid >/dev/null 2>/dev/null &");
}

function csv_launch($jobid) {
	exec("php export_ep.php $jobid >/dev/null 2>/dev/null &");
}

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
$db->SQL("set search_path to simfitolab,simfito,eppo,public");

	if (exec_from_cli()) {
		echo "EXEC FROM CLI\n";
		$jobid = $argv[1];
		$sql = "SELECT * from simfito.reports WHERE id=$jobid";
		echo "$sql\n";
		$r = $db->FetchRow($sql);
		echo json_encode($r) . "\n";
		echo $r['query'] . "\n";
		$_REQUEST = json_decode($r['query'],true);
		if ($_REQUEST['mode']== 'xlsasync') { 	 
			$_REQUEST['mode'] = 'xls';  
			$xlsout = $_SERVER['PWD'] . "/../data/$jobid.xls";
		}		
		else if ($_REQUEST['mode']== 'csvasync') { 	 
			$_REQUEST['mode'] = 'csv';  
			$csvout = $_SERVER['PWD'] . "/../data/$jobid.csv";
		}		
	}
	else {
		$csvout='php://output';
		$xlsout='php://output';
	}

$year = ( isset($_REQUEST['anno']) ? $_REQUEST['anno'] : 2023 );
$mode = ( isset($_REQUEST['mode']) ? $_REQUEST['mode'] : 'csv' );

$ruopmode = ( isset($_REQUEST['ruopmode']) ? $_REQUEST['ruopmode'] : 'all' );
$xpests = ( isset($_REQUEST['pest']) ? $_REQUEST['pest'] : '' );

if ($ruopmode=='all') {
	$ruopfilt = 'true';
}
else if ($ruopmode=='ruop') {
	$ruopfilt = "ts.description ilike '%RUOP%'";
}
else if ($ruopmode='noruop') {
	$ruopfilt = "(not ts.description ilike '%RUOP%')";
}
else {
	$ruopfilt = 'true';
}

// lista dei pest abilitati
if ($xpests=='')
	$pests = "'AGRLAX','AGRLPL','ALECSN','ANSTLU','ANOLCN','ANOLGL','ANTHEU','ANTHGR','AROMBU','PARZCO','DACUDO','DACUZO','BURSXY','LIBEAF','LIBEAM','LIBEAS','PHYPPH','CERAFP','CARNFU','DRAEMI','GRCPAT','HOMLTR','CTV000','CORBSE','CONHNE','DACLPI','1CRONG','CRONSP','CORBFL','DENDSI','DIABLO','DIABUH','DIABUN','DIABVZ','EOTELE','EPIXCU','EPIXPP','EPIXSU','EPIXTU','ERWIAM','GIBBCI','ERSHMU','GEOHMO','HETDPA','HETDRO','PHYP64','SCAPLI','GYMNSP','GYMNAS','GYMNCL','GYMNGL','GYMNJV','GYMNYA','GNORLY','LIRISA','MARGPR','MARGVI','MARGVR','MELGCH','MELGFA','MELGGC','1MONCG','MONCGA','MONCSP','ERWIST','PHOMAN','GUIGCI','PHMPOM','PHYTRA','1PISOG','PISONE','PISOST','PISOTE','PITOJU','1POMAG','POPIJA','RALSSO','RHAGPO','RHIOHI','PHYCFR','RRV000','1SCOLF','LAPHFR','SYNCEN','1TEPHF','ARGPLE','TOBRFV','TOLCND','TORSV0','TOUMPA','TOXOCI','TRIZER','TROGGA','XIPHAA','XIPHBC','XYLEFA'";
else {
	$xpests = str_replace(['[',']','"'],['','',"'"],$xpests);
	$pests = $xpests;
}

$sql = 
"with codes as (select b_code,full_name from t_baycode inner join t_bayname on t_baycode.codeid=t_bayname.codeid where isolang='la' and preferred=1)
select
	-- ts.description as ruopx,
	case when ts.description ilike '%RUOP%' then 'Group 1 - Authorised places of production' else 'NA' end as ruop,
	o.pestcode as eppo_pest,
	cp.full_name as pest,
	'ITF3' as nuts,
	ts.description_en,
	count(distinct gid_sito) as \"n.survey_species\", -- deve accorpare tutte le uguali su pest e description_en
--	count(*) as xc4b,  -- deve accorpare tutte le uguali su pest e description_en
	'' as risk_area,
	'' as target_pop_area,
	'' as surveyed_area_target,
--	o.tipologiacontrollata_id as x8,
	case visiva when false then 'Traps' else tc.descrizione_en end as target_material,
	o.hostcode as eppo_host,
	ch.full_name as host,
	case when visiva then 'o' else 't' end as \"obs/traps\",
	case visiva when false then 'NA' else count(*)::text end as \"n.visual_tot_group\",
--	count(distinct o.campioni_id) as xc11b,
	coalesce(sum(c.elementicampione),0) as sample_tot,
	0 as asyntotic_group,
	coalesce(tt.description,'NA') as type_traps,
--	case not visiva when true then count(*) else 0 end as xc11e,
	case not visiva when true then count(distinct trappole_geometry_id) else 0 end as \"n.traps\",
	count(distinct gid_sito) as \"n.survey_species \",
	case not visiva when true then count(distinct gid_sito) else 0 end as \"n.traps_survey\",
	case a.analisysstate_id when 2 then ag.name else 'NA' end as type_test,
--	case when ag.name is null then 0 else count(*) end as xc11h,
	case when ag.name is null then 0 else sum(case a.analisysstate_id when 2 then 1 else 0 end) end as \"n.typetest_tot\",
	'NA' as other_misures,
	'0' as \"n.other_misures\",
	nullif(sum(case ar.positive when 1 then 1 else 0 end),0) as positives_pests, 
--	'' as c13a,
--	'' as c13b,
--	'' as c14,
	string_agg(distinct date_part('month',data_sopralluogo)::text,',') as timing,
	array_agg(a.id) as xdummy1,
	array_agg(a.agent_id) as xdummy2,
	ts.description as ts_description
from scheda s
inner join osservazioni o on o.idscheda=s.idscheda
left join tipologiacontrollata tc on tc.id=o.tipologiacontrollata_id
left join campioni c on o.campioni_id=c.id
inner join tipologiasito ts on ts.id=s.idtipo_visita
inner join siti on siti.gid=s.gid_sito
inner join codes cp on cp.b_code=o.pestcode
inner join codes ch on ch.b_code=o.hostcode
left join trappole_geometry tg on tg.id=o.trappole_geometry_id
left join tipo_trappole tt on tt.id=tg.tipo_trappole_id
--left join analisys a on a.campioni_id=o.campioni_id
--left join ( select * from analisys where pest in ($pests) ) a on a.campioni_id=o.campioni_id
left join ( select * from analisys where pest in ($pests) ) a on a.campioni_id=o.campioni_id and a.pest=o.pestcode
left join agent ag on ag.id=a.agent_id
left join analisysresult ar on ar.id=a.analisysresult_id
where $ruopfilt and o.pestcode in ($pests) and s.stato=2 and date_part('year',data_sopralluogo)=$year
-- and o.visiva 
-- and date_part('month',data_sopralluogo)<=2
group by 
pestcode,cp.full_name,ts.description,ts.description_en,visiva,hostcode,ch.full_name,tt.description,
a.analisysstate_id,ag.name,
--o.tipologiacontrollata_id,
tc.descrizione_en
order by pest,ts.description_en,tt.description,tc.descrizione_en";

//echo $sql . '<br>'; 


// NON USATA , pre 20231107
$sql1 = 
"with codes as (select b_code,full_name from t_baycode inner join t_bayname on t_baycode.codeid=t_bayname.codeid where isolang='la' and preferred=1)
select
	-- ts.description as ruopx,
	case when ts.description ilike '%RUOP%' then 'Group 1 - Authorised places of production' else 'NA' end as ruop,
	o.pestcode as x1,
	cp.full_name as pest,
	'ITF3' as nuts,
	ts.description_en,
	count(distinct gid_sito) as c4b, -- deve accorpare tutte le uguali su pest e description_en
	count(*) as xc4b,  -- deve accorpare tutte le uguali su pest e description_en
	'' as c5,
	'' as c6,
	'' as c7,
	o.tipologiacontrollata_id as x8,
	case visiva when false then 'Trappole' else tc.descrizione_en end as c8,
	o.hostcode as x2,
	ch.full_name as host,
	visiva,
	string_agg(distinct date_part('month',data_sopralluogo)::text,',') as mesi,
	case visiva when false then 'NA' else count(*)::text end as c11a,
	count(distinct o.campioni_id) as xc11b,
	coalesce(sum(c.elementicampione),0) as c11b,
	0  as c11c,
	tt.description as c11d,
	case not visiva when true then count(*) else 0 end as xc11e,
	case not visiva when true then count(distinct trappole_geometry_id) else 0 end as c11e,
	count(distinct gid_sito) as xc11f_numero_siti,
	case not visiva when true then count(distinct gid_sito) else 0 end as c11f,
	case a.analisysstate_id when 2 then ag.name else null end as c11g,
	case when ag.name is null then 0 else count(*) end as xc11h,
	case when ag.name is null then 0 else sum(case a.analisysstate_id when 2 then 1 else 0 end) end as c11h,
	'' as c11l,
	'' as c11j,
	sum(case ar.positive when 1 then 1 else 0 end) as c12, 
	'' as c13a,
	'' as c13b,
	'' as c14,
	array_agg(a.id) as xdummy1,
	array_agg(a.agent_id) as xdummy2
from scheda s
inner join osservazioni o on o.idscheda=s.idscheda
left join tipologiacontrollata tc on tc.id=o.tipologiacontrollata_id
left join campioni c on o.campioni_id=c.id
inner join tipologiasito ts on ts.id=s.idtipo_visita
inner join siti on siti.gid=s.gid_sito
inner join codes cp on cp.b_code=o.pestcode
inner join codes ch on ch.b_code=o.hostcode
left join trappole_geometry tg on tg.id=o.trappole_geometry_id
left join tipo_trappole tt on tt.id=tg.tipo_trappole_id
--left join analisys a on a.campioni_id=o.campioni_id
--left join ( select * from analisys where pest in ($pests) ) a on a.campioni_id=o.campioni_id
left join ( select * from analisys where pest in ($pests) ) a on a.campioni_id=o.campioni_id and a.pest=o.pestcode
left join agent ag on ag.id=a.agent_id
left join analisysresult ar on ar.id=a.analisysresult_id
where $ruopfilt and o.pestcode in ($pests) and s.stato=2 and date_part('year',data_sopralluogo)=$year
 and o.visiva 
-- and date_part('month',data_sopralluogo)<=2
group by 
pestcode,cp.full_name,ts.description,ts.description_en,visiva,hostcode,ch.full_name,tt.description,
a.analisysstate_id,ag.name,o.tipologiacontrollata_id,tc.descrizione_en
order by pest,ts.description_en,tt.description,tc.descrizione_en";

// NON USATA, OBSOLETA ? 
$sql2 = 
"with codes as (select b_code,full_name from t_baycode inner join t_bayname on t_baycode.codeid=t_bayname.codeid where isolang='la' and preferred=1)
select
	-- ts.description as ruopx,
	case when ts.description ilike '%RUOP%' then 'Group 1 - Authorised places of production' else 'NA' end as ruop,
	o.pestcode as x1,
	cp.full_name as pest,
	'ITF3' as nuts,
	ts.description_en,
	count(distinct gid_sito) as c4b, -- deve accorpare tutte le uguali su pest e description_en
	count(*) as xc4b,  -- deve accorpare tutte le uguali su pest e description_en
	'' as c5,
	'' as c6,
	'' as c7,
	o.tipologiacontrollata_id as x8,
	case visiva when false then 'Trappole' else tc.descrizione_en end as c8,
	o.hostcode as x2,
	ch.full_name as host,
	visiva,
	string_agg(distinct date_part('month',data_sopralluogo)::text,',') as mesi,
	case visiva when false then 'NA' else count(*)::text end as c11a,
	count(distinct o.campioni_id) as xc11b,
	coalesce(sum(c.elementicampione),0) as c11b,
	0  as c11c,
	tt.description as c11d,
	case not visiva when true then count(*) else 0 end as xc11e,
	case not visiva when true then count(distinct trappole_geometry_id) else 0 end as c11e,
	count(distinct gid_sito) as xc11f_numero_siti,
	case not visiva when true then count(distinct gid_sito) else 0 end as c11f,
	case a.analisysstate_id when 2 then ag.name else null end as c11g,
	case when ag.name is null then 0 else count(*) end as xc11h,
	case when ag.name is null then 0 else sum(case a.analisysstate_id when 2 then 1 else 0 end) end as c11h,
	'' as c11l,
	'' as c11j,
	sum(case ar.positive when 1 then 1 else 0 end) as c12, 
	'' as c13a,
	'' as c13b,
	'' as c14,
	array_agg(a.id) as xdummy1,
	array_agg(a.agent_id) as xdummy2
from scheda s
inner join osservazioni o on o.idscheda=s.idscheda
left join tipologiacontrollata tc on tc.id=o.tipologiacontrollata_id
left join campioni c on o.campioni_id=c.id
inner join tipologiasito ts on ts.id=s.idtipo_visita
inner join siti on siti.gid=s.gid_sito
inner join codes cp on cp.b_code=o.pestcode
inner join codes ch on ch.b_code=o.hostcode
left join trappole_geometry tg on tg.id=o.trappole_geometry_id
left join tipo_trappole tt on tt.id=tg.tipo_trappole_id
--left join analisys a on a.campioni_id=o.campioni_id
--left join ( select * from analisys where pest in ($pests) ) a on a.campioni_id=o.campioni_id
left join ( select * from analisys where pest in ($pests) ) a on a.campioni_id=o.campioni_id and a.pest=o.pestcode
left join agent ag on ag.id=a.agent_id
left join analisysresult ar on ar.id=a.analisysresult_id
where $ruopfilt and o.pestcode in ($pests) and s.stato=2 and date_part('year',data_sopralluogo)=$year
 and o.visiva 
-- and date_part('month',data_sopralluogo)<=2
group by 
pestcode,cp.full_name,ts.description,ts.description_en,visiva,hostcode,ch.full_name,tt.description,
a.analisysstate_id,ag.name,o.tipologiacontrollata_id,tc.descrizione_en
order by pest,ts.description_en,tt.description,tc.descrizione_en";


/*

--COMBINAZIONE DELLE DUE, TUTTE LE TRAPPOLE ATTIVE NEL PERIODO CHE 1) sono associate a 2) hanno catturato a

set search_path to simfito,simfitolab,eppo,public;
with captures as (
select 
	trappole_geometry_id, 
	avg((case positive when 1 then 1 else 0 end) * (case when catture>0 then catture else 0 end))::integer as catturex
from scheda s
inner join osservazioni o on o.idscheda=s.idscheda
left join ( select * from analisys where pest in ('DACUDO') ) a on a.campioni_id=o.campioni_id and a.pest=o.pestcode
left join analisysresult ar on ar.id=a.analisysresult_id
where 
	not visiva and
	pestcode='DACUDO' and
	data_sopralluogo>='2023-01-01' and data_sopralluogo<='2023-12-31'
group by trappole_geometry_id
),
traps as (
select 
	ts.description as ts_description, 
	tt.description as tt_description, 
	t.id as id_trappola,t.organismo as organismo_trappola,
	sc.data_sopralluogo as data_creazione,
	sr.data_sopralluogo as data_rimozione 
from trappole_geometry t
inner join tipo_trappole tt on tt.id=t.tipo_trappole_id
inner join scheda sc on sc.idscheda=t.scheda_id
inner join siti s on sc.gid_sito=s.gid
inner join tipologiasito ts on ts.id=s.tipologiasito_id 
left join scheda sr on sr.idscheda=t.rimozionescheda_id
where 
	not autorimossa and
	sc.data_sopralluogo<='2023-12-31' and 
	(sr.data_sopralluogo is null or sr.data_sopralluogo>='2023-01-01')
)
select *,coalesce(catturex,0) as numero_catture from traps left join captures on captures.trappole_geometry_id=traps.id_trappola
where organismo_trappola='DACUDO' or catturex>0
order by organismo_trappola,numero_catture desc

*/

@$f = fopen('log/ep.log','a');
@fwrite($f,"---START---\n");
@fwrite($f,"$sql\n");
@fclose($f);
@fwrite($f,"---END---\n");


switch($mode) {
case 'table':
	$n = 0;
	echo "<table border=1>";
	$db->Read($sql);
	while($r=$db->fetch_assoc()) {
		if (true)
			$r['timing'] = months($r['timing']);
		$r['dummyz'] = '';
		if ($n==0) {
			echo "<tr>";
			foreach($r as $idx=>$v) {
				echo "<th>$idx</th>";
			}
			echo "</tr>";
		}
		echo "<tr>";
		foreach($r as $idx=>$v) {
			echo "<td>$v</td>";
		}
		echo "</tr>";
		$n++;
	}
	echo "</table>";
//  echo "<b>N. $n</b><br>";
break;
case 'csv':
	if (exec_from_cli()) {
		$db->Read($sql);
		$n = 0;
		while($r=$db->fetch_assoc()) {
			if (true)
				$r['timing'] = months($r['timing']);
			if ($n==0) {
				foreach($r as $idx=>$v) {
//--					echo "$idx|";
				}
//--				echo "\n";
			}
			foreach($r as $idx=>$v) {
//--				echo "$v|";
			}
//--			echo "\n";
			$n++;
		}
	}
	else {
		header('Content-Type: text/csv; charset=utf-8');
		header('Content-Disposition: attachment; filename=report_europhyt.csv');
		$db->Read($sql);
		$n = 0;
		while($r=$db->fetch_assoc()) {
			if (true)
				$r['timing'] = months($r['timing']);
			if ($n==0) {
				foreach($r as $idx=>$v) {
					echo "$idx|";
				}
				echo "\n";
			}
			foreach($r as $idx=>$v) {
				echo "$v|";
			}
			echo "\n";
			$n++;
		}
	}
break;
case 'csvasync':
	$reply = ['success'=>true,'count'=>1,'maxcount'=>1];
//			echo json_encode($_REQUEST) . "<br>";
//			echo json_encode($_SESSION) . "<br>";
			$query = pg_escape_string(json_encode($_REQUEST));
			$uid = $_REQUEST['uid'];
			$sql0 = "SELECT * FROM simfito.tecnici WHERE id_tecnico=$uid";
			$r = $db->FetchRow($sql0);
			$ttid = $r['idtipo_tecnico'];
			$name = 'report europhyt';
			$archiveposition = '';
			$fullfilename = $sqls[$data]['filename'];
			$values = "$uid,'$name','$query',now(),'$archiveposition',1,'$fullfilename',$ttid,now()";
 			$sql = "INSERT INTO simfito.reports(owner,name,query,date,archiveposition,statoreport_id,fullfilename,tipotecnico_id,runstart) VALUES($values) RETURNING id";
			$r = $db->FetchRow($sql);
			$reply['reportid'] = $r['id'];
			csv_launch($r['id']);

		echo json_encode($reply);
break;
case 'xls':
		$xls = new PHPExcel;

		$xls->setActiveSheetIndex(0);
		$ws = $xls->getActiveSheet();
		$ws->setTitle('report_europhyt');

		$db->Read($sql);
		$n = 0;
		$j = 1;
		while($r=$db->fetch_assoc()) {
			if (true)
				$r['timing'] = months($r['timing']);
			if ($n==0) {
				$k = 0;
				foreach($r as $idx=>$v) {
					$ws->setCellValueByColumnAndRow($k,$j,$idx);
					$k++;
				}
				$j++;
			}
			$k = 0;
			foreach($r as $idx=>$v) {
					$ws->setCellValueByColumnAndRow($k,$j,$v);
					$k++;
			}
			$n++;
			$j++;
		}

		$fname = 'report_europhyt.xls';
		if (!$debug) {
			$xlsWriter = new PHPExcel_Writer_Excel2007($xls);
			if ($xlsout=='php://output') {
				doheader($fname);
			}
			$xlsWriter->save($xlsout);
			if ($xlsout!='php://output') {
				$sql = "UPDATE simfito.reports SET statoreport_id=2,runend=now() WHERE id=$jobid";
				$db->SQL($sql);
			}
		}

break;
case 'xlsasync':
	$reply = ['success'=>true,'count'=>1,'maxcount'=>1];
//			echo json_encode($_REQUEST) . "<br>";
//			echo json_encode($_SESSION) . "<br>";
			$query = pg_escape_string(json_encode($_REQUEST));
			$uid = $_REQUEST['uid'];
			$sql0 = "SELECT * FROM simfito.tecnici WHERE id_tecnico=$uid";
			$r = $db->FetchRow($sql0);
			$ttid = $r['idtipo_tecnico'];
			$name = 'report europhyt';
			$archiveposition = '';
			$fullfilename = 'report_europhyt.xlsx';
			$values = "$uid,'$name','$query',now(),'$archiveposition',1,'$fullfilename',$ttid,now()";
 			$sql = "INSERT INTO simfito.reports(owner,name,query,date,archiveposition,statoreport_id,fullfilename,tipotecnico_id,runstart) VALUES($values) RETURNING id";
			$r = $db->FetchRow($sql);
			$reply['reportid'] = $r['id'];
			xls_launch($r['id']);

		echo json_encode($reply);
break;
}

}

?>
