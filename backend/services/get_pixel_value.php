<?php
function getSignature($url){
	$response=file($url);
	$tmp=explode("=",$response[2]);
	$pixel_value=$tmp[1];
	return $pixel_value;
}

$type=$_REQUEST['type'];
$REQUEST=$_REQUEST['REQUEST'];
$BBOX=$_REQUEST['BBOX'];
$SERVICE=$_REQUEST['SERVICE'];
$VERSION=$_REQUEST['VERSION'];
$X=$_REQUEST['X'];
$Y=$_REQUEST['Y'];
$INFO_FORMAT=$_REQUEST['INFO_FORMAT'];
$QUERY_LAYERS=$_REQUEST['QUERY_LAYERS'];
$FEATURE_COUNT=$_REQUEST['FEATURE_COUNT'];
$Layers=$_REQUEST['Layers'];
$Styles=$_REQUEST['Styles'];
$WIDTH=$_REQUEST['WIDTH'];
$HEIGHT=$_REQUEST['HEIGHT'];
$format=$_REQUEST['format'];
$srs='EPSG:3857';//$_REQUEST['srs'];
$url="http://95.110.192.55:8080/geoserver/temi_generali/wms?REQUEST=$REQUEST&BBOX=$BBOX&SERVICE=$SERVICE&VERSION=$VERSION&X=$X&Y=$Y&INFO_FORMAT=$INFO_FORMAT&QUERY_LAYERS=$QUERY_LAYERS&FEATURE_COUNT=$FEATURE_COUNT&Layers=$Layers&Styles=$Styles&WIDTH=$WIDTH&HEIGHT=$HEIGHT&format=$format&srs=$srs";
/*echo $X.",".$Y."<br/>";
var_dump(file($url));*/
$result=getSignature($url);
echo $result;
?>
