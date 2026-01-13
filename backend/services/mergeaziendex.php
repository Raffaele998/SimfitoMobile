<?php

require_once("../etc/db_config.php");
require_once("crud.php");

function mergeazienda($destid,$srcid) {
global $db;
	echo "MERGE $srcid -> $destid\n";
	if (true) {
		$sql = "SELECT partita_iva FROM azienda WHERE id_azienda=$destid";
		$r = $db->FetchRow($sql);
		$destiva = $r['partita_iva'];

		$sql = "SELECT partita_iva FROM azienda WHERE id_azienda=$srcid";
		$r = $db->FetchRow($sql);
		$srciva = $r['partita_iva'];

		$sql = "UPDATE siti SET piva_azienda='$destiva' WHERE piva_azienda='$srciva'";
		$db->SQL($sql); 

		$db->SQL("DELETE FROM azienda WHERE id_azienda=$srcid"); 
	}
}


$destid = $argv[1];
$srcids = $argv[2];


if ($destid=='' || $srcids=='') {
	echo "NO DEST o SRC\n";
	exit(0);
}

global $connection;
global $att_path;
$db=new CRUD($connection);
$db->connect();
$db->SQL("SET search_path TO public, simfito, eppo");

$srcidx = explode(',',$srcids);
echo "SIZE " . count($srcidx) . "\n";
foreach($srcidx as $srcid) {
	mergeazienda($destid,$srcid);
}

?>
