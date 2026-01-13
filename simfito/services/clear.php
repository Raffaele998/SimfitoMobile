<?php
/**
 * Created by PhpStorm.
 * User: luigi
 * Date: 19/06/15
 * Time: 11.01
 */

require_once("../etc/db_config.php");
require_once("crud.php");
/********** MAIN **********/
function errore($error_reason)
{
    $result["succes"]=false;
    $result["errors"]["reason"]=$error_reason;
    echo json_encode($result);
    exit;
}
$connection="host=localhost port=5432 user=postgres password=ariespac3 dbname=simfitolab";
//global $connection;
$db=new CRUD($connection);
if(!$db->connect())
    echo "errore di connessione";
$db->SQL("SET search_path TO public, simfito, eppo");
$sql=" delete from simfitolab.report_performed_analysis;
      delete from simfitolab.perfomed_analysis;
      delete from simfitolab.analytical_sample;
      delete from simfitolab.cultures_demand_analysis;
      delete from simfitolab.attachment_perfomed_analysis;
      delete from simfitolab.report;
      delete from simfitolab.request_analysis;
      delete from simfitolab.reason_rejection;
      delete from simfitolab.demand_analysis;
      delete from simfitolab.technical;
      delete from simfitolab.company;
      delete from simfitolab.why;
      delete from simfitolab.dest_cepica;
      delete from simfitolab.dest_cc;
      delete from simfitolab.municipality;
      delete from simfitolab.spread_symptom;";

if(!$db->SQL($sql)) {
    errore("Errore nella query");
}else{
    echo "done!";
};
