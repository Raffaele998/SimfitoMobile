<?php
//
// routine per la stampa delle mappe 
//

// ricalcola un bounding box in modo da matchare le dimensioni xsz e ysz
function rebox($in,$xsz,$ysz,$test=false) {
$out = array();
$xc = ($in[0]+$in[2])/2;	// centro dell'immagine
$yc = ($in[1]+$in[3])/2;
$xs = $in[2]-$in[0];		// dimensione orizzontale
$ys = $in[3]-$in[1];		// dimensione verticale

$xr = $xs/$xsz;
$yr = $ys/$ysz;

$ir = $ys/$xs;			// rateo del raster
$rr = $ysz/$xsz;		// rateo dell'immagine

	if ($test) {
		echo "REBOX<br>";
		echo "<b>center</b> xc $xc yc $yc<br>";
		echo "<b>size</b> xs $xs ys $ys<br>";
		echo "<b>ratio</b> xr $xr yr $yr<br>";
	}
	if ($xr>$yr) {
		$xd = $xs;
		$yd = $xd*$ysz/$xsz;
	}
	else if ($xr<$yr) {
		$yd = $ys;
		$xd = $yd*$xsz/$ysz;
	}
	else {
		$xd = $xs;
		$yd = $ys;
	}
	$or = $yd/$xd;
	if ($test) {
		echo "<b>newsize</b> $xd $yd<br>";
		echo "<b>ratios</b> $ir $rr $or<br>";
	}
	$out[0] = $xc-$xd/2;
	$out[1] = $yc-$yd/2;
	$out[2] = $xc+$xd/2;
	$out[3] = $yc+$yd/2;

	if ($test)
		echo "REBOX<br>";
	return $out;
}

// compone una richiesta wms
function wmsreq($base,$layers,$bb,$xres,$yres,$format='image/png') {
	$version = '1.1.0';
	if($base=='')
		$base = "http://localhost:8080/geoserver/wms?service=WMS&version=$version&request=GetMap";
	$ll = "layers=$layers";
	$bbox = "bbox=$bb[0],$bb[1],$bb[2],$bb[3]";
	$res = "&width=$xres&height=$yres";
	$ff ="format=$format";
	$wmsr = "$base&$ll&styles=&$bbox$res&srs=EPSG:3857&$ff";
	return $wmsr;
}

// scarica un'immagine e la salva su filew
function build_img($tmpn1,$wmsreq1) {
	$datawms = file_get_contents($wmsreq1);
	$f = fopen($tmpn1,'w');
	fwrite($f,$datawms);
	fclose($f);
	chmod($tmpn1,0777);
}


// http://$hostapp/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=10&LAYER=simfito:incidenzapercomune
// scarica l'immagine di una legenda e la salva su file
function build_legend($fname,$layer) {
	$version = '1.0.0';
	$url = "http://localhost/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=$version&FORMAT=image/png&WIDTH=10&HEIGHT=10&LAYER=$layer";
	$datawms = file_get_contents($url);
	$f = fopen($fname,'w');
	fwrite($f,$datawms);
	fclose($f);
	chmod($fname,0777);
}

// 
// generazione del pdf composto da: titolo,immagine wms, legende dei layer
//
// $pdf		OGGETTO PDF
// $mode	__NON USATO__
// $title	TITOLO DEL PDF
// $dotXmm	__NON USATO__
// $epsg	EPSG DEI DATI
// $bbox	BOUNDING BOX DEI LAYER
// $layers	VETTORE DEI LAYER DA STAMPARE
// $r		VETTORE BOX DELL'IMMAGINE x,y,w,h
// $r1		VETTORE BOX DELLA LEGENDA 
// $r2		VETTORE BOX DEL TITOLO x,y,w
// $wh		VETTORE DIMENSIONE IMMAGINE WMS
//
function export_print($pdf,$mode,$title,$dotXmm,$epsg,$bbox,$layers,$r,$r1,$r2,$wh) {

	//$pdf->Rect($r2['x']-1, $r2['y'], $r2['w']+2, $r2['h']);
	//$pdf->Rect($r1['x']-1, $r1['y']-1, $r1['w']+2, $r1['h']+2);
	if ($title!='') {
		$pdf->SetXY($r2['x'],$r2['y']+1);
		$pdf->Cell($r2['w'],6,$title);		
	}
	$xll = 'simfito:OSM-WMS,'; //'simfito:openstreetmap_all,';
	$xvp = ',';
	foreach($layers as $ll) {
		$xll .= $ll['params']['LAYERS'] . ",";
		$xvp .= $ll['params']['viewparams'] .",";
		$tmpxx = tempnam('/tmp','SML_') . '.png';
		$tmpx[] = $tmpxx;
		$titles[] = $ll['params']['title'];
		//echo "LEG $tmpxx<br>"; 
		build_legend($tmpxx,$ll['params']['LAYERS']);
		$legendsz[] = getimagesize($tmpxx);

	}
	//var_dump($legendsz);echo '<br>';
	//exit(0);
	$xll = substr($xll,0,-1);
	$xvp = substr($xvp,0,-1);
	$slayers = "$xll&viewparams=$xvp";
	$url = wmsreq('',$slayers,$bbox,$wh['w'],$wh['h']);
	$tmpn1 = tempnam('/tmp','SMI_');
	build_img($tmpn1,$url);
	//echo "URL $tmpn1 $url<br>";exit(0);
	$pdf->Rect($r['x']-1, $r['y']-1, $r['w']+2, $r['h']+2);
	$pdf->Image($tmpn1,$r['x'],$r['y'],$r['w'],$r['h'],'PNG');

	// stampa delle legende
	$pdf->SetFontSize(8);
	$yy = $r1['y'];
	$pdf->SetXY($r1['x'],$yy);
	$pdf->SetFont('','B');
	$pdf->MultiCell($r1['w'],5,"Legenda:");

	$maxy = intval($pdf->GetPageHeight());
	$nmaxy = $maxy-20;
	$yy = $pdf->GetY();
	$nlegend = count($tmpx); 
	for($i=0;$i<$nlegend;$i++) {
		if (true) {						// stampa del nome del layer
			$lwh = $legendsz[$i];
			$eh = intval($r1[w]/$lwh[0]*$lwh[1]);

			$pdf->SetXY($r1['x'],$yy);
			$pdf->MultiCell($r1['w'],5,$titles[$i]); // . " (yy $yy - r1.x  $r1[x] r1.y $r1[y] r1.w $r1[w] r1.h $r1[h] , lwh $lwh[0] $lwh[1]) $eh" );
			$yy = $pdf->GetY();
		}
		if (true) {
			$lwh = $legendsz[$i];
			$ww = $lwh[0]/4;
			$hh = $lwh[1]/4;
			$fh = $hh;
			$pdf->Image($tmpx[$i],$r1['x'],$yy,$ww,$hh);
			//$pdf->Rect($r1['x'],$yy,$ww,$hh);
		
		}
		else {		// versione originale stampa ad minchiam le legende
		if (true) {						// stampa dell'immagine
			$lwh = $legendsz[$i];
			$ah = $nmaxy-$yy;
			$eh = intval($r1['w']/$lwh[0]*$lwh[1]);
			//echo "_mm_ $r1[w] $yy $ah $eh _px_ $lwh[0] $lwh[1]<br>";

			if ($eh>$ah) {		// 
				$ww = 0;
				$hh = $ah;
				$fh = $eh; 
			}
			else {
				$ww = 0; // $r1['w'];
				$hh = 0;
				$fh = -1;
			}
			//echo "$yy,$ww,$hh,$fh<br>";
			$pdf->Image($tmpx[$i],$r1['x'],$yy,$ww,$hh);
			if ($fh==-1) {
				$fh = $pdf->GetY()-$yy;
			}
		}
		}
		$yy += $fh;
	}
	//exit(0);
}

// costruisce l'url per il download di una immagine ( anche multilayer e con viewparams )
function export_url($pdf,$mode,$epsg,$bbox,$layers,$r,$r1,$wh) {
	$xll = 'simfito:OSM-WMS,'; //'simfito:openstreetmap_all,';
	$xvp = ',';
	foreach($layers as $ll) {
		$xll .= $ll['params']['LAYERS'] . ",";
		$xvp .= $ll['params']['viewparams'] .",";
	}
	$xll = substr($xll,0,-1);
	$xvp = substr($xvp,0,-1);
	$slayers = "$xll&viewparams=$xvp";
	$url = wmsreq('',$slayers,$bbox,$wh['w'],$wh['h']);
	return $url;
}


?>
