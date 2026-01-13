<?php

/*
 * 
 * GESTIONE DELLE MAIL asincrone 
 * 1) protocollo mancante
 * 2) chiusura schede con pest ad alta priorita'
 *
 */

/*

-- PER GLI ADMIN PROVINCIALI --
with x as (
with 
t as (
	select nome || ' ' || cognome as admin_full,email,id_provincia from simfito.tecnici where idtipo_tecnico=0
),
s as (
	select idscheda, tecnici.nome || ' ' || tecnici.cognome as tecnico_full, tecnici.email as tecnico_email ,data_sopralluogo, siti.comune_istat, comunicampani.cod_pro
	from simfito.scheda
	inner join simfito.tecnici on scheda.id_tecnico=tecnici.id_tecnico
	inner join simfito.siti on scheda.gid_sito=siti.gid
	inner join comunicampani on siti.comune_istat=comunicampani.pro_com::text
	where (protocollo is null or trim(both ' ' from protocollo)='' )  and scheda.stato=2 and 
	date_part('days',now()-data_sopralluogo)::integer%10=8 and 
	data_sopralluogo<now()-'30 days'::interval and
	data_sopralluogo>'2018-06-20'
)
select * from t inner join s on t.id_provincia=s.cod_pro
)
select admin_full,email,tecnico_full,string_agg(idscheda::text,',') from x
group by admin_full,email,tecnico_full
order by admin_full,tecnico_full

-- PER GLI ADMIN GENERALI --

with x as (
with 
t as (
	select nome || ' ' || cognome as admin_full,email,id_provincia from simfito.tecnici where idtipo_tecnico=0
),
s as (
	select idscheda, tecnici.nome || ' ' || tecnici.cognome as tecnico_full, tecnici.email as tecnico_email ,data_sopralluogo
	from simfito.scheda
	inner join simfito.tecnici on scheda.id_tecnico=tecnici.id_tecnico
	where (protocollo is null or trim(both ' ' from protocollo)='' )  and scheda.stato=2 and 
	date_part('days',now()-data_sopralluogo)::integer%10=8 and 
	data_sopralluogo<now()-'30 days'::interval and
	data_sopralluogo>'2018-06-20'
)
select * from t cross join s
)
select admin_full,email,tecnico_full,string_agg(idscheda::text,',') from x
group by admin_full,email,tecnico_full
order by admin_full,tecnico_full

*/

require_once('crud.php');
require_once('../etc/db_config.php');
require_once('messages.php');

require_once('export_area.php');

$db=new CRUD($connection);
$db->connect();
$db->SQL("SET search_path TO public, simfito, eppo");

$startdt = '2023-01-01';
$tec_modday = 10;
$tec_modtrg = 1;
$adm_modday = 10;
$adm_modtrg = 1;
$adm_delay  = 30;

$tec_subj = "Schede con protocollo mancante";
$tec_body = "Gentile %fullname%,\nle schede di seguito riportate risultano essere prive del protocollo.\nSi prega di inserirlo\n\n%schede%.\n\n Distinti saluti, SIMFITO";
$adm_subj = "Schede con protocollo mancante";
$adm_body = "Gentile %fullname%,\nle schede di seguito riportate risultano essere prive del protocollo.\n\n";
$adm_bodyt= "\n\n Distinti saluti, SIMFITO";

$today = new Datetime('now');
$todays = $today->format('Y-m-d');

$mode = (isset($argv[1]) ? $argv[1] : '');

$outf = fopen('log/message_service.log','a');
fwrite($outf,"---- MODE '$mode' TODAY $todays STARTDT $startdt ----\n");

switch($mode) {
case 'protocollo-tecnici':
	$sql = "
with x as (
	select idscheda, tecnici.nome || ' ' || tecnici.cognome as tecnico_full, tecnici.email,
	data_sopralluogo,date_part('days',now()-data_sopralluogo)::integer%10,
	date_part('days',now()-data_sopralluogo)::integer%10=8
	from simfito.scheda
	inner join simfito.tecnici on scheda.id_tecnico=tecnici.id_tecnico
	where (protocollo is null or trim(both ' ' from protocollo)='' ) and stato=2 and 
		date_part('days',now()-data_sopralluogo)::integer%$tec_modday=$tec_modtrg and 
		data_sopralluogo>'$startdt'
	order by email,idscheda
)
select string_agg(idscheda::text,',') as ids,string_agg(to_char(data_sopralluogo,'YYYY-MM-DD'),',') as dss,tecnico_full,email from x
group by tecnico_full,email order by email";
	fwrite($outf,"$sql\n"); 
	$db->Read($sql);
	while($r=$db->fetch_assoc()) {
		fwrite($outf,json_encode($r,true) . "\n");
		$body = str_replace(['%fullname%','%schede%'],[$r['tecnico_full'],$r['ids']],$tec_body);
		fwrite($outf,".... $email\n");
		fwrite($outf,".... $tec_subj\n");
		fwrite($outf,".... $body\n");
		$rc = simfito_sendmail($email,$tec_subj,$body);
		fwrite($outf,">>>> " . json_encode($rc,true) . "\n");
	}
break;
case 'protocollo-pradmin':
	$sql = "
with x as (
with 
t as (
	select nome || ' ' || cognome as admin_full,email,id_provincia from simfito.tecnici where idtipo_tecnico=1
),
s as (
	select idscheda, tecnici.nome || ' ' || tecnici.cognome as tecnico_full, tecnici.email as tecnico_email ,data_sopralluogo, siti.comune_istat, comunicampani.cod_pro
	from simfito.scheda
	inner join simfito.tecnici on scheda.id_tecnico=tecnici.id_tecnico
	inner join simfito.siti on scheda.gid_sito=siti.gid
	inner join comunicampani on siti.comune_istat=comunicampani.pro_com::text
	where (protocollo is null or trim(both ' ' from protocollo)='' )  and scheda.stato=2 and 
	date_part('days',now()-data_sopralluogo)::integer%$adm_modday=$adm_modtrg and 
	data_sopralluogo<now()-'$adm_delay days'::interval and
	data_sopralluogo>'$startdt'
)
select * from t inner join s on t.id_provincia=s.cod_pro
)
select admin_full,email,tecnico_full,string_agg(idscheda::text,',') as ids from x
group by admin_full,email,tecnico_full
order by admin_full,tecnico_full
";

	fwrite($outf,"$sql\n"); 
	$db->Read($sql);
	$dest = '';
	$sch = [];
	$n = 0;
	while($r=$db->fetch_assoc()) {
		fwrite($outf,json_encode($r,true) . "\n");
		if ($dest=='') {
			$sch = [];
			$dest = $r['admin_full'];
			$dest_mail = $r['email'];
			$sch[$r['tecnico_full']]=$r['ids'];
			$n = 1;
		}
		else if ($dest!=$r['admin_full']) {
			fwrite($outf,"-- DO $dest $n\n");
			$body = str_replace('%fullname%',$dest,$adm_body);
			if (count($sch)>0) {
				foreach($sch as $tt=>$ss) {
					$body .= "  $tt : $ss\n";
				}
			}
			$body .= $adm_bodyt;
			fwrite($outf,".... $dest_mail\n");
			fwrite($outf,".... $adm_subj\n");
			fwrite($outf,".... $body\n");
			$rc = simfito_sendmail($dest_mail,$adm_subj,$body);
			fwrite($outf,">>>> " . json_encode($rc,true) . "\n");
			$sch = [];
			$dest = $r['admin_full'];
			$dest_mail = $r['email'];
			$sch[$r['tecnico_full']]=$r['ids'];
			$n = 1;
		}
		else {
			$n++;
			$sch[$r['tecnico_full']]=$r['ids'];
		}
	}
	if ($n>0) {
		fwrite($outf,"-- DO $dest $n\n");
		$body = str_replace('%fullname%',$dest,$adm_body);
		if (count($sch)>0) {
			foreach($sch as $tt=>$ss) {
				$body .= "  $tt : $ss\n";
			}
		}
		$body .= $adm_bodyt;
		fwrite($outf,".... $dest_mail\n");
		fwrite($outf,".... $adm_subj\n");
		fwrite($outf,".... $body\n");
		$rc = simfito_sendmail($dest_mail,$adm_subj,$body);
		fwrite($outf,">>>> " . json_encode($rc,true) . "\n");
	}
break;
case 'protocollo-admin':
	$sql = "
with x as (
with 
t as (
	select nome || ' ' || cognome as admin_full,email,id_provincia from simfito.tecnici where idtipo_tecnico=0
),
s as (
	select idscheda, tecnici.nome || ' ' || tecnici.cognome as tecnico_full, tecnici.email as tecnico_email ,data_sopralluogo
	from simfito.scheda
	inner join simfito.tecnici on scheda.id_tecnico=tecnici.id_tecnico
	where (protocollo is null or trim(both ' ' from protocollo)='' )  and scheda.stato=2 and 
	date_part('days',now()-data_sopralluogo)::integer%$adm_modday=$adm_modtrg and 
	data_sopralluogo<now()-'$adm_delay days'::interval and
	data_sopralluogo>'$startdt'
)
select * from t cross join s
)
select admin_full,email,tecnico_full,string_agg(idscheda::text,',') as ids from x
group by admin_full,email,tecnico_full
order by admin_full,tecnico_full
";

	fwrite($outf,"$sql\n"); 
	$db->Read($sql);
	$dest = '';
	$sch = [];
	$n = 0;
	while($r=$db->fetch_assoc()) {
		fwrite($outf,json_encode($r,true) . "\n");
		if ($dest=='') {
			$sch = [];
			$dest = $r['admin_full'];
			$dest_mail = $r['email'];
			$sch[$r['tecnico_full']]=$r['ids'];
			$n = 1;
		}
		else if ($dest!=$r['admin_full']) {
			fwrite($outf,"-- DO $dest $n\n");
			$body = str_replace('%fullname%',$dest,$adm_body);
			if (count($sch)>0) {
				foreach($sch as $tt=>$ss) {
					$body .= "  $tt : $ss\n";
				}
			}
			$body .= $adm_bodyt;
			fwrite($outf,".... $dest_mail\n");
			fwrite($outf,".... $adm_subj\n");
			fwrite($outf,".... $body\n");
			$rc = simfito_sendmail($dest_mail,$adm_subj,$body);
			fwrite($outf,">>>> " . json_encode($rc,true) . "\n");
			$sch = [];
			$dest = $r['admin_full'];
			$dest_mail = $r['email'];
			$sch[$r['tecnico_full']]=$r['ids'];
			$n = 1;
		}
		else {
			$n++;
			$sch[$r['tecnico_full']]=$r['ids'];
		}
	}
	if ($n>0) {
		fwrite($outf,"-- DO $dest $n\n");
		$body = str_replace('%fullname%',$dest,$adm_body);
		if (count($sch)>0) {
			foreach($sch as $tt=>$ss) {
				$body .= "  $tt : $ss\n";
			}
		}
		$body .= $adm_bodyt;
		fwrite($outf,".... $dest_mail\n");
		fwrite($outf,".... $adm_subj\n");
		fwrite($outf,".... $body\n");
		$rc = simfito_sendmail($dest_mail,$adm_subj,$body);
		fwrite($outf,">>>> " . json_encode($rc,true) . "\n");
	}
break;
case 'scheda_priority':

/*

-- per gli amministratori provinciali
with x as (
with 
t as (select nome || ' ' || cognome as admin_full,email,id_provincia from simfito.tecnici where idtipo_tecnico=1),
s as (
	select * from simfito.scheda s
	inner join simfito.osservazioni o on o.idscheda=s.idscheda
	inner join simfito.pest_priority pp on pp.baycode=o.pestcode
	inner join simfito.siti si on si.gid=s.gid_sito
	inner join comunicampani c on si.comune_istat=c.pro_com::text
	where s.idscheda=104342 and pp.priority in('Priority 1','Priority 2')
)
select t.*,s.* from s inner join t on t.id_provincia=s.cod_pro
)
select * from x

-- per gli amministratori globali
with x as (
with 
t as (select nome || ' ' || cognome as admin_full,email,id_provincia from simfito.tecnici where idtipo_tecnico=0),
s as (
	select * from simfito.scheda s
	inner join simfito.osservazioni o on o.idscheda=s.idscheda
	inner join simfito.pest_priority pp on pp.baycode=o.pestcode
	inner join simfito.siti si on si.gid=s.gid_sito
	inner join comunicampani c on si.comune_istat=c.pro_com::text
	where s.idscheda=104342 and pp.priority in('Priority 1','Priority 2')
)
select * from t cross join s
)
select admin_full,email,data_sopralluogo,string_agg(distinct PESTCODE,',') from x group by admin_full,email,data_sopralluogo
*/

//
// identifica gli ispettori provinciali per una data scheda 
// e se vanno spedite le mail
//
$sqlprov = "with x as (
with 
t as (select nome || ' ' || cognome as admin_full,email,id_provincia from simfito.tecnici where idtipo_tecnico=1),
s as (
	select s.idscheda as scheda_id,* from simfito.scheda s
	inner join simfito.osservazioni o on o.idscheda=s.idscheda
	inner join simfito.pest_priority pp on pp.baycode=o.pestcode
	inner join simfito.siti si on si.gid=s.gid_sito
	inner join comunicampani c on si.comune_istat=c.pro_com::text
	where s.idscheda=%idscheda% and o.rilevato in (1) and o.visiva and pp.priority in('Priority 1','Priority 2')
)
select t.*,s.* from s inner join t on t.id_provincia=s.cod_pro
)
select admin_full,email,scheda_id,data_sopralluogo,string_agg(distinct PESTCODE,',') as pest,gid_sito,localita,indirizzo,denominaz 
from x group by admin_full,email,scheda_id,data_sopralluogo,gid_sito,localita,indirizzo,denominaz";

//
// identifica gli ispettori generali per una data scheda 
// e se vanno spedite le mail
//
$sqladm = "with x as (
with 
t as (select nome || ' ' || cognome as admin_full,email,id_provincia from simfito.tecnici where idtipo_tecnico=0),
s as (
	select s.idscheda as scheda_id,* from simfito.scheda s
	inner join simfito.osservazioni o on o.idscheda=s.idscheda
	inner join simfito.pest_priority pp on pp.baycode=o.pestcode
	inner join simfito.siti si on si.gid=s.gid_sito
	inner join comunicampani c on si.comune_istat=c.pro_com::text
	where s.idscheda=%idscheda% and o.rilevato in (1) and o.visiva and pp.priority in('Priority 1','Priority 2')
)
select * from t cross join s
)
select admin_full,email,scheda_id,data_sopralluogo,string_agg(distinct PESTCODE,',') as pest,gid_sito,localita,indirizzo,denominaz 
from x group by admin_full,scheda_id,email,data_sopralluogo,gid_sito,localita,indirizzo,denominaz";

$areatypes = [
	'Non infestata',
	'Area infestata',
	'Area tampone',
	'Area contenimento',
];

	$admin_do = true;	// elabora la trasmissione agli amministratori
	$admpr_do = true;	// elabora la trasmissione agli amministratori provinciali
	$send_do = true;	// trasmetti le mail 
	$test_do = false;	// usa mail di test come destinatario
	$test_mail = 'marco.colandrea@ariespace.com';

	$date = date(DATE_ATOM);
	$scheda = (isset($argv[2]) ? $argv[2] : '');
	if ($scheda!='') {
		if ($admin_do) {
			$sql = str_replace('%idscheda%',$scheda,$sqladm);
			echo "ADMIN:\n$sql\n";
			$db->Read($sql);
			while($r=$db->fetch_assoc()) {
				echo "XX $r[scheda_id] $r[pest] $r[gid_sito]\n";
				$ipests = $r['pest'];
				$ipestx = explode(',',$ipests);
				$pestreps = [];
				for($i=0;$i<count($ipestx);$i++) {
					$ipest = $ipestx[$i];		
					$pestreps[] = find_areas($r['gid_sito'],$ipest,0,$r['data_sopralluogo']);
				}
				if ($test_do)
					$dest_mail = $test_mail;
				else
					$dest_mail = $r['email'];
				$subj = "Scheda con parassita ad alta priorita'";
				$body  = "La scheda ID $r[scheda_id] del $r[data_sopralluogo]\n";
				$body .= "presenta i seguenti parassiti:\n";
				for($i=0;$i<count($pestreps);$i++) {
					$pr = $pestreps[$i];
					//echo json_encode($pr) . "\n";
					$body .= "$pr[3] ( $pr[0] ) in $pr[2]\n";
				}
				if ($send_do)
					$rc = simfito_sendmail($dest_mail,$subj,$body);
				else
					$rc = 0;
				fwrite($outf,"--- SCHEDA $scheda ADMIN $date ---\n");
				fwrite($outf,"DEST: $dest_mail\n");
				fwrite($outf,"SUBJ: $subj\n");
				fwrite($outf,"BODY:\n");
				fwrite($outf,$body);
				fwrite($outf,"MAILRC: " . json_encode($rc,true) . "\n");
			}
		}
		if ($admpr_do) {
			$sql = str_replace('%idscheda%',$scheda,$sqlprov);
			echo "ADMPR:\n$sql\n";
			$db->Read($sql);
			while($r=$db->fetch_assoc()) {	
				echo "XX $r[scheda_id] $r[pest] $r[gid_sito]\n";
				$ipests = $r['pest'];
				$ipestx = explode(',',$ipests);
				$pestreps = [];
				for($i=0;$i<count($ipestx);$i++) {
					$ipest = $ipestx[$i];		
					$pestreps[] = find_areas($r['gid_sito'],$ipest,0,$r['data_sopralluogo']);
				}
				if ($test_do)
					$dest_mail = $test_mail;
				else
					$dest_mail = $r['email'];
				$subj = "Scheda con parassita ad alta priorita'";
				$body = "la scheda ID $r[scheda_id]\n";
				$body .= "presenta i seguenti parassiti:\n";
				for($i=0;$i<count($pestreps);$i++) {
					$pr = $pestreps[$i];
					//echo json_encode($pr) . "\n";
					$body .= "$pr[3] ( $pr[0] ) in $pr[2]\n";
				}
				if ($send_do)
					$rc = simfito_sendmail($dest_mail,$subj,$body);
				else
					$rc = 0;
				fwrite($outf,"--- SCHEDA $scheda ADMPR $date ---\n");
				fwrite($outf,"DEST: $dest_mail\n");
				fwrite($outf,"SUBJ: $subj\n");
				fwrite($outf,"BODY:\n");
				fwrite($outf,$body);
				fwrite($outf,"MAILRC: " . json_encode($rc,true) . "\n");
			}
		}
	}
	else {
		fwrite($outf,"scheda_priority scheda mancante \n"); 
	}
break;
default:
	fwrite($outf,"mode sconosciuto '$mode'\n"); 
break;	
}

fwrite($outf,"---- DONE ----\n");
fclose($outf);

?>
