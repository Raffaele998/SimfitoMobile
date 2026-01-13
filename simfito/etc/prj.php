<?php
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

	echo '{"userprj":[
		{
			"title": "WGS 84/UTM zone 33N",
	        "srs": "EPSG:32633",
			"def": "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs"
	    },
	    {
	    	"title": "WGS 84 (geographic)",
	        "srs": "EPSG:4326",
	        "def": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs "
	    },
      {   "title": "EPSG:25832",
          "srs": "EPSG:25832",
          "def": "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
      }
	]}';
}
?>