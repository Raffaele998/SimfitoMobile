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
	$mx = explode(',',$m);
	$mr = [];
	for($i=0;$i<count($mx);$i++) {
		if (!in_array($mx[$i],$mr))
			$mr[] = $mx[$i];
	}
	$m = implode(',',$mr);
	$mm = str_replace(',','; ',str_replace($src,$dst,$m));
	return $mm;
}

//$mt = '1,2,3,4,5,6,7,8,9,10,11,12';
//echo months($mt) . '<br>';

function xls_launch($jobid) {
	exec("php export_eptr1.php $jobid >/dev/null 2>/dev/null &");
}

function csv_launch($jobid) {
	exec("php export_eptr1.php $jobid >/dev/null 2>/dev/null &");
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
$mode = ( isset($_REQUEST['mode']) ? $_REQUEST['mode'] : 'xls' );
$xpests = ( isset($_REQUEST['pest']) ? $_REQUEST['pest'] : '' );
$startdt = "$year-01-01";
$enddt = "$year-12-31";

// lista dei pest abilitati
if ($xpests=='')
	$pests = "'AGRLAX','AGRLPL','ALECSN','ANSTLU','ANOLCN','ANOLGL','ANTHEU','ANTHGR','AROMBU','PARZCO','DACUDO','DACUZO','BURSXY','LIBEAF','LIBEAM','LIBEAS','PHYPPH','CERAFP','CARNFU','DRAEMI','GRCPAT','HOMLTR','CTV000','CORBSE','CONHNE','DACLPI','1CRONG','CRONSP','CORBFL','DENDSI','DIABLO','DIABUH','DIABUN','DIABVZ','EOTELE','EPIXCU','EPIXPP','EPIXSU','EPIXTU','ERWIAM','GIBBCI','ERSHMU','GEOHMO','HETDPA','HETDRO','PHYP64','SCAPLI','GYMNSP','GYMNAS','GYMNCL','GYMNGL','GYMNJV','GYMNYA','GNORLY','LIRISA','MARGPR','MARGVI','MARGVR','MELGCH','MELGFA','MELGGC','1MONCG','MONCGA','MONCSP','ERWIST','PHOMAN','GUIGCI','PHMPOM','PHYTRA','1PISOG','PISONE','PISOST','PISOTE','PITOJU','1POMAG','POPIJA','RALSSO','RHAGPO','RHIOHI','PHYCFR','RRV000','1SCOLF','LAPHFR','SYNCEN','1TEPHF','ARGPLE','TOBRFV','TOLCND','TORSV0','TOUMPA','TOXOCI','TRIZER','TROGGA','XIPHAA','XIPHBC','XYLEFA'";
else {
	$xpests = str_replace(['[',']','"'],['','',"'"],$xpests);
	$pests = $xpests;
}

$sql = 
"set search_path to simfito,simfitolab,eppo,public;
with fulltbl as (
with captures as (
select 
	trappole_geometry_id, 
	avg((case positive when 1 then 1 else 0 end) * (case when catture>0 then catture else 0 end))::integer as catturex,
	string_agg(distinct date_part('month',data_sopralluogo)::text,',') as timing
from scheda s
inner join osservazioni o on o.idscheda=s.idscheda
left join ( select * from analisys where pest in ($pests) ) a on a.campioni_id=o.campioni_id and a.pest=o.pestcode
left join analisysresult ar on ar.id=a.analisysresult_id
where 
	not visiva and
	pestcode=$pests and
	data_sopralluogo>='$startdt' and data_sopralluogo<='$enddt'
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
	sc.data_sopralluogo<='$enddt' and 
	(sr.data_sopralluogo is null or sr.data_sopralluogo>='$startdt')
)
select 
	ts_description as tipo_sito,
	tt_description as tipo_trappola,
	id_trappola,
	organismo_trappola,
--	data_creazione,
--	data_rimozione
	case when catturex>0 then timing else null end as timing,
	coalesce(catturex,0) as numero_catture_pos 
from traps left join captures on captures.trappole_geometry_id=traps.id_trappola
where organismo_trappola=$pests or catturex>0
order by organismo_trappola,numero_catture_pos desc
)
select tipo_sito,tipo_trappola,count(*) as numero_trappole,sum(numero_catture_pos) as numero_catture_pos,string_agg(timing,',') as timing
from fulltbl
group by tipo_sito,tipo_trappola
order by tipo_sito,tipo_trappola
";

// echo $sql . '<br>'; 


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

		$fname = 'report_europhyt_tr.xls';
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
			$fullfilename = 'report_europhyt_tr.xlsx';
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
