<?php
/**********************************************************************************************
*input vettore $arr nel quale bisogna cercare l'occorrenza $find							  *
*output posizione, nel vettore, dell'occorrenza trovata.	                                  *
**********************************************************************************************/
function FindArrayKeyByValue($arr, $find){
	$found_key = -1;
	$arr_keys = array_keys($arr);
	foreach ($arr_keys as $key){
		if ($arr[$key] == $find){
			$found_key = $key;
			break;
		}
	}
	return $found_key;
}

/**********************************************************************************************
*input numero classi n																		  *
*output matrice con valori, nelle colonne, rgb (esadecimale)                                  *
*per il corretto utilizzo in html utilizzare la funzione printf('%O2X', valore).			  *
**********************************************************************************************/

function classifica($n){
	$Rs=0;$Gs=0;$Bs=255; //blue
	$Ri=255;$Gi=255;$Bi=0; //giallo
	$Re=255;$Ge=0;$Be=0; //rosso
	$step=512/$n;
	$count=0;
	for ($x=0;$x<255;$x+=$step){
		$C[$count][0]=$Rs+$x;
		$C[$count][1]=$Gs+$x;
		$C[$count][2]=$Bs-$x;
		$count++;
	}
	for ($x=0;$x<256;$x+=$step){
		$C[$count][0]=$Ri;
		$C[$count][1]=$Gi-$x;
		$C[$count][2]=0;
		$count++;
	}
	return $C;
}

function classificaBR($n){
	$Rs=0;$Gs=0;$Bs=255; //blue
	//$Ri=255;$Gi=255;$Bi=0; //giallo
	$Re=255;$Ge=0;$Be=0; //rosso
	$step=255/$n;
	$count=0;
	$C[0][0]=$Rs;
	$C[0][1]=$Gs;
	$C[0][2]=$Bs;
	$C[1][0]=$Re;
	$C[1][1]=$Ge;
	$C[1][2]=$Be;
	/*for ($x=0;$x<255;$x+=$step){
		$C[$count][0]=$Rs+$x;
		$C[$count][1]=$Gs;
		$C[$count][2]=$Bs-$x;
		$count++;
	}
	/*for ($x=0;$x<256;$x+=$step){
		$C[$count][0]=$Ri;
		$C[$count][1]=$Gi-$x;
		$C[$count][2]=0;
		$count++;
	}*/
	return $C;
}

function classifica_bgry_reverse($n){
	$Rb=0;$Gb=0;$Bb=255; //blue
	$Rg=0;$Gg=255;$Bg=0; //green
	$Rr=255;$Gr=0;$Br=0; //red
	$Ry=255;$Gy=255;$By=0; //giallo
	$step=768/$n;
	for ($x=0;$x<255;$x+=$step){
		$C[$count][0]=$Ry;
		$C[$count][1]=$Gy-$x;
		$C[$count][2]=$By;
		$count++;
	}
	for ($x=0;$x<255;$x+=$step){
		$C[$count][0]=$Rr-$x;
		$C[$count][1]=$Gr+$x;
		$C[$count][2]=$Br;
		$count++;
	}
	for ($x=0;$x<255;$x+=$step){
		$C[$count][0]=$Rg;
		$C[$count][1]=$Gg-$x;
		$C[$count][2]=$Bg+$x;
		$count++;
	}
	return $C;
}
?>
