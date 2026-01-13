<?php

function build_shape($prv,$anno) {
	$shapename = 'aromiabungii_' . $prv . '_' . $anno;
	$sql = "SELECT * FROM tabellonex WHERE \\\"sito provincia\\\"='$prv' AND extract(year from \\\"data sopralluogo\\\")=$anno";
	@mkdir('/tmp/xxx');
	$dstname = "/tmp/xxx/$shapename.shp";
	$srcname = 'PG:host=localhost  user=postgres password=ariespac3 dbname=simfito2';
	$cmd =  "ogr2ogr -skipfailures -overwrite -sql \"$sql\" ";
	$cmd .= "-a_srs EPSG:32633 -t_srs EPSG:32633 -s_srs EPSG:4326 ";
	$cmd .= "-f 'ESRI Shapefile' $dstname \"$srcname\"";
//	echo "$cmd\n";
	exec($cmd);
	$cmd = "zip -D -j /tmp/$shapename.zip /tmp/xxx/*.*";
//	echo "$cmd\n";
	exec($cmd);
	return array("$shapename.zip","/tmp/$shapename.zip");
}

	$prv = $_REQUEST['prv'];
	$anno = $_REQUEST['anno'];
	$rr = build_shape($prv,$anno);
	$fs = filesize($rr[1]);
	header('Pragma: no-cache');
	header('Expires: 0');
	//header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Content-Type: application/force-download');
	header('Content-Type: application/octet-stream');
	header('Content-Type: application/download');;
	header("Content-Disposition: attachment;filename=$rr[0]");
	header("Content-Length: $fs");
	header('Content-Transfer-Encoding: binary ');

	readfile($rr[1]);
	@exec("rm $rr[1]");
	@exec("rm /tmp/xxx/*");
?>

