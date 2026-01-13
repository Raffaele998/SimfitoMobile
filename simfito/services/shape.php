<?php
//header('Content-type: text/xml'); 
header('Content-Disposition: attachment;filename=shp.kml ');
require_once('../etc/db_config.php');
require_once('function.php');
require_once("crud.php");
//chiave di classivicazione
$fumetto=0;
global $connection;
$db=new CRUD($connection);
$db->connect();
$db->SQL("SET search_path TO public, simfito, eppo");
$sql="SELECT nome,provincia,superficie,ST_AsKML(the_geom) FROM comuni";
$db->Read($sql);
$i=0;
while ($row=$db->fetch_assoc()){
	$data[$i++]=$row;
}
$key="provincia";//chiave di classifica
$selected=Array("nome","provincia","superficie");
$sql2="SELECT count(DISTINCT $key) AS classi FROM comuni";
$db->Read($sql2);
while ($row2=$db->fetch_assoc()){
	$classi=$row2['classi'];
}

$maxDATA=count($data);
//$select=select($connessione,$id);
//genera la matrice coi codici rgb esadecimale per i colori
$colore=classifica($classi);

$header0='<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
<Document>
	<name>Comuni</name>';
//genera i colori delle classi
$header='	<Folder>
		<name>Comuni</name>
		<open>1</open>
		<Style id="highlightState">
			<LineStyle>
				<color>ff000000</color>
				<width>0.4</width>
			</LineStyle>
			<PolyStyle>
				<color>641E90FF</color>
			</PolyStyle>
		</Style>
		
		<Snippet maxLines="0"></Snippet>';
$poly=$header;
	
for ($i=0;$i<$maxDATA;$i++){
	$folder='			
		<Placemark>';
	if ($fumetto==0){
		$folder.='<name>'.$data[$i]['nome'].'</name>
			<Snippet maxLines="0"></Snippet>';
		$folder.='<description><![CDATA[';
		foreach($selected as $desc)
			$folder.="$desc: ".$data[$i]["$desc"]."<br/>";
		$folder.=']]>
				</description>';
	}
	for ($z=0;$z<count($classi);$z++) 
		if($data[$i]["$key"]==$classi[$z]) 
			$x=$z;//meglio funzione di ricerca.
	$folder.='		<styleUrl>#sn-pushpin'.$x.'</styleUrl><StyleSelector><styleUrl>#highlightState</styleUrl></StyleSelector>
			'.$data[$i]["st_askml"].'
		</Placemark>';
	$poly.=$folder;
	$i."<br>";
}
$foother='
	</Folder>
</Document>
</kml>';

for($i=0;$i<$classi;$i++) {
	echo '<Style id="sn-pushpin'.$i.'"><Pair><key>normal</key><LineStyle><color>ff000000</color><width>0.4</width></LineStyle>';
	if ($fumetto==0){
		echo '<PolyStyle><color>'.dechex($trasparency);//9a'
		printf('%02X%02X%02X',$colore[$i][2],$colore[$i][1],$colore[$i][0]);
		echo '</color></PolyStyle></Pair>';
	}
	else
		echo '<PolyStyle><color>9a</color></PolyStyle></Pair>';
		echo '<Pair><key>highlight</key><styleUrl>#highlightState</styleUrl></Pair>';
	echo '</Style>';
}

echo $poly.$foother;
?>
