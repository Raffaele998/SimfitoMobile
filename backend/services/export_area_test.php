<?php
//
// test minimo del find_areas
//

require_once('crud.php');
require_once('../etc/db_config.php');
require_once('messages.php');

require_once('export_area.php');

$db=new CRUD($connection);
$db->connect();
$db->SQL("SET search_path TO public, simfito, eppo");

echo "EXPORT_AREA_TEST\n";

$res = find_areas(4879,'CERAFP',2024,'2024-01-26');

echo "RES:: ";var_dump($res);

?>
