<?php
//
// procedura d'importazione dei dati dai vecchi vettori in export_pest.php
// sa usarsi previo setup di $export_pest_year al valore giusto nel suddetto file
// e sopratutto UNA-TANTUM!
//

require_once("../etc/db_config.php");
require_once('export_pest.php');
$connection="host=localhost port=5432 user=postgres password=ariespac3 dbname=simfito4";

$conn = pg_connect($connection);

foreach($macropests as $n=>$v) {
	$v1 = json_encode($v);
	echo "$n $v1\n";
	$values = "'$n',$export_pest_year,'$v1'";
	$sql = "INSERT INTO simfito.reportue(nomereport,anno,pest) VALUES($values)";
	echo "$sql\n";
	pg_query($conn,$sql);
}
