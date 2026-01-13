<?php
/**
 * Created by PhpStorm.
 * User: luigi
 * Date: 13/01/15
 * Time: 10.53
 */

function flog_text($txt) {
    $f = fopen("/tmp/myLog.txt","a");
    fprintf($f,"$txt\n");
    fclose($f);
}

function fvar_dump($title,$data) {
    $f = fopen("/tmp/myLog.txt","a");
    fprintf($f,"$title\n");
    if (is_array($data)) {
        foreach($data as $i=>$v) {
            fprintf($f,"$i ");
            if (is_array($v))
                fprintf($f,"array!!");
            else
                fprintf($f,$v);
            fprintf($f,"\n");
        }
    }    
    else {
        fprintf($f,$data);
    }
    fprintf($f,"....\n");
    fclose($f);
}

function xvar_dump($title,$data) {
	echo "$title:";
	if (is_array($data))
	 	var_dump($data);
	else
	 	echo $data;
	echo "<br>";
}

function errore($error_reason)
{
	$result["succes"]=false;
	$result["errors"]["reason"]=$error_reason;
	echo json_encode($result);
	exit;
}
 
if($_SERVER['REQUEST_METHOD'] == "OPTIONS"){
    header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
	header('Access-Control-Allow-Headers: X-PINGARUNER, X-Requested-With');
	header('Access-Control-Max-Age: 1728000');
	header("Content-Length: 0");
	header("Content-Type: text/plain");
}
else{
	header("Access-Control-Allow-Origin: *"); 
	if(isset($_REQUEST["url"])){
		//var_dump($_REQUEST);
		echo file_get_contents($_REQUEST["url"]);
	}
	else {
		errore("Error: Undefined url");
	}
}
    
?>