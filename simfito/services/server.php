<?php
//
// gestione della comunicazione tra simfito e simfitolab
//
require_once("../etc/db_config.php");
require_once("crud.php");

global $connection;
global $att_path;
$db=new CRUD($connection);
$db->connect();
$db->SQL("SET search_path TO public, simfito, eppo");


?>