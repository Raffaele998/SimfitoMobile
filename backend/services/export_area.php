<?php
//
// gestione delle aree per i vari report
// 

//
// buffer nativi
// prende i siti dalle osservazioni
// parametri %pestcode%,%start%,%end%,%tiposito%,%buffer1%,%buffer2%,%buffer3%,%gid%
//
$simbuffersql = "WITH yy as (
	WITH xx AS (
         SELECT st_transform(siti.the_geom, 32633) AS gg,
            osservazioni.pestcode
           FROM simfito.siti
             JOIN simfito.scheda ON scheda.gid_sito = siti.gid
             JOIN simfito.osservazioni ON osservazioni.idscheda = scheda.idscheda
             LEFT JOIN simfitolab.analisys ON osservazioni.idosservazioni = analisys.osservazioni_id
             LEFT JOIN simfitolab.analisysresult ON analisys.analisysresult_id = analisysresult.id
          WHERE osservazioni.pestcode = '%pestcode%' AND scheda.data_sopralluogo >= '%start%' AND scheda.data_sopralluogo <= '%end%' and scheda.stato=2 
                AND (((osservazioni.campioni_id = (-1) OR osservazioni.campioni_id IS NULL) AND osservazioni.rilevato = 1) 
			OR (osservazioni.campioni_id <> (-1) AND analisysresult.positive = 1)
		) AND (case when ('%tiposito%'='null') then true else tipologiasito_id= %tiposito% end)
        )
 SELECT 1 AS id, 1 AS xtype, st_union(st_buffer(xx.gg, %buffer1%, 16)) AS the_geom FROM xx
UNION
 SELECT 2 AS id, 2 AS xtype, st_difference(st_union(st_buffer(xx.gg, %buffer2%, 16)), st_union(st_buffer(xx.gg, %buffer1%, 16))) AS the_geom FROM xx
UNION
 SELECT 3 AS id, 3 AS xtype, st_difference(st_union(st_buffer(xx.gg, %buffer3%, 16)), st_union(st_buffer(xx.gg, %buffer2%, 16))) AS the_geom FROM xx),
zz AS ( SELECT gid,the_geom FROM simfito.siti WHERE gid=%gid%) 
 SELECT zz.gid,st_intersects(st_transform(zz.the_geom,32633),yy.the_geom) as intersect, yy.xtype FROM yy,zz order by xtype
";

//
// buffer utente
// prende le geometrie direttamente dalla tabella
// usando la geometria principale e i buffer  
// parametri %id%,%buffer2%,%buffer3%,%gid%
//
$simbuffer2sql = "WITH yy as (
	WITH xx AS (
         SELECT st_transform(the_geom, 32633) AS gg
           FROM simfito.areas
         WHERE id=%id% 
    )
 SELECT 1 AS id, 1 AS xtype, xx.gg AS the_geom FROM xx
UNION
 SELECT 2 AS id, 2 AS xtype, st_difference(st_buffer(xx.gg, %buffer2%, 16), xx.gg) AS the_geom FROM xx
UNION
 SELECT 3 AS id, 3 AS xtype, st_difference(st_buffer(xx.gg, %buffer3%, 16), st_buffer(xx.gg, %buffer2%, 16)) AS the_geom FROM xx),
zz AS ( SELECT gid,the_geom FROM simfito.siti WHERE gid=%gid%) 
 SELECT zz.gid,st_intersects(st_transform(zz.the_geom,32633),yy.the_geom) as intersect, yy.xtype FROM yy,zz order by xtype";

//
// buffer utente
// prende le geometrie direttamente dalla tabella
// usando le 3 geometrie the_geom the_geom_t the_geom_c   
// parametri %gid%
//
$simbuffer3sql = "WITH yy as (
	WITH xx AS (
         SELECT st_transform(the_geom, 32633) AS gg,st_transform(the_geom_t, 32633) AS gg_t,st_transform(the_geom_c, 32633) AS gg_c
           FROM simfito.areas
         WHERE id=%id% 
    )
 SELECT 1 AS id, 1 AS xtype, xx.gg AS the_geom FROM xx
UNION
 SELECT 2 AS id, 2 AS xtype, st_difference(xx.gg_t,xx.gg) AS the_geom FROM xx
UNION
 SELECT 3 AS id, 3 AS xtype, st_difference(xx.gg_c,xx.gg_t) AS the_geom FROM xx),
zz AS ( SELECT gid,the_geom FROM simfito.siti WHERE gid=%gid%) 
 SELECT zz.gid,st_intersects(st_transform(zz.the_geom,32633),yy.the_geom) as intersect, yy.xtype FROM yy,zz order by xtype";


//
// main query per l'area
// PARAMETRI %pest%,%data_sopralluogo%
//
$sqlareamain = "SELECT params->>'viewparams' as vp,* FROM simfito.areas WHERE enabled AND pest='%pest%' AND datefrom<='%data_sopralluogo%' ORDER BY datefrom DESC LIMIT 1";

function pest_name($ipest) {
global $db;
	$sqlfn = "SELECT full_name,b_code,isolang,preferred FROM eppo.t_bayname bn INNER JOIN eppo.t_baycode bc ON bc.codeid=bn.codeid where isolang in ('la') AND b_code='%pest%' ORDER BY preferred DESC";
	$sqlfn = str_replace('%pest%',$ipest,$sqlfn);
	$rfn = $db->FetchRow($sqlfn);
	return $rfn['full_name'];

}

$areatypes = [
	'Non infestata',
	'Area infestata',
	'Area tampone',
	'Area contenimento',
];

function bufferarea($buffer1,$buffer2,$buffer3,$tiposito,$pestcode,$start,$end,$gid_sito) {
global $simbuffersql,$simbuffer2sql,$simbuffer3sql,$sqlareamain;
	$sqlbuff = str_replace(
		['%buffer1%','%buffer2%','%buffer3%','%tiposito%','%pestcode%','%start%','%end%','%gid%'],
		[$buffer1,$buffer2,$buffer3,$tiposito,$pestcode,$start,$end,$gid_sito],
		$simbuffersql);
	return $sqlbuff;
}

function bufferareaex($areaid,$gid_sito,$zero,$tampone,$contenimento) {
global $simbuffersql,$simbuffer2sql,$simbuffer3sql,$sqlareamain;
	$sqlbuff = str_replace(
		['%id%','%gid%','%buffer1%','%buffer2%','%buffer3%'],
		[$areaid,$gid_sito,$zero,$tampone,$contenimento],
		$simbuffer3sql);
	return $sqlbuff;
}

function find_areas($gid,$ipest,$year,$date) {
global $db;
global $simbuffersql,$simbuffer2sql,$simbuffer3sql,$sqlareamain;
global $areatypes;
//	echo "FIND_AREAS $gid,$ipest,$year,$date\n";
	$sqlrr = str_replace(['%pest%','%data_sopralluogo%'],[$pest,$date],$sqlareamain);
	$rr = $db->FetchRow($sqlrr);
	if ($rr===false) {
		echo "NO AREA\n";
		echo "areatype: -1 Area non definita\n";
		$fn = pest_name($ipest);
		$pestrep = [$ipest,-1,'Area non definita',$fn];
	} 
	else {
		echo "$rr[id],$rr[datefrom],$rr[dateto]\n";
		$vp = $rr['vp'];
		$vpx = explode(';',$vp);
		for($i=0;$i<count($vpx);$i++) {
			$vv = explode(':',$vpx[$i]);
			$vps[$vv[0]] = $vv[1];
		}
		$areaid = $rr['id'];
		if ($rr['the_geom']!='') {
			$geom = true;
		}
		else {
			$geom = false;
		}
		if ($rr['dateto']!='') {
			if ($date<=$rr['dateto']) {
				$match = true;
			}
			else {
				$match = false;
			}
		}
		else {
			$match = true;
		}
		echo "match/geom: " . ($match ? "Si " : "No ") . ($geom ? "Si " : "No ") . "\n";
		if ($match) {
			if ($geom) {
				$sqlbuff = str_replace(
					['%id%','%gid%','%buffer1%','%buffer2%','%buffer3%'],
					[$areaid,$gid,0,$rr['tampone'],$rr['contenimento']],
					$simbuffer3sql);
			}
			else {
				$sqlbuff = str_replace(
					['%buffer1%','%buffer2%','%buffer3%','%tiposito%','%pestcode%','%start%','%end%','%gid%'],
					[$vps['buffer1'],$vps['buffer2'],$vps['buffer3'],$vps['tiposito'],$vps['pestcode'],$vps['start'],$vps['end'],$gid],
					$simbuffersql);
			}
			//echo "$sqlbuff\n";
			$rb = $db->ReadAll($sqlbuff);
			//echo json_encode($rb) . "\n";
			$am = 0;
			for($j=0;$j<count($rb);$j++)  {
				if($rb[$j]['intersect']=='t') {
					$am = $rb[$j]['xtype'];
					break;
				}
			}
			echo "areatype: $am $areatypes[$am]\n";
			$fn = pest_name($ipest);
			$pestreps = [$ipest,$am,$areatypes[$am],$fn];
		}
	}
	return $pestrep;
}

?>