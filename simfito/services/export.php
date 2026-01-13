<?php
// http://10.200.16.127/simfito/services/export.php?mode=xls&data=trappole2&from=2022-01-01&to=2022-02-09&mainpest=&debug=true
// http://10.200.16.127/simfito.org/simfitotest/services/export.php?mode=xls&data=trappole2&from=&to=&comuni=&mainpest=&

require_once("../etc/db_config.php");
require_once("crud.php");
require_once('fpdf/fpdf.php');
require_once('phpexcel/PHPExcel.php');
require_once('exportdata.php');
require_once('exportprint.php');

$maxcount = 65000;			// max number of row for xls export 

function exec_from_cli() {
	return php_sapi_name()=='cli';
}

function vvar_dump($x) {
	foreach($x as $i=>$v) {
		echo ".. $i => $v<br>";
	}
}

function redate($d) {
	$dt = DateTime::createFromFormat('d/m/Y', $d);
	return $dt->format("Y-m-d");
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

// due elementi da 80
function bidata($pdf,$head,$value,$fs = '') {
	global $bigfont,$mediumfont,$smallfont,$tinyfont;
	if ($fs=='')
		$fs = $smallfont;
	$pdf->SetFontSize($fs);
	$pdf->Cell(80,6,$head,0,0,'L',false);
	$pdf->SetX(100);
	$pdf->SetFont('','B');
	$pdf->Cell(80,6,$value,0,1,'L',false);
	$pdf->SetFont('');
}

// 
function multidata($pdf,$value,$fs = '') {
	global $bigfont,$mediumfont,$smallfont,$tinyfont;
	if ($fs=='')
		$fs = $smallfont;
	$pdf->SetFontSize($fs);
	$pdf->SetFont('','B');
	$pdf->MultiCell(180,6,$value,0,'L',false);
	$pdf->SetFont('');
}

// come la quaddata ma con il value che occupa 3 elementi
function bidatax($pdf,$head,$value,$fs = '') {
	global $bigfont,$mediumfont,$smallfont,$tinyfont;
	if ($fs=='')
		$fs = $tinyfont;
	$pdf->SetFontSize($fs);
	$pdf->Cell(40,6,$head,0,0,'L',false);
	$pdf->SetX(50);
	$pdf->SetFont('','B');
	$pdf->Cell(120,6,$value,0,1,'L',false);
	$pdf->SetFont('');
}

// quattro elementi da 40
function quaddata($pdf,$head1,$value1,$head2,$value2) {
	global $bigfont,$mediumfont,$smallfont,$tinyfont;
	$pdf->SetFontSize($tinyfont);
	$pdf->Cell(40,5,$head1,0,0,'L',false);
	$pdf->SetX(50);
	$pdf->SetFont('','B');
	$pdf->Cell(40,5,$value1,0,0,'L',false);
	$pdf->SetX(100);
	$pdf->SetFont('');
	$pdf->Cell(40,5,$head2,0,0,'L',false);
	$pdf->SetX(150);
	$pdf->SetFont('','B');
	$pdf->Cell(40,5,$value2,0,1,'L',false);
	$pdf->SetFont('');
}

function head($pdf,$txt) {
	global $bigfont,$mediumfont,$smallfont,$tinyfont;
	$pdf->SetFontSize($bigfont);
	$pdf->SetFillColor(100);
	$pdf->SetTextColor(255);
	$pdf->Cell($pdf->GetPageWidth()-20,7,$txt,0,1,'L',true);
	$pdf->SetY($pdf->GetY()+3);
	$pdf->SetFillColor(255);
	$pdf->SetTextColor(0);
}
function lempty($pdf) {
	$pdf->SetY($pdf->GetY()+6);
}
function line($pdf) {
	$y = $pdf->GetY();
	$pdf->Line(40,$y,$pdf->GetPageWidth()-40,$y);
	$pdf->SetY($y+2);
}

$tinyfont = 7;
$smallfont = 8;
$mediumfont = 11;
$bigfont = 14;
$hugefont = 56;

$dowatermark = false;

class PDF extends FPDF {
var $angle=0;
	function _endpage() {
    	if($this->angle!=0) {
        	$this->angle=0;
        	$this->_out('Q');
    	}
    	parent::_endpage();
	}
	function Rotate($angle,$x=-1,$y=-1) {
	    if($x==-1)
    	    $x=$this->x;
    	if($y==-1)
        	$y=$this->y;
    	if($this->angle!=0)
        	$this->_out('Q');
    	$this->angle=$angle;
    	if($angle!=0) {
	        $angle*=M_PI/180;
    	    $c=cos($angle);
        	$s=sin($angle);
        	$cx=$x*$this->k;
        	$cy=($this->h-$y)*$this->k;
        	$this->_out(sprintf('q %.5F %.5F %.5F %.5F %.2F %.2F cm 1 0 0 1 %.2F %.2F cm',$c,$s,-$s,$c,$cx,$cy,-$cx,-$cy));
    	}
	}
	function RotatedText($x, $y, $txt, $angle) {
    	//Text rotated around its origin
	    $this->Rotate($angle,$x,$y);
    	$this->Text($x,$y,$txt);
    	$this->Rotate(0);
	}	
	function Header() {
		global $hugefont,$bigfont,$mediumfont,$smallfont,$tinyfont;
		global $dowatermark;
		$this->SetFontSize($bigfont);
		if ($dowatermark) {
			$x = $this->GetX();
			$y = $this->GetY();
		    // $this->SetFont('Arial','B',50);
    		$this->SetTextColor(150,150,150);
			$this->SetFontSize($hugefont);
		    $this->RotatedText(70,200,'B   o   z   z   a',45);
			$this->SetFontSize($bigfont);
    		$this->SetTextColor(0,0,0);
			$this->SetXY($x,$y);
		}
		$this->Cell($this->GetPageWidth()-20,7,'SIMFITO',1,1,'C',false);
		$this->SetY($this->GetY()+3);

	}
	function Footer() {
		global $bigfont,$mediumfont,$smallfont,$tinyfont;
		$this->SetFontSize($smallfont);
	    $this->SetY(-15);
    	$this->Cell($this->GetPageWidth()-20,7,'SIMFITO     Pag. '.$this->PageNo(),1,0,'C');
	}
}

/* supporto per la generazione dei fogli excel */

function xls_count($db,$sqls,$data) {
//	echo "'" . count($sqls) . "' '$data'<br>";
	$sql = $sqls[$data]['sqlcount'];
//	echo "'$sql'<br>";
	if (isset($sql)) {
//		echo "in<br>";
		$parms = $sqls[$data]['parms'];
		if ($data=='tabbellone') {
			//vvar_dump($_REQUEST);
			$where = 'scheda.stato=2';
			if (isset($_REQUEST['start']) && $_REQUEST['start']!='') {
				$xs = redate($_REQUEST['start']);
				$where .= " and data_sopralluogo>='$xs'";
			}
			if (isset($_REQUEST['end']) && $_REQUEST['end']!='') {
				$xs = redate($_REQUEST['end']);
				$where .= " and data_sopralluogo<='$xs'";
			}
			if (isset($_REQUEST['provincia']) && $_REQUEST['provincia']!='') {
				$where .= " and provincia='$_REQUEST[provincia]'";
			}
			if (isset($_REQUEST['comune']) && $_REQUEST['comune']!='') {
				$where .= " and comune_istat='$_REQUEST[comune]'";
			}
			if (isset($_REQUEST['host']) && $_REQUEST['host']!='') {
				$where .= " and hostcode='$_REQUEST[host]'";
			}
			if (isset($_REQUEST['pest']) && $_REQUEST['pest']!='') {
				$where .= " and pestcode='$_REQUEST[pest]'";
			}
			if (isset($_REQUEST['tipoazienda']) && $_REQUEST['tipoazienda']!='') {
				$where .= " and azienda.id_azienda in (select distinct azienda_id from azienda_tipoazienda where tipoazienda_id=$_REQUEST[tipoazienda])";
			}
			if (isset($_REQUEST['uty']) && $_REQUEST['uty']!='') {
				if ($_REQUEST['uty']>=2) {
					if (isset($_REQUEST['uid']) && $_REQUEST['uid']!='') {
						$where .= " and (scheda.id_tecnico=$_REQUEST[uid] or scheda.idscheda in (select distinct idscheda from schede_tecnici where id_tecnico=$_REQUEST[uid]))";
					}
					if (isset($_REQUEST['upr']) && $_REQUEST['upr']!='') {
					}
				}
			}
			if (isset($_REQUEST['tecnici']) && $_REQUEST['tecnici']!='') {
				$xt = str_replace(['[',']'],'',$_REQUEST['tecnici']);
				$where .= " and scheda.id_tecnico IN ($xt)";
			}
			$sql = str_replace("%where%",$where,$sql);
//			echo $sql;
//			exit(0);
		}
		else {
			if(isset($parms)) {
				foreach($parms as $parm) {
					$sql = str_replace("%$parm%",$_REQUEST[$parm],$sql);
				}
			}
		}
//		echo "'$sql'<br>";
		$r = $db->FetchRow($sql);
		$cc = $r['cc'];
//		echo "'$cc'<br>";
		return $cc;
	}
	else {
		return -1;
	}
}

function xls_do($xls,$db,$sqls,$data) {
global $debug;

	if ($debug) {
		echo "<b>DATA</b> $data<br>";
	}

	$mode = $sqls[$data]['mode'];
	if ($debug) {
		echo "<b>MODE</b> '$mode'<br>";
	}
	if ($mode=='custom') {
	}
	else {
		$sql = $sqls[$data]['sql'];
		if ($debug) {
			echo "<b>SQL_P</b> '$sql'<br>";
		}
		$header = $sqls[$data]['header'];
		$columns = $sqls[$data]['columns'];
		$worksheet = $sqls[$data]['worksheet'];
		$skiprow = $sqls[$data]['skiprow'];
		$parms = $sqls[$data]['parms'];
		$fname = $sqls[$data]['filename'];

		if (is_array($sql)) {				// versione multi-sheet TBC
			for($i=0;$i<count($sql);$i++) {
				$xls->setActiveSheetIndex($i);
				$ws = $xls->getActiveSheet();
				if (isset($worksheet)) {
					$ws->setTitle($worksheet[$i]);
				}
				$j = 1;
				if (isset($header)) {
					$k = 0;
					foreach($header[$i] as $v) {
						$ws->setCellValueByColumnAndRow($k,$j,$v);
						$k++;
					}
					$j++;
				}
				$db->Read($sql[$i]);
				while($r=$db->fetch_assoc()) {
					$k = 0;
					foreach($r as $v) {
						$ws->setCellValueByColumnAndRow($k,$j,$v);
						$k++;
					}
					$j++;
				}
			}
		}
		else {							// versione single sheet
			$xls->setActiveSheetIndex(0);
			$ws = $xls->getActiveSheet();
			if (isset($worksheet)) {
				$ws->setTitle($worksheet);
			}
			$j = 1;
			if (isset($skiprow)) {
				$j += $skiprow;
			}
			if (isset($columns)) {
				$k = 0;
				foreach($columns as $v) {
					$ws->setCellValueByColumnAndRow($k,$j,$v[0]);
					$k++;
				}
				$j++;
			}
			else if (isset($header)) {
				$k = 0;
				foreach($header as $v) {
					$ws->setCellValueByColumnAndRow($k,$j,$v);
					$k++;
				}
				$j++;
			}
			//echo "$sql<br>";
			//
			// sostituzione dei parametri nella query
			//
			if ($data=='tabbellone') {
				$tabbellone_sopprimiex = true;
				$tabbellone_sopprimiex2 = true;
				$stato = array(
					'osservazioni_idosservazioni' => -1
				//	'osservazioni_hostcode'=>'',
				//	'osservazioni_pestcode'=>'',
				);
				$stato2 = array(
					'osservazioni_idosservazioni' => -1,
					'serie_campione' => 'XXXX',
					'analisys_agent_id' => -1
				);
				//vvar_dump($_REQUEST);
				$where = 'scheda.stato=2';
				if (isset($_REQUEST['start']) && $_REQUEST['start']!='') {
					$xs = redate($_REQUEST['start']);
					$where .= " and data_sopralluogo>='$xs'";
				}
				if (isset($_REQUEST['end']) && $_REQUEST['end']!='') {
					$xs = redate($_REQUEST['end']);
					$where .= " and data_sopralluogo<='$xs'";
				}
				if (isset($_REQUEST['provincia']) && $_REQUEST['provincia']!='') {
					$where .= " and provincia='$_REQUEST[provincia]'";
				}
				if (isset($_REQUEST['comune']) && $_REQUEST['comune']!='') {
					$where .= " and comune_istat='$_REQUEST[comune]'";
				}
				if (isset($_REQUEST['host']) && $_REQUEST['host']!='') {
					$where .= " and hostcode='$_REQUEST[host]'";
				}
				if (isset($_REQUEST['pest']) && $_REQUEST['pest']!='') {
					$where .= " and pestcode='$_REQUEST[pest]'";
				}
				if (isset($_REQUEST['tipoazienda']) && $_REQUEST['tipoazienda']!='') {
					$where .= " and azienda.id_azienda in (select distinct azienda_id from azienda_tipoazienda where tipoazienda_id=$_REQUEST[tipoazienda])";
				}
				if (isset($_REQUEST['uty']) && $_REQUEST['uty']!='') {
					if ($_REQUEST['uty']>=2) {
						if (isset($_REQUEST['uid']) && $_REQUEST['uid']!='') {
							$where .= " and (scheda.id_tecnico=$_REQUEST[uid] or scheda.idscheda in (select distinct idscheda from schede_tecnici where id_tecnico=$_REQUEST[uid]))";
						}
						if (isset($_REQUEST['upr']) && $_REQUEST['upr']!='') {
						}
					}
				}
				if (isset($_REQUEST['tecnici']) && $_REQUEST['tecnici']!='') {
					$xt = str_replace(['[',']'],'',$_REQUEST['tecnici']);
					$where .= " and scheda.id_tecnico IN ($xt)";
				}
				$sql = str_replace("%where%",$where,$sql);
				$sql .= " LIMIT 65000";
				//echo "<b>WHERE</b> $where<br>";
				//echo "<b>SQL</b> $sql<br>";
				//exit(0);
			}
			else if ($data=='trappole') {
				$where = 'TRUE';
				if ($_REQUEST['from']!='')
					$where .= " AND datacreazione>='$_REQUEST[from]'";
				if ($_REQUEST['to']!='')
					$where .= " AND datacreazione<='$_REQUEST[to]'";
				if ($_REQUEST['mainpest']!='') {
//					$where .= " AND organismo='$_REQUEST[mainpest]'";
					$xmainpest = str_replace('"',"'",str_replace(']','',str_replace('[','',$_REQUEST['mainpest'])));
					$where .= " AND organismo in ($xmainpest)";
				}
				if (isset($_REQUEST['prv'])) {
					$where .= " AND comuni.provincia='$_REQUEST[prv]'";
				}
				// RIMOSSO 2022-10-03 
				//if (isset($_REQUEST['uid'])) {
				//	$where .= " AND scheda.id_tecnico=$_REQUEST[uid]";
				//}				
				$sql = str_replace("%where%",$where,$sql);
			}
			else if ($data=='trappole1') {
				$where = 'TRUE';
				if ($_REQUEST['from']!='')
					$where .= " AND datacreazione>='$_REQUEST[from]'";
				if ($_REQUEST['to']!='')
					$where .= " AND datacreazione<='$_REQUEST[to]'";
				if ($_REQUEST['mainpest']!='') {
//					$where .= " AND organismo='$_REQUEST[mainpest]'";
					$xmainpest = str_replace('"',"'",str_replace(']','',str_replace('[','',$_REQUEST['mainpest'])));
					$where .= " AND organismo in ($xmainpest)";
				}
				if (isset($_REQUEST['prv'])) {
					$where .= " AND comuni.provincia='$_REQUEST[prv]'";
				}
				if (isset($_REQUEST['uid'])) {
					$where .= " AND scheda.id_tecnico=$_REQUEST[uid]";
				}				
				$sql = str_replace("%where%",$where,$sql);
			}
			else if ($data=='trappole2') {
				$where = 'TRUE';
				if ($_REQUEST['from']!='')
					$where .= " AND datacreazione>='$_REQUEST[from]'";
				if ($_REQUEST['to']!='')
					$where .= " AND datacreazione<='$_REQUEST[to]'";
				if ($_REQUEST['mainpest']!='') {
//					$where .= " AND organismo='$_REQUEST[mainpest]'";
					$xmainpest = str_replace('"',"'",str_replace(']','',str_replace('[','',$_REQUEST['mainpest'])));
					$where .= " AND organismo in ($xmainpest)";
				}
				if (isset($_REQUEST['prv'])) {
					$where .= " AND comuni.provincia='$_REQUEST[prv]'";
				}
				if (isset($_REQUEST['comuni']) && $_REQUEST['comuni']!='') {
					//var_dump($_REQUEST['comuni']);echo "<br>";
					$comuni = $_REQUEST['comuni'];
					$comuni = str_replace(['[',']','"'],['','',"'"],$comuni);
					//var_dump($comuni);echo "<br>";
					$where .= " AND siti.comune_istat IN ($comuni)";
					//exit(0);
				}
				if (isset($_REQUEST['uid'])) {
					$where .= " AND scheda.id_tecnico=$_REQUEST[uid]";
				}
				$sql = str_replace("%where%",$where,$sql);
				//$debug=true;
				if ($debug) {
					echo "<b>WHERE</b> $where<br>";
					echo "<b>SQL</b> $sql<br>";
					exit(0);
				}
			}
			else if ($data=='trappole3') {
				$where = 'TRUE';
				if ($_REQUEST['from']!='')
					$where .= " AND sch_start.data_sopralluogo<='$_REQUEST[from]' and coalesce(sch_end.data_sopralluogo,'2080-12-31')>='$_REQUEST[from]'";
				if ($_REQUEST['mainpest']!='') {
					$xmainpest = str_replace('"',"'",str_replace(']','',str_replace('[','',$_REQUEST['mainpest'])));
					$where .= " AND organismo in ($xmainpest)";
				}
				$sql = str_replace("%where%",$where,$sql);
				//$debug=true;
				if ($debug) {
					echo "<b>WHERE</b> $where<br>";
					echo "<b>SQL</b> $sql<br>";
					exit(0);
				}
			}
			else {
				if(isset($parms)) {
					foreach($parms as $parm) {
						$sql = str_replace("%$parm%",$_REQUEST[$parm],$sql);
					}
				}
			}
			if ($debug) {
				echo "<b>SQL_A</b> $sql<br>";
			}
//			exit(0);
			@$f = fopen('log/export.log','a');
			@fwrite($f,"-----EXPORT $data----\n");
			@fwrite($f,"$sql\n");
			@fclose($f);
			$db->Read($sql);
			while($r=$db->fetch_assoc()) {
				$k = 0;
				if (isset($columns)) {
					foreach($columns as $x) {
						if (substr($x[1],0,1)=='#') {
							$v = substr($x[1],1);
						}
						else if (substr($x[1],0,1)=='!') {
							$xx = substr($x[1],1);
							if ($data=='tabbellone') {
								if ($stato['osservazioni_idosservazioni']!=$r['osservazioni_idosservazioni']) {
									$v = $r[$xx];
								}
								else {
									$v = '';	
								}	
							}
						}
						else {
							$v = $r[$x[1]];
						}
						if($tabbellone_sopprimiex) {
							if ($r['osservazioni_rilevato']==2 && $r['analisysresult_positive']==0) { // !! osservazioni da verificare e risultato analisi negativo !!
								if ($x[0]=='attacco' || $x[0]=='intensita_attacco' || $x[0]=='osservazione.superficie_infestata [m2]' || $x[0]=='osservazione.num_piante_infestate') {
									$v = 0;
								}
							}
						}
						if($tabbellone_sopprimiex2) {
							if ($stato2['osservazioni_idosservazioni']==$r['osservazioni_idosservazioni'] &&
								$stato2['serie_campione']==$r['serie_campione'] && 
								$stato2['analisys_agent_id']==$r['analisys_agent_id'] ) {
									if ($x[2]=='s2') {
										$v = '';
									}
							}
						}
						$ws->setCellValueByColumnAndRow($k,$j,$v);
						$k++;
					}
				}
				else {
					foreach($r as $v) {
						$ws->setCellValueByColumnAndRow($k,$j,$v);
						$k++;
					}
				}
				$j++;
				$stato['osservazioni_idosservazioni'] = $r['osservazioni_idosservazioni'];
				$stato2['osservazioni_idosservazioni'] = $r['osservazioni_idosservazioni'];
				$stato2['serie_campione'] = $r['serie_campione'];
				$stato2['analisys_agent_id'] = $r['analisys_agent_id'];
			}
		}
	}
}

function xls_launch($jobid) {
	exec("php export.php $jobid >/dev/null 2>/dev/null &");
}

/********** MAIN **********/
session_start();

global $connection;
global $att_path;
$db=new CRUD($connection);
$db->connect();
$db->SQL("SET search_path TO public,simfitolab,simfito,eppo");

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
	}
	else {
		$xlsout='php://output';
	}

	$debug = (isset($_REQUEST['debug']) ? true : false);
	$mode = $_REQUEST['mode'];
	$data = $_REQUEST['data'];
	$idUser = $_REQUEST['idUser'];
	$my_prj = 32633; //??

	switch($mode) {
	case 'print':
		//var_dump($_REQUEST);echo "<br>";
		$prdatas = $_REQUEST['data'];
		//echo $prdatas;echo "<br>";
		$prdata = json_decode($prdatas,true);
		//var_dump($prdata);echo "<br>";
		$extent = $prdata['extent'];
		$epsg = $prdata['epsg'];
		$layers = $prdata['layers'];
		//var_dump($extent);echo "<br>";
		//var_dump($epsg);echo "<br>";
		//var_dump($layers);echo "<br>";
		$title = '';
		$dotXmm = 100;
		$bbox = $extent;
		$w = 190;
		$h =  intval($w*( ($bbox[3]-$bbox[1])/($bbox[2]-$bbox[0]) )); // $bbox[0] $bbox[1] $bbox[2] $bbox[3];
		//echo "$w,$h<br>";
		//exit(0);
		$r  = array('x'=>10,'y'=>20,'w'=>$w,'h'=>$h);	// immagine
		$r1 = array('x'=>10,'y'=>25+$h,'w'=>190);		// legenda
		$r2 = array('x'=>10,'y'=>10,'w'=>190);			// titolo
		$wh = array('w'=>4*$w,'h'=>4*$h);				// risoluzione immagine WMS
		$pdf = new PDF();
		$pdf->SetFont('Arial','',$bigfont);
		$pdf->AddPage();

		export_print($pdf,'',$title,$dotXmm,$epsg,$bbox,$layers,$r,$r1,$r2,$wh);
		$fname = 'stampa.pdf';

		//exit(0);

		doheader($fname);
		$pdf->Output();

	break;
	case 'pdf':
		$dowatermark = (isset($_REQUEST['status']) ? ($_REQUEST['status']==0) : false); 
		if(isset($pdfs[$data])) {
			switch($data) {			// aggiungere secondo necessita' 
			case 'scheda':
				$id = $_REQUEST['id'];
				$sql = sprintf($pdfs[$data]['sql'],$id);		// TECNICI RILEVATORI,DATI DEL SITO VISITATO
				$sqlb = sprintf($pdfs[$data]['sqlb'],$id);		// OSSERVAZIONI
				$sqlb1 = sprintf($pdfs[$data]['sqlb1'],$id);	// TRAPPOLE CONTROLLO/CAMBIO FEROMONE
				$sqlc = sprintf($pdfs[$data]['sqlc1'],$id,$id);	// TRAPPOLE POSIZIONAMENTO/RIMOZIONE
				$sqld = sprintf($pdfs[$data]['sqld'],$id);		// ABBATTIMENTI
				$sqle = sprintf($pdfs[$data]['sqle'],$id);		// TECNICI RILEVATORI
				//echo "$sql<br>$sqlb<br>";
			break;
			}
			$db->Read($sql);
			$r=$db->fetch_assoc();

			$header = $pdfs[$data]['header'];
			$fname = $pdfs[$data]['filename'];
			$pdf = new PDF();
			$pdf->SetFont('Arial','',$bigfont);
			$pdf->AddPage();
			head($pdf,"SCHEDA DI MONITORAGGIO N. $id - PROTOCOLLO : $r[protocollo]");

			head($pdf,"DATI TECNICI RILEVATORI");
			bidata($pdf,'Nome e Cognome:',"$r[t_cognome] $r[t_nome]");
			bidata($pdf,'Ufficio:',$r['ufficio']);
			bidata($pdf,'Email:',$r['t_email']);
			line($pdf);
			$db->Read($sqle); 
			while($re = $db->fetch_assoc()) {
				bidata($pdf,'Nome e Cognome:',"$re[cognome] $re[nome]");
				bidata($pdf,'Ufficio:',$re['ufficio']);
				bidata($pdf,'Email:',$re['email']);
			}
			lempty($pdf);

			head($pdf,"DATI DEL SITO VISITATO");
			bidata($pdf,'Data:',$r['data_sopralluogo']);
			bidata($pdf,'Azienda',$r['rag_soc']);
			bidata($pdf,'P.IVA Azienda:',$r['partita_iva']);
			bidata($pdf,"Tipologia luogo d'ispezione:",$r['motivo']);
			bidata($pdf,'Denominazione del sito:',$r['denominaz']);
			bidata($pdf,"Localita':",$r['localita']);
			bidata($pdf,'Comune:',"$r[nome] ($r[provincia])");
			bidata($pdf,'X,Y(WGS84 UTM33N):',"($r[x],$r[y])");
			bidata($pdf,'Note:','');
			multidata($pdf,$r['note']);
			lempty($pdf);

			head($pdf,"OSSERVAZIONI");
			$no = 1;
			$db->Read($sqlb);
			//echo $sqlb;
			//exit(0);
			while($rb = $db->fetch_assoc()) {
				//var_dump($rb);echo "<br><br>";
				if (true) {	//20201002
					bidata($pdf,"Osservazione N. $no (ID: $rb[idosservazioni])",'',$tinyfont);
					quaddata($pdf,'Pianta ospite:',$rb['host_full_name'],'Organismo nocivo',$rb['pest_full_name']);
					quaddata($pdf,'Presente:',$rb['presente'],'Campione per laboratorio:',$rb['campione_lab']);
					quaddata($pdf,'Risultato:',$rb['risultato'],'Codice campione:',$rb['codice']);
					quaddata($pdf,'Tipo serie campione:',$rb['tipocampione_description'],'Elementi della serie:',$rb['elementicampione']);
					quaddata($pdf,'Fase fenologica:',$rb['fase_fenologica'],'Tipologia controllata',$rb['tipologiacontrollata_descrizione,']);
					quaddata($pdf,"Superficie dell'appezzamento [mq]:",$rb['appezzamento'],'Superficie controllata [mq]:',$rb['sup_vis']);
					quaddata($pdf,"Unita' totali",$rb['unita'],"Unita' controllate",$rb['unita_chk']);
					quaddata($pdf,'Peso totale',$rb['peso'],'Peso controllato',$rb['peso_chk']);
					quaddata($pdf,'Lotti totali',$rb['lotti'],'Lotti controllati',$rb['lotti_chk']);
					quaddata($pdf,'Lotti campionati',$rb['lotti_camp'],"Paese d'origne",$rb['provenienza']);
					quaddata($pdf,'n. Piante infestate:',$rb['piante_infest'],'n. Piante abbattute:',$rb['no_abbatt']);
					quaddata($pdf,'Superficie infestata [mq]:',$rb['sup_infest'],'Tempo impiegato: [min]',$rb['tempo']);
					bidata($pdf,"Sintomi sospetti,pericolosita' e note:",'');
					multidata($pdf,$rb['sospetti']);
					line($pdf);
					lempty($pdf);
				}
				else {
					bidata($pdf,"Osservazione N. $no (ID: $rb[idosservazioni])",'',$tinyfont);
					quaddata($pdf,'Pianta ospite:',$rb['host_full_name'],'Organismo nocivo',$rb['pest_full_name']);
					quaddata($pdf,'Presente:',$rb['presente'],'Campione per laboratorio:',$rb['campione_lab']);
					quaddata($pdf,'Risultato:',$rb['risultato'],"Intensita' attacco:",$rb['nome_intensity']);
					quaddata($pdf,'Attacco:',$rb['nome_grado'],'Fase fenologica:',$rb['fase_fenologica']);
					quaddata($pdf,'Piante totali:',$rb['n_osservate'],'Organi colpiti:',$rb['organi']);
					quaddata($pdf,"Varieta':",$rb['varieta'],'Codice campione:',$rb['codice']);
					quaddata($pdf,'Data impianto:',$rb['data_impiantox'],"Superficie dell'appezzamento [mq]:",$rb['appezzamento']);
					quaddata($pdf,'Piante campionate visivamente:',$rb['piante_camp_vis'],'Coltura precedente:',$rb['coltura_prec']);
					quaddata($pdf,'n. Piante infestate:',$rb['piante_infest'],'Sup. campionata visivamente [mq]:',$rb['sup_vis']);
					quaddata($pdf,'Superficie infestata [mq]:',$rb['sup_infest'],'n. Piante abbattute:',$rb['no_abbatt']);
					quaddata($pdf,'Tempo impiegato: [min]',$rb['tempo'],'','');
					bidata($pdf,"Sintomi sospetti,pericolosita' e note:",'');
					multidata($pdf,$rb['sospetti']);
					line($pdf);
					lempty($pdf);
				}
				$no++;
			}

			head($pdf,"TRAPPOLE CONTROLLO/CAMBIO FEROMONE");
			$db->Read($sqlb1);
			while($rb = $db->fetch_assoc()) {
				if (true) {		// 20220126
					bidata($pdf,"Osservazione N. $no (ID: $rb[idosservazioni])",'',$tinyfont);
					bidatax($pdf,'Codice trappola:',$rb['trappole_geometry_codice']);
					quaddata($pdf,'Pianta ospite:',$rb['host_full_name'],'Organismo nocivo',$rb['pest_full_name']);
					quaddata($pdf,'Numero individui catturati:',$rb['catture'],'Campione per laboratorio:',$rb['campione_lab']);
					quaddata($pdf,'Risultato:',$rb['risultato'],'Codice campione:',$rb['campioni_codice']);
					quaddata($pdf,'Tipo serie campione:',$rb['tipocampione_description'],'Elementi della serie:',$rb['elementicampione']);
					quaddata($pdf,"Superficie dell'appezzamento [mq]:",$rb['appezzamento'],'Superficie rappresentativa [mq]:',$rb['sup_vis']);
					quaddata($pdf,"Unita' rappresentative",$rb['unita_chk'],'Cambio feromone/attrattivo',$rb['cambioferomone']);
					quaddata($pdf,'Tempo impiegato: [min]',$rb['tempo'],'','');
					line($pdf);
					lempty($pdf);
				}
				else {
					bidata($pdf,'ID Osservazione:',$rc['trappole_id_osservazione']);
					bidata($pdf,'Codice trappola:',$rc['trappole_geometry_codice']);
					bidata($pdf,'Tipo trappola:',$rc['tipo_trappole_descrizione']);
					bidata($pdf,'Numero individui:',$rc['trappole_numero_individui']);
					bidata($pdf,'Numero piante:',$rc['trappole_n_piante_rap']);
					bidata($pdf,'Note:','');
					multidata($pdf,$rc['trappole_note']);
					line($pdf);
					lempty($pdf);
				}
			}

			head($pdf,"TRAPPOLE POSIZIONAMENTO/RIMOZIONE");
			$db->Read($sqlc);
			while($rc = $db->fetch_assoc()) {
				bidatax($pdf,'Codice trappola:',$rc['codice']);
				quaddata($pdf,"Attivita':",$rc['attivita'],'','');
				quaddata($pdf,'Codifica interna:',$rc['nome'],'Trappola per:',$rc['pest_full_name']);
				quaddata($pdf,'Tipo:',$rc['tipo_trappole_descrizione'],'Durata erogatore [gg]:',$rc['durata_erogatore']);
				quaddata($pdf,'Pianta ospite associata:',$rc['host_full_name'],'Superficie totale:',$rc['suptot']);
				quaddata($pdf,'Superficie rappresentativa:',$rc['suprap'],"Unita' rappresentativa:",$rc['unitrap']);
				quaddata($pdf,'Tempo impiegato [minuti per uomo]:',$rc['tempo_attivita'],'','');
				
				line($pdf);
				lempty($pdf);
			}

			head($pdf,"ABBATTIMENTI");
			$db->Read($sqld);
			while($rd = $db->fetch_assoc()) {
				quaddata($pdf,'ID Osservazione:',$rd['osservazioni_id'],'Data:',$rd['datex']);
				quaddata($pdf,"Quantita':",$rd['quantity'],'','');
			}

			//exit(0);
			doheader($fname);
			$pdf->Output();
		}
		else {
			echo "data profile '$data' not found<br>";
			vvar_dump($_REQUEST);
		}
	break;
	case 'xls':
		if ($debug) {
			echo "<b>XLS</b><br>";
		}
		if (exec_from_cli()) {
			echo "XLSOUT '$xlsout' '$fname'\n";
		}
		if (isset($sqls[$data])) {
			$xls = new PHPExcel;
			xls_do($xls,$db,$sqls,$data);
			$fname = $sqls[$data]['filename'];
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
		}
		else {
			echo "data profile '$data' not found<br>";
			vvar_dump($_REQUEST);
		}
	break;
	case 'xlscount':
		$cc = xls_count($db,$sqls,$data);
		if ($cc==-1)
			echo json_encode(['success'=>true,'count'=>-1]);
		else
			echo json_encode(['success'=>true,'count'=>$cc,'maxcount'=>$maxcount]);
	break;
	case 'xlsasync':
		$cc = xls_count($db,$sqls,$data);
		if ($cc==-1) {
			$reply = ['success'=>true,'count'=>-1];
		}
		if ($cc>$maxcount) {
			$reply = ['success'=>true,'count'=>$cc,'maxcount'=>$maxcount];
		}
		else {
			$reply = ['success'=>true,'count'=>$cc,'maxcount'=>$maxcount];
//			echo json_encode($_REQUEST) . "<br>";
//			echo json_encode($_SESSION) . "<br>";
			$query = pg_escape_string(json_encode($_REQUEST));
			$uid = $_REQUEST['uid'];
			$sql0 = "SELECT * FROM simfito.tecnici WHERE id_tecnico=$uid";
			$r = $db->FetchRow($sql0);
			$ttid = $r['idtipo_tecnico'];
			$name = 'report generale';
			$archiveposition = '';
			$fullfilename = $sqls[$data]['filename'];
			$values = "$uid,'$name','$query',now(),'$archiveposition',1,'$fullfilename',$ttid,now()";
 			$sql = "INSERT INTO simfito.reports(owner,name,query,date,archiveposition,statoreport_id,fullfilename,tipotecnico_id,runstart) VALUES($values) RETURNING id";
			$r = $db->FetchRow($sql);
			$reply['reportid'] = $r['id'];
			xls_launch($r['id']);
		}
		echo json_encode($reply);
	break;
	default:
		echo "mode '$mode' sconosciuto<br>";
		vvar_dump($_REQUEST);
	break;
	}
}

?>
