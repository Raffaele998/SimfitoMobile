<?php

/*

trappole3: esportazione delle trappole attive ad una certa data per un certo pest ( posiz. prima,rimossa dopo o non rimossa ) 

set search_path to simfito,eppo,public;
WITH
host as (select b_code,full_name from t_baycode INNER JOIN t_bayname ON t_baycode.codeid=t_bayname.codeid where preferred=1 and isolang='la'),
xx as (select azienda_id,array_to_string(array_sort(array_agg(descrizione)),',') as xx_tipoazienda from azienda_tipoazienda inner join tipoazienda on azienda_tipoazienda.tipoazienda_id=tipoazienda.id group by azienda_id)
SELECT
tecnici.nome || ' ' || tecnici.cognome as tecnici_nomecognome,
scheda.idscheda as scheda_idscheda,
osservazioni.idosservazioni as osservazioni_idosservazioni,
scheda.data_sopralluogo as scheda_data_sopralluogo,
tipo_visita.motivo as tipo_visita_motivo,
st_x(st_transform(st_centroid(siti.the_geom),4326)) as siti_the_geom_x,
st_y(st_transform(st_centroid(siti.the_geom),4326)) as siti_the_geom_y,
siti.superficie_ha as siti_superficie_ha,
osservazioni.n_osservate as osservazioni_n_osservate,
1 as siti_numerositi,
osservazioni.hostcode as osservazioni_hostcode,
host.full_name as host_full_name,
1 as samples_numerosamples,
osservazioni.campionecode as osservazioni_campionecode,
osservazioni.campione as osservazioni_campione,

osservazioni.rilevato as osservazioni_rilevato,
osservazioni.sospetti as osservazioni_sospetti,

osservazioni.fase_fenologica as osservazioni_fase_fenologica,
osservazioni.organi as osservazioni_organi,
osservazioni.pericolosita as osservazioni_pericolosita,
osservazioni.varieta as osservazioni_varieta,
osservazioni.eta as osservazioni_eta,
osservazioni.data_impianto as osservazioni_data_impianto,
osservazioni.appezzamento as osservazioni_appezzamento,
osservazioni.dens_piante as osservazioni_dens_piante,
osservazioni.piante_camp_vis as osservazioni_piante_camp_vis,
osservazioni.coltura_prec as osservazioni_coltura_prec,
osservazioni.piante_infest as osservazioni_piante_infest,
osservazioni.sup_vis as osservazioni_sup_vis,
osservazioni.sup_infest as osservazioni_sup_infest,
osservazioni.n_abbattute as osservazioni_n_abbattute,
scheda.note as scheda_note,
siti.denominaz as siti_denominaz,
siti.localita as siti_localita,
siti.indirizzo as siti_indirizzo,
siti.superficie_ha as siti_superficie_ha,
siti.quota as siti_quota,
comuni.provincia as comuni_provincia,
comuni.nome as comuni_nome,
azienda.partita_iva as azienda_partita_iva,
azienda.rag_soc as azienda_rag_soc,
xx.xx_tipoazienda as xx_xx_tipoazienda,

tipo_tecnico.tipotecnico as tipo_tecnico_tipotecnico,
grado_attacco.nome_grado as grado_attacco_nome_grado,
intensity.nome_intensity as intensity_nome_intensity,
campioni.codice as campioni_codice,
campioni.motivo as campioni_motivo,
campioni.elementicampione as campioni_elementicampione,
laboratorio.denominazione as laboratorio_denominazione,
laboratoriostato.descrizione as laboratoriostato_descrizione,
obs_rilevato.descrizione as obs_rilevato_descrizione

FROM osservazioni
LEFT JOIN scheda ON osservazioni.idscheda=scheda.idscheda
LEFT JOIN siti ON scheda.gid_sito=siti.gid
LEFT JOIN trappole on trappole.id_osservazione=osservazioni.
LEFT JOIN comuni ON siti.comune_istat=comuni.istat
LEFT JOIN azienda ON azienda.partita_iva=siti.piva_azienda
LEFT JOIN xx on azienda.id_azienda=xx.azienda_id
LEFT JOIN obs_rilevato ON osservazioni.rilevato=obs_rilevato.id
LEFT JOIN grado_attacco ON osservazioni.attacco_grado=grado_attacco.id_grado
LEFT JOIN intensity ON osservazioni.attacco_int=intensity.id_intensity
LEFT JOIN campioni ON osservazioni.campioni_id=campioni.id
LEFT JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
LEFT JOIN tecnici ON scheda.id_tecnico=tecnici.id_tecnico
LEFT JOIN tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
LEFT JOIN laboratorio ON campioni.laboratorio_id=laboratorio.id
LEFT JOIN laboratoriostato ON campioni.laboratoriostato_id=laboratoriostato.id
LEFT JOIN host on osservazioni.hostcode=host.b_code
WHERE pestcode='RHAGCO'
ORDER BY scheda_data_sopralluogo

*/

//
// per ognuna delle esportazioni
// 0) filename -> nome del file di output
// 1) worksheet -> nome dello sheet
// 2) sql -> query sql per estrazione dei dati
// 3) header -> lista dei titoli delle colonne
// 4) parms -> lista dei parametri in input ??
// 5) columns -> lista delle colonne in output ( titolo_della_colonna,nome_del_campo_sql,opzioni )
// 1 e 2 possono essere dei vettori per esportazioni multi sheet
// 3 e' un vettore ( di colonne ) o un vettore di vettori nel caso multisheet
//

$sqls = [
	'test' => [
		'filename'=>'test.xlsx',
		'worksheet'=> 'test',
		'sql' => 'SELECT 1 as a,2 as b',
		'header'=> ['A','B']
	],
	'osservazioni' => [
		'parms' => ['idscheda'],
		'filename'=>'osservazioni.xlsx',
		'worksheet'=> 'osservazioni',
		'sql' => 'SELECT obs_rilevato.descrizione as presente,* FROM osservazioni
LEFT JOIN obs_rilevato ON osservazioni.rilevato=obs_rilevato.id
LEFT JOIN grado_attacco ON osservazioni.attacco_grado=grado_attacco.id_grado
LEFT JOIN intensity ON osservazioni.attacco_int=intensity.id_intensity
LEFT JOIN campioni ON osservazioni.campioni_id=campioni.id
WHERE idscheda=%idscheda%
ORDER BY idosservazioni',
	],
	'osservazioni_scheda' => [
		'parms' => ['idscheda'],
		'filename'=>'osservazioni.xls',
		'worksheet'=> 'osservazioni',
		'sql' => 'SELECT obs_rilevato.descrizione as presente,* FROM osservazioni
LEFT JOIN obs_rilevato ON osservazioni.rilevato=obs_rilevato.id
LEFT JOIN grado_attacco ON osservazioni.attacco_grado=grado_attacco.id_grado
LEFT JOIN intensity ON osservazioni.attacco_int=intensity.id_intensity
LEFT JOIN campioni ON osservazioni.campioni_id=campioni.id
WHERE idscheda=%idscheda%
ORDER BY idosservazioni',
	],

	'tabbellone' =>[
		'parms' => ['idscheda'],
		'filename'=>'osservazioni.xlsx',
		'worksheet'=> 'osservazioni',
		'columns' => [
                ['scheda.idscheda','scheda_idscheda',''],
				['scheda.protocollo','scheda_protocollo',''],
                //20201002['tipologia.luogo_ispezione','tipo_visita_motivo',''],
				['scheda.modifica_tipologia_sito','tipo_visita_motivo_new',''],
                ['scheda.data_sopralluogo','scheda_data_sopralluogo',''],
                ['scheda.note','scheda_note',''],
                ['tecnico.nome','tecnici_nome',''],
                ['tecnico.cognome','tecnici_cognome',''],
                //['tecnico.email','tecnici_email',''],
                ['tecnico.ufficio','tecnici_ufficio',''],
                //['tecnico.codicefiscale','tecnici_codicefiscale',''],
                //['tecnico.titolo','tecnici_titolo',''],
                //['tecnico.telefono','tecnici_telefono',''],
                //['tecnico.mobile','tecnici_mobile',''],
                //['tecnico.cancellato','tecnici_cancellato',''],
                //['tecnico.tipotecnico','tipo_tecnico_tipotecnico',''],
				['tecnici.addizionali','tecnici_addizionali',''],
                ['azienda.partita_iva','azienda_partita_iva',''],
                ['azienda.rag_soc','azienda_rag_soc',''],
                //['azienda.tipoazienda','xx_xx_tipoazienda',''],
                ['sito.denominaz','siti_denominaz',''],
                ['sito.localita','siti_localita',''],
                ['sito.indirizzo','siti_indirizzo',''],
                ['sito.superficie [m2]','siti_superficie_ha','s2'],
                ['sito.quota [m]','siti_quota','s2'],
                ['sito.provincia','comuni_provincia',''],
                ['sito.comune','comuni_nome',''],
                ['sito.coord_x_32633','siti_the_geom_x','s2'],
                ['sito.coord_y_32633','siti_the_geom_y','s2'],
                ['sito.coord_x_4326','siti_the_geom_x_geog','s2'],
                ['sito.coord_y_4326','siti_the_geom_y_geog','s2'],
                ['osservazione.idosservazioni','osservazioni_idosservazioni',''],
                ['osservazione.hostcode','osservazioni_hostcode',''],
                ['osservazione.host_full_name','host_full_name',''],
                ['osservazione.pestcode','osservazioni_pestcode',''],
                ['osservazione.pest_full_name','pest_full_name',''],
                ['osservazioni.parassitapresente','osservazioni_parassitapresente',''],
                ['osservazione.sintomi_sospetti_pericolosita_note','osservazioni_sospetti',''],
                ['serie.campione','serie_campione',''],
                ['osservazione.fase_fenologica','osservazioni_fase_fenologica',''],
                //20201002 ['osservazione.num_piante_totali','osservazioni_n_osservate','s2'],
                //['osservazione.organi','osservazioni_organi',''],
                //['osservazione.pericolosita','osservazioni_pericolosita',''],
                //['osservazione.varieta','osservazioni_varieta',''],
                //['osservazione.eta','osservazioni_eta',''],
                //['osservazione.data_impianto','osservazioni_data_impianto',''],

				//20201002
                ['osservazione.tipologia_controllata','tipologiacontrollata_descrizione',''],
                ['osservazioni.unita_totali','osservazioni_unita',''],
                ['osservazioni.unita_contollate','osservazioni_unitachk',''],
                ['osservazioni.peso_totale','osservazioni_peso',''],
                ['osservazioni.peso_controllato','osservazioni_pesochk',''],
                ['osservazioni.lotti_totali','osservazioni_lotti',''],
                ['osservazioni.lotti_controllati','osservazioni_lottichk',''],
                ['osservazioni.lotti_campionati','osservazioni_lotticamp',''],
                ['osservazioni.paese_origine','osservazioni_provenienza',''],
				//20201002

                //20201002 ['osservazione.superficie_appezzamento [m2]','osservazioni_appezzamento','s2'],
                ['osservazione.sup_tot_sito [m2]','osservazioni_appezzamento','s2'],
                //['osservazione.dens_piante','osservazioni_dens_piante',''],
                //20201002 ['osservazione.num_piante_controllate_visivamente','osservazioni_piante_camp_vis','s2'],
                //['osservazione.coltura_prec','osservazioni_coltura_prec',''],
                ['osservazione.num_piante_infestate','osservazioni_piante_infest','s2'],
                //20201002 ['osservazione.superficie_controllata_visivamente [m2]','osservazioni_sup_vis','s2'],
                ['osservazione.superficie_controllata [m2]','osservazioni_sup_vis','s2'],
                ['osservazione.superficie_infestata [m2]','osservazioni_sup_infest','s2'],
                ['osservazione.num_piante_abbattute','num_piante_abbattute','s2'],
				['osservazione.tempo','osservazioni_tempo',''],
				['osservazione.conta_tempo','!osservazioni_tempo',''],
                //['attacco','grado_attacco_nome_grado',''],
                //['intensita_attacco','intensity_nome_intensity',''],
				['trappole.codice','trappole_codice',''], 
				['trappole.numero_individui','trappole_numero_individui',''],
                //['campioni.codice','campioni_codice',''],
                ['campioni.motivo.rigetto','campioni_motivo',''],
                ['campioni.elementi_della_serie','campioni_elementicampione',''],
				['campioni.conta_elementi','!campioni_elementicampione',''],
                ['laboratorio.denominazione','laboratorio_denominazione',''],
                ['laboratorio.stato','laboratoriostato_descrizione',''],
				['report.link','report_link',''],
//				['analisys_agent_id','analisys_agent_id','']
		],
		'sql' => "
WITH
host as (select b_code,full_name from t_baycode INNER JOIN t_bayname ON t_baycode.codeid=t_bayname.codeid where preferred=1 and isolang='la'),
pest as (select b_code,full_name from t_baycode INNER JOIN t_bayname ON t_baycode.codeid=t_bayname.codeid where preferred=1 and isolang='la'),
xx as (select azienda_id,array_to_string(array_sort(array_agg(descrizione)),',') as xx_tipoazienda from azienda_tipoazienda inner join tipoazienda on azienda_tipoazienda.tipoazienda_id=tipoazienda.id group by azienda_id),
tt as (select idscheda,string_agg(cognome || ' ' || nome ,',') as tt from schede_tecnici inner join tecnici on schede_tecnici.id_tecnico=tecnici.id_tecnico group by idscheda),
aa as (select osservazioni_id,sum(quantity) as sum_quantity from abbattimenti group by osservazioni_id)
SELECT
osservazioni.idosservazioni as osservazioni_idosservazioni,
osservazioni.hostcode as osservazioni_hostcode,
osservazioni.pestcode as osservazioni_pestcode,
osservazioni.rilevato as osservazioni_rilevato,
osservazioni.sospetti as osservazioni_sospetti,
osservazioni.campione as osservazioni_campione,
osservazioni.fase_fenologica as osservazioni_fase_fenologica,
osservazioni.n_osservate as osservazioni_n_osservate,
osservazioni.organi as osservazioni_organi,
osservazioni.pericolosita as osservazioni_pericolosita,
osservazioni.varieta as osservazioni_varieta,
osservazioni.eta as osservazioni_eta,
osservazioni.data_impianto as osservazioni_data_impianto,
osservazioni.appezzamento as osservazioni_appezzamento,
osservazioni.dens_piante as osservazioni_dens_piante,
osservazioni.piante_camp_vis as osservazioni_piante_camp_vis,
osservazioni.coltura_prec as osservazioni_coltura_prec,
osservazioni.piante_infest as osservazioni_piante_infest,
osservazioni.sup_vis as osservazioni_sup_vis,
osservazioni.sup_infest as osservazioni_sup_infest,
osservazioni.n_abbattute as osservazioni_n_abbattute,
osservazioni.tempo as osservazioni_tempo,
--	
	osservazioni.unita as osservazioni_unita,osservazioni.unita_chk as osservazioni_unitachk,osservazioni.peso as osservazioni_peso,osservazioni.peso_chk as osservazioni_pesochk,
	osservazioni.lotti as osservazioni_lotti,osservazioni.lotti_chk as osservazioni_lottichk,osservazioni.lotti_camp as osservazioni_lotticamp,
	osservazioni.provenienza as osservazioni_provenienza,
	tipologiacontrollata.descrizione as tipologiacontrollata_descrizione,
--	 

scheda.idscheda as scheda_idscheda,
scheda.data_sopralluogo as scheda_data_sopralluogo,
scheda.protocollo as scheda_protocollo,
scheda.note as scheda_note,
st_x(st_transform(st_centroid(siti.the_geom),32633)) as siti_the_geom_x,
st_y(st_transform(st_centroid(siti.the_geom),32633)) as siti_the_geom_y,
st_x(st_centroid(siti.the_geom)) as siti_the_geom_x_geog,
st_y(st_centroid(siti.the_geom)) as siti_the_geom_y_geog,
siti.denominaz as siti_denominaz,
siti.localita as siti_localita,
siti.indirizzo as siti_indirizzo,
siti.superficie_ha as siti_superficie_ha,
siti.quota as siti_quota,
comuni.provincia as comuni_provincia,
comuni.nome as comuni_nome,
azienda.partita_iva as azienda_partita_iva,
azienda.rag_soc as azienda_rag_soc,
xx.xx_tipoazienda as xx_xx_tipoazienda,
tipo_visita.motivo as tipo_visita_motivo,
coalesce(tipo_visita.theme,'') || '-' || tipo_visita.motivo as tipo_visita_motivo_new, 
tecnici.nome as tecnici_nome,
tecnici.cognome as tecnici_cognome,
tecnici.email as tecnici_email,
tecnici.ufficio as tecnici_ufficio,
tecnici.codicefiscale as tecnici_codicefiscale,
tecnici.titolo as tecnici_titolo,
tecnici.telefono as tecnici_telefono,
tecnici.mobile as tecnici_mobile,
tecnici.cancellato as tecnici_cancellato,
tipo_tecnico.tipotecnico as tipo_tecnico_tipotecnico,
tt.tt as tecnici_addizionali,
grado_attacco.nome_grado as grado_attacco_nome_grado,
intensity.nome_intensity as intensity_nome_intensity,
campioni.codice as campioni_codice,
campioni.motivo as campioni_motivo,
campioni.elementicampione as campioni_elementicampione,
laboratorio.denominazione as laboratorio_denominazione,
laboratoriostato.descrizione as laboratoriostato_descrizione,
-- 20221125 trappole.numero_individui as trappole_numero_individui, 
osservazioni.catture as trappole_numero_individui,
trappole_geometry.codice as trappole_codice, 
host.full_name as host_full_name,
pest.full_name as pest_full_name,
case 
  when (( osservazioni.campioni_id=-1 or osservazioni.campioni_id is null ) and (osservazioni.rilevato=1) ) then 'Positivo' 
  when (( osservazioni.campioni_id=-1 or osservazioni.campioni_id is null ) and (osservazioni.rilevato<>1) ) then 'Negativo'
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=2) and (analisysresult.positive=1) ) then 'Positivo' 
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=2) and (analisysresult.positive=0) ) then 'Negativo' 
  when (( osservazioni.campioni_id<>-1 ) and (analisys.analisysstate_id=3) ) then 'Non applicabile' 
  else 'Analisi in corso' end
as osservazioni_parassitapresente,
analisysresult.positive as analisysresult_positive,
analisys.agent_id as analisys_agent_id,
case 
  when osservazioni.campioni_id=-1 or osservazioni.campioni_id is null then ''
  when campioni.codice is null then osservazioni.campionecode
  else campioni.codice end
as serie_campione,
case 
  when aa.osservazioni_id is null then osservazioni.n_abbattute
  else aa.sum_quantity end
as num_piante_abbattute,
case 
  when report.id is null then ''
  else 'http://$hostapp/simfitolab/services/report.php?mode=pdf&table=report&idv=' || report.id::text end
as report_link

FROM osservazioni
-- 20221125 LEFT JOIN trappole on osservazioni.idosservazioni=trappole.id_osservazione
-- 20221125 LEFT JOIN trappole_geometry on trappole.trappole_geometry_id=trappole_geometry.id 
LEFT JOIN trappole_geometry on trappole_geometry.id=osservazioni.trappole_geometry_id 
LEFT JOIN scheda ON osservazioni.idscheda=scheda.idscheda
LEFT JOIN siti ON scheda.gid_sito=siti.gid
LEFT JOIN comuni ON siti.comune_istat=comuni.istat
LEFT JOIN azienda ON azienda.partita_iva=siti.piva_azienda
LEFT JOIN xx on azienda.id_azienda=xx.azienda_id
LEFT JOIN grado_attacco ON osservazioni.attacco_grado=grado_attacco.id_grado
LEFT JOIN intensity ON osservazioni.attacco_int=intensity.id_intensity
LEFT JOIN campioni ON osservazioni.campioni_id=campioni.id
LEFT JOIN report on osservazioni.campioni_id=report.campioni_id
LEFT JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
LEFT JOIN tecnici ON scheda.id_tecnico=tecnici.id_tecnico
LEFT JOIN tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
LEFT JOIN laboratorio ON campioni.laboratorio_id=laboratorio.id
LEFT JOIN laboratoriostato ON campioni.laboratoriostato_id=laboratoriostato.id
LEFT JOIN host on osservazioni.hostcode=host.b_code
LEFT JOIN pest on osservazioni.pestcode=pest.b_code
LEFT JOIN analisys on osservazioni.idosservazioni=analisys.osservazioni_id
LEFT JOIN analisysresult on analisys.analisysresult_id=analisysresult.id
LEFT JOIN aa on osservazioni.idosservazioni=aa.osservazioni_id
LEFT JOIN tt on osservazioni.idscheda=tt.idscheda
--
LEFT JOIN tipologiacontrollata ON tipologiacontrollata.id=osservazioni.tipologiacontrollata_id
--
WHERE %where%
ORDER BY idosservazioni,serie_campione,analisys_agent_id",
	'sqlcount' => "
WITH
xx as (select azienda_id,array_to_string(array_sort(array_agg(descrizione)),',') as xx_tipoazienda from azienda_tipoazienda inner join tipoazienda on azienda_tipoazienda.tipoazienda_id=tipoazienda.id group by azienda_id)
SELECT count(*) as cc
FROM osservazioni
LEFT JOIN scheda ON osservazioni.idscheda=scheda.idscheda
LEFT JOIN siti ON scheda.gid_sito=siti.gid
LEFT JOIN comuni ON siti.comune_istat=comuni.istat
LEFT JOIN azienda ON azienda.partita_iva=siti.piva_azienda
LEFT JOIN xx on azienda.id_azienda=xx.azienda_id
LEFT JOIN grado_attacco ON osservazioni.attacco_grado=grado_attacco.id_grado
LEFT JOIN intensity ON osservazioni.attacco_int=intensity.id_intensity
LEFT JOIN campioni ON osservazioni.campioni_id=campioni.id
LEFT JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
LEFT JOIN tecnici ON scheda.id_tecnico=tecnici.id_tecnico
LEFT JOIN tipo_tecnico ON tecnici.idtipo_tecnico=tipo_tecnico.idtipo_tecnico
LEFT JOIN laboratorio ON campioni.laboratorio_id=laboratorio.id
LEFT JOIN laboratoriostato ON campioni.laboratoriostato_id=laboratoriostato.id
LEFT JOIN analisys on osservazioni.idosservazioni=analisys.osservazioni_id
LEFT JOIN analisysresult on analisys.analisysresult_id=analisysresult.id
WHERE %where%"
	],
	'trappole'=> [
		'parms' => [],
		'filename'=>'trappole.xlsx',
		'worksheet'=> 'trappole',
		'columns' => [
				// TITOLO_COLONNA NOME_CAMPO
                ['id_trappola','id'],
                ['codice_trappola','codice'],
                ['datacreazione','datacreazione'],
                ['datavariazione','datavariazione'],
                ['tecnico','tecnico'],
                ['tecnico_rimozione','tecnico_rimozione'],
                ['stato_trappola','statotrappole_descrizione'],
                ['tipo_trappola','tipo_trappole_descrizione'],
                ['nome_organismo','organismo_full_name'],
				['tempo_piazzamento','tempo'],
				['tempo_rimozione','tempo_rimozione'],
				['durata_erogatore','durata_erogatore'],
				['conteggio_catture','conteggio_catture'],
				['coord x trappola WGS84','cx4326'],
				['coord y trappola WGS84','cy4326'],
				['coord x trappola','cx32633'],
				['coord y trappola','cy32633']
		],
		'sql'=> "WITH cc as (SELECT trappole_geometry_id,sum(numero_individui) as conteggio_catture from simfito.trappole GROUP BY trappole_geometry_id)
			SELECT simfito.trappole_geometry.*,
			t1.cognome || ' ' || t1.nome as tecnico,
			t2.cognome || ' ' || t2.nome as tecnico_rimozione,
			statotrappole.descrizione as statotrappole_descrizione,
			tipo_trappole.descrizione as tipo_trappole_descrizione,
			t_vista.full_name as organismo_full_name,
			coalesce(cc.conteggio_catture,0) as conteggio_catture,
			st_x(the_geom) as cx4326,
			st_y(the_geom) as cy4326,
			st_x(st_transform(the_geom,32633)) as cx32633,
			st_y(st_transform(the_geom,32633)) as cy32633
			FROM simfito.trappole_geometry
			INNER JOIN simfito.statotrappole on simfito.statotrappole.id=simfito.trappole_geometry.statotrappole_id
			INNER JOIN simfito.tipo_trappole on simfito.tipo_trappole.id=simfito.trappole_geometry.tipo_trappole_id
			LEFT JOIN simfito.tecnici t1 on t1.id_tecnico=simfito.trappole_geometry.tecnico_id
			LEFT JOIN simfito.tecnici t2 on t2.id_tecnico=simfito.trappole_geometry.tecnicorimozione_id
			LEFT JOIN t_vista on t_vista.b_code=simfito.trappole_geometry.organismo
			LEFT JOIN cc on cc.trappole_geometry_id=simfito.trappole_geometry.id
			WHERE %where%"	
	],	
	'trappole1'=> [
		'parms' => [],
		'filename'=>'trappole.xlsx',
		'worksheet'=> 'trappole',
		'columns' => [
			['data di posizionamento','datacreazione'],
			['tipo trappola','tipo_trappole_descrizione'],
			['id scheda','idscheda'],
			['numero di individui catturati','catture'],
			['tecnico principale','tecnici_nomecognome'],
			['codice campioni','campioni_codice'], 
			['stato analisi','analisysstate_description'],
			['risultato analisi','analisysresult_description'],
			['link referto','report_link']
		],
		'sql'=> "select 
	datacreazione,tipo_trappole.descrizione as tipo_trappole_descrizione,osservazioni.idscheda,catture,
	data_sopralluogo,concat(tecnici.nome,' ',tecnici.cognome) as tecnici_nomecognome,
	campioni.codice as campioni_codice, 
	analisysstate.description as analisysstate_description,analisysresult.description as analisysresult_description,
	case 
		when report.id is null then ''
		else 'http://$hostapp/simfitolab/services/report.php?mode=pdf&table=report&idv=' || report.id::text end
	as report_link
from simfito.trappole_geometry
inner join simfito.tipo_trappole on tipo_trappole.id=trappole_geometry.tipo_trappole_id
left join simfito.osservazioni on osservazioni.trappole_geometry_id=trappole_geometry.id
left join simfito.scheda on scheda.idscheda=osservazioni.idscheda
left join simfito.siti on siti.gid=scheda.gid_sito
left join comuni on comuni.istat=siti.comune_istat
left join simfito.tecnici on tecnici.id_tecnico=scheda.id_tecnico
left join simfito.campioni on campioni.id=osservazioni.campioni_id
left join simfitolab.analisys on analisys.campioni_id=campioni.id
left join simfitolab.analisysstate on analisysstate.id=analisys.analisysstate_id
left join simfitolab.analisysresult on analisysresult.id=analisys.analisysresult_id
left join simfitolab.report on osservazioni.campioni_id=report.campioni_id
where %where%"
	],
	'trappole2'=> [
		'parms' => [],
		'filename'=>'trappole.xlsx',
		'worksheet'=> 'trappole',
		'columns' => [
			['id scheda','idscheda'],
			//['id_tecnico','id_tecnico'],
			['data sopralluogo','data_sopralluogo'],
			['protocollo','protocollo'],
			['tecnico principale','maintecnico'],
			['altri tecnici','subtecnici'],
			['azienda','azienda_ragsoc'],
			['sito','siti_denominaz'],
			['comune','comuni_nome'],
			['sito lat (n)','siti_coord_y'],
			['sito long (e)','siti_coord_x'],
			["attivita'",'activity'],
			//['id','id'],
			['codice trappola','codice'],
			['trappola lat (n)','coord_y'],
			['trappola long (e)','coord_x'],
			['nome interno trappola','nome'],
			['organismo di riferimento','organismo'],
			//['tipo_trappole_id','tipo_trappole_id'],
			['tipo trappola','descrizione'],
			['catture','catture'],
			['cambioferomone','cambioferomone'],
			//['campioni_id','campioni_id'],
			['codice campione','campioni_codice'],
			['tipo campione','tipocampione_description'],
			['elementi del campione','elementicampione'],
			['laboratorio','laboratorio_denominazione'],
			['stato analisi','laboratoriostato_descrizione'],
			['risultato analisi','analisysresult_name'],
			['link referto','report_link'],
			['tempo','tempoact']
		],
		'sql'=> "with
x as (
	select scheda.idscheda,scheda.id_tecnico,data_sopralluogo,protocollo,'posizionamento' as activity,trappole_geometry.id,trappole_geometry.codice,trappole_geometry.nome,trappole_geometry.organismo,tipo_trappole_id,null::integer as catture,null::text as cambioferomone,null::integer as campioni_id,
	siti.denominaz as siti_denominaz,siti.piva_azienda,
	st_x(st_centroid(siti.the_geom)) as siti_coord_x,st_y(st_centroid(siti.the_geom)) as siti_coord_y, 
	trappole_geometry.tempo as tempoact,
	st_x(trappole_geometry.the_geom) as coord_x,st_y(trappole_geometry.the_geom) as coord_y,
	comuni.nome as comuni_nome
	from simfito.trappole_geometry 
	left join simfito.scheda on scheda.idscheda=trappole_geometry.scheda_id
	left join simfito.siti on siti.gid=scheda.gid_sito
	left join comuni on comuni.istat=siti.comune_istat 
	where %where%
	union 
	select scheda.idscheda,scheda.id_tecnico,data_sopralluogo,protocollo,'rimozione' as activity,trappole_geometry.id,trappole_geometry.codice,trappole_geometry.nome,trappole_geometry.organismo,tipo_trappole_id,null::integer as catture,null::text as cambioferomone,null::integer as campioni_id,
	siti.denominaz as siti_denominaz,siti.piva_azienda,
	st_x(st_centroid(siti.the_geom)) as siti_coord_x,st_y(st_centroid(siti.the_geom)) as siti_coord_y, 
	trappole_geometry.tempo_rimozione as tempoact,
	st_x(trappole_geometry.the_geom) as coord_x,st_y(trappole_geometry.the_geom) as coord_y,
	comuni.nome as comuni_nome
	from simfito.trappole_geometry 
	inner join simfito.scheda on scheda.idscheda=trappole_geometry.rimozionescheda_id
	inner join simfito.siti on siti.gid=scheda.gid_sito
	left join comuni on comuni.istat=siti.comune_istat 
	where %where%
	union
	select scheda.idscheda,scheda.id_tecnico,data_sopralluogo,protocollo,'cattura/cambio feromone' as activity,trappole_geometry.id,trappole_geometry.codice,trappole_geometry.nome,trappole_geometry.organismo,tipo_trappole_id,catture,case cambioferomone when true then 'Si' else 'No' end as cambioferomone,campioni_id,
	siti.denominaz as siti_denominaz,siti.piva_azienda,
	st_x(st_centroid(siti.the_geom)) as siti_coord_x,st_y(st_centroid(siti.the_geom)) as siti_coord_y,
	osservazioni.tempo as tempoact,
	st_x(trappole_geometry.the_geom) as coord_x,st_y(trappole_geometry.the_geom) as coord_y,
	comuni.nome as comuni_nome
	from simfito.trappole_geometry
	inner join simfito.osservazioni on osservazioni.trappole_geometry_id=trappole_geometry.id and not visiva
	inner join simfito.scheda on scheda.idscheda=osservazioni.idscheda
	inner join simfito.siti on siti.gid=scheda.gid_sito
	left join comuni on comuni.istat=siti.comune_istat 
	where %where%
	),
y as (
	select idscheda,string_agg(tecnici.cognome || ' ' || tecnici.nome,',') as subtecnici
	from simfito.schede_tecnici inner join simfito.tecnici on schede_tecnici.id_tecnico=tecnici.id_tecnico
	group by idscheda
)
select 
	x.*,tecnici.cognome || ' ' || tecnici.nome as maintecnico,subtecnici,tipo_trappole.descrizione,campioni.codice as campioni_codice,
	laboratoriostato.descrizione as laboratoriostato_descrizione,laboratorio.denominazione as laboratorio_denominazione,
	elementicampione,tipocampione.description as tipocampione_description,
	analisysresult.name as analisysresult_name,
	azienda.rag_soc as azienda_ragsoc,
	case when report.id is null then '' else 'http://simfito.regione.campania.it/simfitolab/services/report.php?mode=pdf&table=report&idv=' || report.id::text end as report_link 
from x
inner join simfito.tipo_trappole on tipo_trappole.id=tipo_trappole_id
left join simfito.tecnici on tecnici.id_tecnico=x.id_tecnico
left join simfito.azienda on azienda.partita_iva=x.piva_azienda
left join y on y.idscheda=x.idscheda
left join simfito.campioni on campioni.id=x.campioni_id
left join simfito.laboratoriostato on laboratoriostato.id=campioni.laboratoriostato_id
left join simfito.laboratorio on laboratorio.id=campioni.laboratorio_id
left join simfito.tipocampione on tipocampione.id=campioni.tipocampione_id 
left join simfitolab.analisys on analisys.campioni_id=campioni.id 
left join simfitolab.analisysresult on analisysresult.id=analisys.analisysresult_id
left join simfitolab.report on x.campioni_id=report.campioni_id  
order by x.codice,data_sopralluogo,campioni_codice nulls first"
	],

	'trappole2_pre20231009'=> [
		'parms' => [],
		'filename'=>'trappole.xlsx',
		'worksheet'=> 'trappole',
		'columns' => [
			['id scheda','idscheda'],
			//['id_tecnico','id_tecnico'],
			['data sopralluogo','data_sopralluogo'],
			['protocollo','protocollo'],
			['tecnico principale','maintecnico'],
			['altri tecnici','subtecnici'],
			['azienda','azienda_ragsoc'],
			['sito','siti_denominaz'],
			['comune','comuni_nome'],
			["attivita'",'activity'],
			//['id','id'],
			['codice trappola','codice'],
			['lat (n)','coord_y'],
			['long (e)','coord_x'],
			['nome interno trappola','nome'],
			['organismo di riferimento','organismo'],
			//['tipo_trappole_id','tipo_trappole_id'],
			['tipo trappola','descrizione'],
			['catture','catture'],
			['cambioferomone','cambioferomone'],
			//['campioni_id','campioni_id'],
			['codice campione','campioni_codice'],
			['tipo campione','tipocampione_description'],
			['elementi del campione','elementicampione'],
			['laboratorio','laboratorio_denominazione'],
			['stato analisi','laboratoriostato_descrizione'],
			['risultato analisi','analisysresult_name'],
			['link referto','report_link'],
			['tempo','tempoact']
		],
		'sql'=> "with
x as (
	select scheda.idscheda,scheda.id_tecnico,data_sopralluogo,protocollo,'posizionamento' as activity,trappole_geometry.id,trappole_geometry.codice,trappole_geometry.nome,trappole_geometry.organismo,tipo_trappole_id,null::integer as catture,null::text as cambioferomone,null::integer as campioni_id,
	siti.denominaz as siti_denominaz,siti.piva_azienda,trappole_geometry.tempo as tempoact,
	st_x(trappole_geometry.the_geom) as coord_x,st_y(trappole_geometry.the_geom) as coord_y,
	comuni.nome as comuni_nome
	from simfito.trappole_geometry 
	left join simfito.scheda on scheda.idscheda=trappole_geometry.scheda_id
	left join simfito.siti on siti.gid=scheda.gid_sito
	left join comuni on comuni.istat=siti.comune_istat 
	where %where%
	union 
	select scheda.idscheda,scheda.id_tecnico,data_sopralluogo,protocollo,'rimozione' as activity,trappole_geometry.id,trappole_geometry.codice,trappole_geometry.nome,trappole_geometry.organismo,tipo_trappole_id,null::integer as catture,null::text as cambioferomone,null::integer as campioni_id,
	siti.denominaz as siti_denominaz,siti.piva_azienda,trappole_geometry.tempo_rimozione as tempoact,
	st_x(trappole_geometry.the_geom) as coord_x,st_y(trappole_geometry.the_geom) as coord_y,
	comuni.nome as comuni_nome
	from simfito.trappole_geometry 
	inner join simfito.scheda on scheda.idscheda=trappole_geometry.rimozionescheda_id
	inner join simfito.siti on siti.gid=scheda.gid_sito
	left join comuni on comuni.istat=siti.comune_istat 
	where %where%
	union
	select scheda.idscheda,scheda.id_tecnico,data_sopralluogo,protocollo,'cattura/cambio feromone' as activity,trappole_geometry.id,trappole_geometry.codice,trappole_geometry.nome,trappole_geometry.organismo,tipo_trappole_id,catture,case cambioferomone when true then 'Si' else 'No' end as cambioferomone,campioni_id,
	siti.denominaz as siti_denominaz,siti.piva_azienda,osservazioni.tempo as tempoact,
	st_x(trappole_geometry.the_geom) as coord_x,st_y(trappole_geometry.the_geom) as coord_y,
	comuni.nome as comuni_nome
	from simfito.trappole_geometry
	inner join simfito.osservazioni on osservazioni.trappole_geometry_id=trappole_geometry.id and not visiva
	inner join simfito.scheda on scheda.idscheda=osservazioni.idscheda
	inner join simfito.siti on siti.gid=scheda.gid_sito
	left join comuni on comuni.istat=siti.comune_istat 
	where %where%
	),
y as (
	select idscheda,string_agg(tecnici.cognome || ' ' || tecnici.nome,',') as subtecnici
	from simfito.schede_tecnici inner join simfito.tecnici on schede_tecnici.id_tecnico=tecnici.id_tecnico
	group by idscheda
)
select 
	x.*,tecnici.cognome || ' ' || tecnici.nome as maintecnico,subtecnici,tipo_trappole.descrizione,campioni.codice as campioni_codice,
	laboratoriostato.descrizione as laboratoriostato_descrizione,laboratorio.denominazione as laboratorio_denominazione,
	elementicampione,tipocampione.description as tipocampione_description,
	analisysresult.name as analisysresult_name,
	azienda.rag_soc as azienda_ragsoc,
	case when report.id is null then '' else 'http://simfito.regione.campania.it/simfitolab/services/report.php?mode=pdf&table=report&idv=' || report.id::text end as report_link 
from x
inner join simfito.tipo_trappole on tipo_trappole.id=tipo_trappole_id
left join simfito.tecnici on tecnici.id_tecnico=x.id_tecnico
left join simfito.azienda on azienda.partita_iva=x.piva_azienda
left join y on y.idscheda=x.idscheda
left join simfito.campioni on campioni.id=x.campioni_id
left join simfito.laboratoriostato on laboratoriostato.id=campioni.laboratoriostato_id
left join simfito.laboratorio on laboratorio.id=campioni.laboratorio_id
left join simfito.tipocampione on tipocampione.id=campioni.tipocampione_id 
left join simfitolab.analisys on analisys.campioni_id=campioni.id 
left join simfitolab.analisysresult on analisysresult.id=analisys.analisysresult_id
left join simfitolab.report on x.campioni_id=report.campioni_id  
order by x.codice,data_sopralluogo,campioni_codice nulls first"
	],

	'trappole3'=> [
		'parms' => [],
		'filename'=>'trappole.xlsx',
		'worksheet'=> 'trappole',
		'columns' => [
			['id trappola','id'],
			['codice trappola','codice'],
			['nome trappola','nome'],
			['tipo trappola','tipotrappola'],
			['nome pest','mainpest'],
			['codice paest','organismo'],
			['durata erogatore','durata_erogatore'],
			['data posizionamento','data_posizionamento'],
			['data rimozione','data_rimozione'],
			['tecnico posizionamento','tecnico'],
			['tecnico rimozione','tecnico_rimozione'],
//			['datavariazione','datavariazione'],
			['longitudine','coord_x'],
			['latitudine','coord_y'],
//			['geometry','geometry'],
//			['stato','stato'],
			['denominazione sito','denominaz'],
//			['stato_id','stato_id'],
			['azienda sito','aziendasito'],
			['comune sito','comunesito'],
			['anno','anno'],
			['tempo posizionamento','tempo'],
			['tempo rimozione','tempo_rimozione'],
		],
		'sql'=> "SELECT trappole_geometry.id, codice, to_char(datacreazione,'YYYY-MM-DD') as datacreazione, to_char(datavariazione,'YYYY-MM-DD') as datavariazione, 
					st_asgeojson(st_transform(trappole_geometry.the_geom,3857),15,2) AS geometry, statotrappole.descrizione as stato, 
					siti.denominaz, statotrappole.id as stato_id, coalesce(trappole_geometry.nome,'N/A') as nome, azienda.rag_soc||'-'||siti.denominaz as aziendasito,
					CASE WHEN anno IS null THEN date_part('Year',datacreazione) ELSE anno END AS anno, tipo_trappole.descrizione as tipotrappola,
					tecnici.cognome||' '||tecnici.nome AS tecnico, coalesce(t_vista.full_name,'N/A') as mainpest, tempo, organismo, tempo_rimozione, durata_erogatore,
					tecnicirimozione.cognome||' '||tecnicirimozione.nome AS tecnico_rimozione,sch_start.data_sopralluogo as data_posizionamento,sch_end.data_sopralluogo as data_rimozione,
					st_x(trappole_geometry.the_geom) as coord_x,st_y(trappole_geometry.the_geom) as coord_y,
					comuni.nome as comunesito
				FROM simfito.trappole_geometry
				INNER JOIN simfito.scheda sch_start on sch_start.idscheda=trappole_geometry.scheda_id
				LEFT JOIN simfito.scheda sch_end on sch_end.idscheda=trappole_geometry.rimozionescheda_id
				INNER JOIN simfito.statotrappole on simfito.trappole_geometry.statotrappole_id=simfito.statotrappole.id
				INNER JOIN simfito.siti ON siti.gid = trappole_geometry.gid
				LEFT JOIN comuni on comuni.istat=siti.comune_istat
				LEFT JOIN simfito.azienda ON siti.piva_azienda=azienda.partita_iva
				LEFT JOIN simfito.tipo_trappole on trappole_geometry.tipo_trappole_id=tipo_trappole.id
				LEFT JOIN simfito.tecnici on trappole_geometry.tecnico_id=tecnici.id_tecnico
				LEFT JOIN simfito.tecnici AS tecnicirimozione on trappole_geometry.tecnicorimozione_id=tecnicirimozione.id_tecnico
				LEFT JOIN t_vista on trappole_geometry.organismo=t_vista.b_code
				WHERE sch_start.stato=2 and coalesce(sch_end.stato,2)=2 and (%where%)
				ORDER BY 1"
	],

	'catture' => [
		'parms' => ['code','start','end'],
		'filename'=>'catture.xlsx',
		'worksheet'=> 'catture',
		'columns' => [
			['id trappola','id_trappola'],
			['codice trappola','codice'],
			['organismo trappola','trappola_per'],
			['data posizionamento','posizionamento'],
			['data rimozione','rimozione'],
			['stato trappola','stato_trappola'],
			['denominazione sito','denominazione_sito'],
			['localita sito','localita_sito'],
			['indirizzo sito','indirizzo_sito'],
			['comune sito','comune_sito'],
			['tipo sito','tipo_sito'],
			['catture positive','positivi'],
			['catture negative','negativi']

		],
		'sql' => "with yy as(
	with xx as(
		select campioni_id, 
		count(*) as analisi_no,
		sum(case when analisysresult.positive in (0,1) then 1 else 0 end) as analisivere_no,
		sum(case when analisysresult.positive in (2) then 1 else 0 end) as analisina_no,
		sum(case when analisysresult.positive=1 then 1 else 0 end) as positive,
		sum(case when analisysresult.positive=0 then 1 else 0 end) as negative,
		case when sum(case when analisysresult.positive=1 then 1 else 0 end)>0        then 1 else 0 end as positiva ,
		case when sum(case when analisysresult.positive=0 then 1 else 0 end)=sum(case when analisysresult.positive in (0,1) then 1 else 0 end) then 1 else 0 end as negativa
		from simfitolab.analisys
		left join simfitolab.analisysresult on analisys.analisysresult_id=analisysresult.id
		where pest='%code%' and analisysstate_id=2
		group by campioni_id	
	)
	select count(*), 
		sum(case when osservazioni.campioni_id is null then 1 else 0 end) as campioni, 
		case when sum(catture)<0 then 0 else sum(catture) end as catture1,
		sum(case when osservazioni.campioni_id is null then catture else 0 end) as catture_no_camp,
		sum(xx.positiva) as analisi_pos,
		sum(xx.negative) as analisi_neg,
		sum(coalesce(xx.positiva * osservazioni.catture, 0)) as catture_si_camp,
		sum(case when osservazioni.campioni_id is null then catture else 0 end) + sum(coalesce(xx.positiva * osservazioni.catture, 0)) as totale,
		sum(coalesce(xx.negativa * osservazioni.catture, 0)) as totale_neg,
		trappole_geometry_id, array_agg(scheda.data_sopralluogo),
		array_agg(osservazioni.idosservazioni),
		array_agg(osservazioni.campioni_id) as list_campioni
	from simfito.osservazioni
	left join simfito.scheda on osservazioni.idscheda=scheda.idscheda 
	left join xx on simfito.osservazioni.campioni_id=xx.campioni_id

	where osservazioni.pestcode='%code%' and scheda.data_sopralluogo between '%start%' and '%end%' and not visiva and scheda.stato=2
	group by trappole_geometry_id
)
select 
	trappole_geometry.id as id_trappola, codice, organismo as trappola_per, 
	posiz.data_sopralluogo as posizionamento,
	rimoz.data_sopralluogo as rimozione, statotrappole.descrizione as stato_trappola, 
    siti.denominaz as denominazione_sito, siti.localita as localita_sito, siti.indirizzo as indirizzo_sito, comuni.nome as comune_sito,
	simfito.tipo_visita.motivo as tipo_sito,
	coalesce(totale,0) as positivi,
	coalesce(totale_neg,0) as negativi
from simfito.trappole_geometry
inner join simfito.scheda as posiz on posiz.idscheda=trappole_geometry.scheda_id
left join simfito.scheda as rimoz on rimoz.idscheda=trappole_geometry.rimozionescheda_id
left join simfito.siti on posiz.gid_sito=siti.gid
left join comuni on comuni.istat= simfito.siti.comune_istat
left join simfito.tipo_visita on simfito.siti.tipologiasito_id= simfito.tipo_visita.idtipo_visita
left join yy on yy.trappole_geometry_id = simfito.trappole_geometry.id	
left join simfito.statotrappole on trappole_geometry.statotrappole_id=statotrappole.id
--where yy.totale >0"

	],

	'catture2' => [
		'parms' => ['code','start','end'],
		'filename'=>'catture2.xlsx',
		'worksheet'=> 'catture',
		'columns' => [
			['id scheda','idscheda'],

			['tecnico rilevatore','tecnico'],

			['denominazione sito','denominazione_sito'],
			['localita sito','localita_sito'],
			['indirizzo sito','indirizzo_sito'],
			['comune sito','comune_sito'],
			['provincia sito','provincia_sito'],
			['tipo sito','tipo_sito'],

			['catture positive','positivi'],
			['catture negative','negativi'],

			['analisi laboratorio','analisi'],

		],
		'sql' => "with yy as(
	with xx as(
		select campioni_id, 
		count(*) as analisi_no,
		string_agg(agent.name,',') as agent_name,
		sum(case when analisysresult.positive in (0,1) then 1 else 0 end) as analisivere_no,
		sum(case when analisysresult.positive in (2) then 1 else 0 end) as analisina_no,
		sum(case when analisysresult.positive=1 then 1 else 0 end) as positive,
		sum(case when analisysresult.positive=0 then 1 else 0 end) as negative,
		case when sum(case when analisysresult.positive=1 then 1 else 0 end)>0        then 1 else 0 end as positiva ,
		case when sum(case when analisysresult.positive=0 then 1 else 0 end)=sum(case when analisysresult.positive in (0,1) then 1 else 0 end) then 1 else 0 end as negativa
		from simfitolab.analisys
		left join simfitolab.agent on agent.id=analisys.agent_id
		left join simfitolab.analisysresult on analisys.analisysresult_id=analisysresult.id
		where pest='%code%' and analisysstate_id=2
		group by campioni_id	
	)
	select  osservazioni.idosservazioni,osservazioni.idscheda,gid_sito,id_tecnico,count(*), 
		sum(case when osservazioni.campioni_id is null then 1 else 0 end) as campioni, 
		case when sum(catture)<0 then 0 else sum(catture) end as catture1,
		sum(case when osservazioni.campioni_id is null then catture else 0 end) as catture_no_camp,
		sum(xx.positiva) as analisi_pos,
		sum(xx.negative) as analisi_neg,
		sum(coalesce(xx.positiva * osservazioni.catture, 0)) as catture_si_camp,
		sum(case when osservazioni.campioni_id is null then catture else 0 end) + sum(coalesce(xx.positiva * osservazioni.catture, 0)) as totale,
		sum(coalesce(xx.negativa * osservazioni.catture, 0)) as totale_neg,
		string_agg(agent_name,',') as agent_name
	from simfito.osservazioni
	left join simfito.scheda on osservazioni.idscheda=scheda.idscheda 
	left join xx on simfito.osservazioni.campioni_id=xx.campioni_id
	where osservazioni.pestcode='%code%' and scheda.data_sopralluogo between '%start%' and '%end%' and not visiva and scheda.stato=2
	group by osservazioni.idosservazioni,osservazioni.idscheda,gid_sito,id_tecnico
)
select 
	yy.idosservazioni,idscheda,concat(tecnici.nome,' ',tecnici.cognome) as tecnico,
	siti.denominaz as denominazione_sito, siti.localita as localita_sito, siti.indirizzo as indirizzo_sito, comuni.nome as comune_sito,
	province.denominazione as provincia_sito,
	simfito.tipo_visita.motivo as tipo_sito,
	coalesce(totale,0) as positivi,
	coalesce(totale_neg,0) as negativi,
	agent_name as analisi
from yy
left join simfito.siti on yy.gid_sito=siti.gid
left join comuni on comuni.istat=simfito.siti.comune_istat
left join province on province.id=comuni.prvistat
left join simfito.tipo_visita on simfito.siti.tipologiasito_id= simfito.tipo_visita.idtipo_visita
left join simfito.tecnici on yy.id_tecnico=tecnici.id_tecnico"
	],

	'schedenonchiuse'=> [
		'parms' => [],
		'filename'=>'schedenonchiuse.xlsx',
		'worksheet'=> 'schedenonchiuse',
		'columns' => [
			['idscheda','idscheda'],
			['tecnico','tecnico'],
			['azienda','azienda'],
			['denominazione sito','denominazione sito'],
			['localita sito','localita sito'],
			['comune','comune'],
			['provincia','provincia'],
			['data sopralluogo','data sopralluogo'],
			['osservazioni','osservazioni'],
			['trappole posizionate','trappole posizionate'],
			['trappole rimosse','trappole rimosse']
		],
		'sql'=>"select scheda.idscheda, tecnici.cognome || ' ' || tecnici.nome as tecnico, azienda.rag_soc as azienda, siti.denominaz as \"denominazione sito\", 
	siti.localita as \"localita sito\", comuni.nome as comune, comuni.provincia, data_sopralluogo as \"data sopralluogo\", count(idosservazioni) as osservazioni, 
	count(trappolepos.id) as \"trappole posizionate\", count(trappolerem.id) as \"trappole rimosse\"
from simfito.scheda 
inner join simfito.tecnici on scheda.id_tecnico = tecnici.id_tecnico
left join simfito.osservazioni on scheda.idscheda= osservazioni.idscheda
left join simfito.trappole_geometry as trappolepos on scheda.idscheda=trappolepos.scheda_id
left join simfito.trappole_geometry as trappolerem on scheda.idscheda=trappolerem.rimozionescheda_id
left join simfito.siti on scheda.gid_sito=siti.gid
left join simfito.azienda on siti.piva_azienda = azienda.partita_iva
left join comuni on siti.comune_istat = comuni.istat
where scheda.stato=0 and date_part('year',data_sopralluogo) >= 2020 AND scheda.id_tecnico <> 2
group by scheda.idscheda, tecnico, data_sopralluogo, azienda.rag_soc, siti.denominaz, siti.localita, comuni.nome, comuni.provincia
order by 2, 3 desc"
	]
];


/*

OSSERVAZIONI
  idosservazioni serial NOT NULL,
  hostcode character varying(20) NOT NULL,
  pestcode character varying(20) NOT NULL,
  rilevato integer DEFAULT 0,
  sospetti character varying(250),
  campione boolean DEFAULT false,
*  attacco_int integer DEFAULT 0,
*  attacco_grado integer DEFAULT 0,
  fase_fenologica character varying(255),
  n_osservate numeric,
  organi character varying,
  pericolosita character varying,
  varieta character varying,
  eta character varying,
  data_impianto date,
  appezzamento real DEFAULT 0,
  dens_piante real DEFAULT 0, -- Numero di piante per m2
  piante_camp_vis real, -- Numero di piante campionate visivamente
  coltura_prec character varying,
  piante_infest numeric,
  sup_vis real,
  sup_infest real,
  n_abbattute integer DEFAULT 0,
*  campioni_id integer,

SCHEDA
  idscheda serial NOT NULL,
*  idtipo_visita integer,
*  id_tecnico integer,
  data_sopralluogo date,
  note character varying,

SITI
#  the_geom geometry, (X-Y-centroide)
  denominaz character varying(100),
  localita character varying(250),
  indirizzo character varying(250),
  superficie_ha numeric(10,1),
  quota real,

COMUNI
  provincia character varying(6),
  nome character varying(254),

AZIENDA
  partita_iva character varying NOT NULL,
  rag_soc character varying(250) NOT NULL,
  xx_tipoazienda

TIPO_VISITA
  motivo

TECNICI
*  idtipo_tecnico integer,
  nome character varying NOT NULL,
  cognome character varying NOT NULL,
  email character varying,
  ufficio character varying,
  codicefiscale character varying,
  titolo character varying,
  telefono character varying,
  mobile character varying,
  cancellato boolean DEFAULT false,

TIPO_TECNICO
  tipo_tecnico character varying(30) NOT NULL,

GRADO_ATTACCO
  nome_grado character varying NOT NULL,

INTENSITY
  nome_intensity character varying,

CAMPIONI
  codice character varying,
*  laboratoriostato_id integer DEFAULT 1,
  motivo text, -- motivi legati allo stato del campione
*  laboratorio_id integer,
  elementicampione integer NOT NULL DEFAULT 1,

LABORATORIO
 denominazione character varying,

LABORATORIOSTATO
  descrizione character varying,

OBS_RILEVATO
  descrizione character varying,

HOST
host.full_name,

PEST
pest.full_name

---


osservazioni.idosservazioni,
osservazioni.hostcode,
osservazioni.pestcode,
osservazioni.rilevato,
osservazioni.sospetti,
osservazioni.campione,
osservazioni.fase_fenologica,
osservazioni.n_osservate,
osservazioni.organi,
osservazioni.pericolosita,
osservazioni.varieta,
osservazioni.eta,
osservazioni.data_impianto,
osservazioni.appezzamento,
osservazioni.dens_piante,
osservazioni.piante_camp_vis,
osservazioni.coltura_prec,
osservazioni.piante_infest,
osservazioni.sup_vis,
osservazioni.sup_infest,
osservazioni.n_abbattute,
scheda.idscheda,
scheda.data_sopralluogo,
scheda.note,
st_x(st_transform(st_centroid(siti.the_geom),32633)),
st_y(st_transform(st_centroid(siti.the_geom),32633)),
siti.denominaz,
siti.localita,
siti.indirizzo,
siti.superficie_ha,
siti.quota,
comuni.provincia,
comuni.nome,
azienda.partita_iva,
azienda.rag_soc,
xx.xx_tipoazienda,
tipo_visita.motivo,
tecnici.nome,
tecnici.cognome,
tecnici.email,
tecnici.ufficio,
tecnici.codicefiscale,
tecnici.titolo,
tecnici.telefono,
tecnici.mobile,
tecnici.cancellato,
tipo_tecnico.tipotecnico,
grado_attacco.nome_grado,
intensity.nome_intensity,
campioni.codice,
campioni.motivo,
campioni.elementicampione,
laboratorio.denominazione,
laboratoriostato.descrizione,
obs_rilevato.descrizione,
host.full_name,
pest.full_name

*/

$pdfs = [
	'scheda' => [
		'filename' => 'scheda.pdf',
		'sql' => 'SELECT tecnici.nome as t_nome,tecnici.cognome as t_cognome,tecnici.email as t_email,round(st_x(st_centroid(st_transform(siti.the_geom,32633)))) as x,round(st_y(st_centroid(st_transform(siti.the_geom,32633)))) as y,* FROM scheda
LEFT JOIN tecnici ON scheda.id_tecnico=tecnici.id_tecnico
LEFT JOIN siti ON scheda.gid_sito=siti.gid
LEFT JOIN azienda ON siti.piva_azienda=azienda.partita_iva
LEFT JOIN tipo_visita ON scheda.idtipo_visita=tipo_visita.idtipo_visita
LEFT JOIN comuni ON siti.comune_istat=comuni.istat
WHERE idscheda=%s',

		'sqlb' => "WITH host as (SELECT b_code,full_name as host_full_name FROM t_baycode INNER JOIN t_bayname on t_baycode.codeid=t_bayname.codeid WHERE isolang='la' and preferred=1),
pest as (SELECT b_code,full_name as pest_full_name FROM t_baycode INNER JOIN t_bayname on t_baycode.codeid=t_bayname.codeid WHERE isolang='la' and preferred=1),
noabbattimenti as ( SELECT osservazioni_id,sum(quantity) AS no_abbattimenti FROM abbattimenti GROUP BY osservazioni_id)
SELECT to_char(data_impianto,'YYYY-MM-DD') as data_impiantox,case campione when true then 'si' else 'no' end as campione_lab,obs_rilevato.descrizione as presente,*,idosservazioni,coalesce(no_abbattimenti,0) as no_abbatt,
tipologiacontrollata.descrizione as tipologiacontrollata_descrizione,
osservazioni.unita,osservazioni.unita_chk,osservazioni.peso,osservazioni.peso_chk,osservazioni.lotti,osservazioni.lotti_chk,
osservazioni.lotti_camp,osservazioni.provenienza,
elementicampione,tipocampione.description as tipocampione_description  
FROM osservazioni
LEFT JOIN obs_rilevato ON osservazioni.rilevato=obs_rilevato.id
LEFT JOIN grado_attacco ON osservazioni.attacco_grado=grado_attacco.id_grado
LEFT JOIN intensity ON osservazioni.attacco_int=intensity.id_intensity
LEFT JOIN campioni ON osservazioni.campioni_id=campioni.id
LEFT JOIN tipocampione ON campioni.tipocampione_id=tipocampione.id 
LEFT JOIN host ON osservazioni.hostcode=host.b_code
LEFT JOIN pest ON osservazioni.pestcode=pest.b_code
LEFT JOIN noabbattimenti on osservazioni.idosservazioni=noabbattimenti.osservazioni_id
LEFT JOIN tipologiacontrollata ON osservazioni.tipologiacontrollata_id=tipologiacontrollata.id
WHERE visiva AND idscheda=%s
ORDER BY idosservazioni",

		'sqlb1' => "WITH host as (SELECT b_code,full_name as host_full_name FROM t_baycode INNER JOIN t_bayname on t_baycode.codeid=t_bayname.codeid WHERE isolang='la' and preferred=1),
pest as (SELECT b_code,full_name as pest_full_name FROM t_baycode INNER JOIN t_bayname on t_baycode.codeid=t_bayname.codeid WHERE isolang='la' and preferred=1),
noabbattimenti as ( SELECT osservazioni_id,sum(quantity) AS no_abbattimenti FROM abbattimenti GROUP BY osservazioni_id)
SELECT to_char(data_impianto,'YYYY-MM-DD') as data_impiantox,case campione when true then 'si' else 'no' end as campione_lab,obs_rilevato.descrizione as presente,*,idosservazioni,coalesce(no_abbattimenti,0) as no_abbatt,
tipologiacontrollata.descrizione as tipologiacontrollata_descrizione,
osservazioni.unita,osservazioni.unita_chk,osservazioni.peso,osservazioni.peso_chk,osservazioni.lotti,osservazioni.lotti_chk,
osservazioni.lotti_camp,osservazioni.provenienza,
osservazioni.catture,case osservazioni.cambioferomone when true then 'si' else 'no' end as cambioferomone,
elementicampione,tipocampione.description as tipocampione_description,
trappole_geometry.codice as trappole_geometry_codice,
campioni.codice as campioni_codice    
FROM osservazioni
LEFT JOIN obs_rilevato ON osservazioni.rilevato=obs_rilevato.id
LEFT JOIN grado_attacco ON osservazioni.attacco_grado=grado_attacco.id_grado
LEFT JOIN intensity ON osservazioni.attacco_int=intensity.id_intensity
LEFT JOIN campioni ON osservazioni.campioni_id=campioni.id
LEFT JOIN tipocampione ON campioni.tipocampione_id=tipocampione.id 
LEFT JOIN host ON osservazioni.hostcode=host.b_code
LEFT JOIN pest ON osservazioni.pestcode=pest.b_code
LEFT JOIN noabbattimenti on osservazioni.idosservazioni=noabbattimenti.osservazioni_id
LEFT JOIN tipologiacontrollata ON osservazioni.tipologiacontrollata_id=tipologiacontrollata.id
LEFT JOIN trappole_geometry ON trappole_geometry.id=osservazioni.trappole_geometry_id
WHERE (NOT visiva) AND idscheda=%s
ORDER BY idosservazioni",

// posizionamento trappole versione originale
		'sqlc' => "set search_path to simfito,eppo,public;
select 
trappole_geometry.codice as trappole_geometry_codice,
tipo_trappole.descrizione as tipo_trappole_descrizione,
trappole.numero_individui as trappole_numero_individui,
trappole.n_piante_rap as trappole_n_piante_rap,
trappole.note as trappole_note,
trappole.id_osservazione as trappole_id_osservazione   
from trappole 
inner join osservazioni on trappole.id_osservazione=osservazioni.idosservazioni
inner join trappole_geometry on trappole.trappole_geometry_id=trappole_geometry.id
inner join tipo_trappole on trappole_geometry.tipo_trappole_id=tipo_trappole.id
where idscheda=%s;",

// posizionamento/rimozione trappole NUOVA versione 20220126
		'sqlc1' => "WITH host as (SELECT b_code,full_name as host_full_name FROM t_baycode INNER JOIN t_bayname on t_baycode.codeid=t_bayname.codeid WHERE isolang='la' and preferred=1),
pest as (SELECT b_code,full_name as pest_full_name FROM t_baycode INNER JOIN t_bayname on t_baycode.codeid=t_bayname.codeid WHERE isolang='la' and preferred=1)
SELECT trappole_geometry.*,
host_full_name,pest_full_name, 
tipo_trappole.descrizione as tipo_trappole_descrizione,
case when rimozionescheda_id is null then 'Posizionamento' else 'Rimozione' end as attivita,
case when rimozionescheda_id is null then tempo else tempo_rimozione end as tempo_attivita
FROM trappole_geometry
LEFT JOIN host ON host.b_code=trappole_geometry.host
LEFT JOIN pest ON pest.b_code=trappole_geometry.organismo
INNER JOIN tipo_trappole ON tipo_trappole.id=trappole_geometry.tipo_trappole_id
WHERE scheda_id=%s OR rimozionescheda_id=%s ORDER BY attivita",

		'sqld' => "select 
abbattimenti.*,to_char(date,'DD-MM-YYYY') as datex
from abbattimenti 
inner join osservazioni on abbattimenti.osservazioni_id=osservazioni.idosservazioni
where idscheda=%s order by osservazioni_id,date",
		'sqle' => "SELECT 
distinct nome,cognome,ufficio,email 
FROM schede_tecnici INNER JOIN tecnici ON schede_tecnici.id_tecnico=tecnici.id_tecnico 
WHERE schede_tecnici.idscheda=%d",

		'header' => []
	]
];


?>
