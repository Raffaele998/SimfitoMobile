<?php
$sc = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl';

$sc = 'http://ec.europa.eu/taxation_customs/vies/checkVatTestService.wsdl';

$client = new SoapClient($sc);
$fun = $client->__getFunctions();
foreach($fun as $f) {
	echo "FUNC: $f\n";
}

$typ = $client->__getTypes();
foreach($typ as $t) {
	echo "TYPE:\n";
	echo "$t\n";
}

if (true) {
$call = 'checkVat';
$parms = array('countryCode' => 'IT','vatNumber' => '05291901212');
$reply = $client->__soapCall($call,array($parms));

var_dump($reply);
}
?>
