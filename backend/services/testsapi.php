<?php

// test della modalita' di esecuzione degli script

	echo "MODE " . php_sapi_name() . " <br>\n";
	if (php_sapi_name()=='cli') {
		echo (isset($argv)  ? 'true':'false') . "\n";
		echo json_encode($argv) ."\n";
		echo (isset($_REQUEST)  ? 'true':'false') . "\n";
		echo json_encode($_REQUEST) . "\n";
		echo json_encode($_SERVER) . "\n";
	}
	else {
		echo (isset($argv)  ? 'true':'false') . "<br>";
		echo json_encode($argv) ."<br>";
		echo (isset($_REQUEST)  ? 'true':'false') . "<br>";
		echo json_encode($_REQUEST) . "<br>";
		echo json_encode($_SERVER) . "<br>";
	}

?>