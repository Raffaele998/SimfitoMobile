<?php

require("messages.php");

echo "ARGV " . count($argv) . "\n";

if (count($argv)>1) {
    $dest = $argv[1];
}
else
    $dest = 'marco.colandrea@ariespace.com';

$rc = simfito_sendmail($dest,'SIMFITO TEST','hello world');
var_dump( $rc);

//$rc = simfito_sendsms('+393478836273','simfito update');
//var_dump( $rc);

?>
