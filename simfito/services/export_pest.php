<?php

//
// selettore per i dati da esportare in versione dinamica
// usato dalla report "rendicontazione" report5.php
//

function collect_pests($year) {
	global $db;
	$sql = "SELECT * FROM simfito.reportue WHERE anno=$year AND enabled";
	$db->Read($sql);
	$pests = [];
	$macropests = [];
	while($r = $db->fetch_assoc()) {
		$mp = json_decode($r['pest']);
		for($i=0;$i<count($mp);$i++)
			$pests[] = $mp[$i];
		$macropests[$r['nomereport']] = $mp;
	}	
	return [$pests,$macropests];
}

//
// selettore per i dati da esportare in versione statica
// valori supportati 2018, 2019, 2020
//

$export_pest_year = 2020;
$collect_from_db = true;		// configurabile

// i pest da processare
if ($collect_from_db) {
	; // non fare niente al caricamento, fallo DOPO aver stabilito l'anno
}
else if ($export_pest_year==2018) {
	$pests = array(
		'1ALECG','1DACUG','ALECBA','ALECCN','ALECCO','ALECCT','ALECGA','ALECHU',
		'ALECIN','ALECMA','ALECNG','ALECNI','ALECNU','ALECOB','ALECPI','ALECRU',
		'ALECSI','ALECSN','ALECSO','ALECSP','ALECWO','ALECZI','ANOLCN','ANOLGL',
		'ANTHEU','AROMBU','BURSXY','CORBSE','CTV000','DACUBI','DACUCI','DACUFE',
		'DACUFR','DACUHA','DACUHU','DACULO','DACUNE','DACUPE','DACUSP','EPIXAB',
		'EPIXAL','EPIXAR','EPIXAT','EPIXCA','EPIXCU','EPIXDI','EPIXFA','EPIXFS',
		'EPIXFU','EPIXIN','EPIXNC','EPIXNG','EPIXPA','EPIXPI','EPIXPR','EPIXPU',
		'EPIXSI','EPIXSP','EPIXSU','EPIXTU','GEOHMO','GUIGCI','HETDPA','HETDRO',
		'MONCAL','MONCCA','MONCCL','MONCGA','MONCGP','MONCGR','MONCIM','MONCMC',
		'MONCMR','MONCNI','MONCNM','MONCNO','MONCOB','MONCOR','MONCRB','MONCRU',
		'MONCSA','MONCSB','MONCSC','MONCSL','MONCSP','MONCSR','MONCST','MONCSU',
		'MONCTI','MONCUR','MONCVE','PHYP64','PISOAP','PISOCE','PISODU','PISOEN',
		'PISOFA','PISOHA','PISOMU','PISONE','PISONI','PISONO','PISOOB','PISOPC',
		'PISOPN','PISOPP','PISORA','PISORO','PISOSC','PISOSI','PISOSP','PISOST',
		'PISOSW','PISOTE','PISOVA','PITOJU','PSDMAK','PSDMS1','PSDMS2','PSDMS3',
		'RALSSO','SCAPLI','SYNCEN','TOLCND','TOXOCI','XYLEFA','XYLEFM','XYLEFP',
		'XYLEFS','PHILSU',

		'TETTVI','PHILSP','1PHILG','DACUDO'
	);

	$macropests = array(

		"Aleurocanthus spp." => array(
			'1ALECG','ALECBA','ALECCN','ALECCT',
			'ALECCO','ALECGA','ALECHU','ALECIN',
			'ALECMA','ALECNG','ALECNI','ALECNU',
			'ALECOB','ALECPI','ALECRU','ALECSI',
			'ALECSP','ALECSN','ALECSO','ALECWO',
			'ALECZI'
		),
		"ANOPLOPHORA CHINENSIS" => array('ANOLCN'),
		"ANOPLOPHORA GLABRIPENNIS" => array('ANOLGL'),
		"Anthonomus eugenii" => array('ANTHEU'),
		"AROMIA BUNGII" => array('AROMBU'),
		"BURSAPHELENCHUS XYLOPHILUS" => array('BURSXY'),
		"Citrus tristeza virus" => array('CTV000'),
		"Clavibacter michiganense subsp. sepedonicus" => array(CORBSE),
		"Dacus dorsalis" => array(
			'1DACUG','DACUBI','DACUCI','DACUFE',
			'DACUFR','DACUHA','DACUHU','DACULO',
			'DACUNE','DACUPE','DACUSP'
		),

		"Epitrix cucumeris, Epitrix similaris, ecc" => array(
			'EPIXAB','EPIXAL','EPIXAR','EPIXAT',
			'EPIXCA','EPIXCU','EPIXDI','EPIXFA',
			'EPIXFS','EPIXFU','EPIXPA','EPIXIN',
			'EPIXNC','EPIXNG','EPIXPI','EPIXPR',
			'EPIXPU','EPIXSI','EPIXSP','EPIXSU',
			'EPIXTU'
		),
		"Globodera rostochiensis, Globodera pallida" => array('HETDPA','HETDRO'),
		"Grapevine flavescenza doree" => array('PHYP64'),
		"MONOCHAMUS SPP. (non europei)" => array(
			'MONCAL','MONCCA','MONCCL','MONCGA',
			'MONCGP','MONCGR','MONCIM','MONCMR',
			'MONCMC','MONCNI','MONCNO','MONCNM',
			'MONCOB','MONCOR','MONCRB','MONCRU',
			'MONCSL','MONCSA','MONCSR','MONCSC',
			'MONCST','MONCSP','MONCSB','MONCSU',
			'MONCTI','MONCUR','MONCVE'
		),
		"CICADELLA VIRIDIS" => array('TETTVI'),
		"Philaenus spumarius"=> array('PHILSU'),
		"Philaenus sp"=> array('PHILSP'),
		"Philaenus"=> array('1PHILG'),
		"Phyllosticta citricarpa" => array('GUIGCI'),
		"Pissodes spp (non-European)" => array(
			'PISOAP','PISONO','PISOCE','PISODU',
			'PISOEN','PISOFA','PISOHA','PISOMU',
			'PISONE','PISONI','PISOOB','PISOPC',
			'PISOPN','PISOPP','PISORA','PISORO',
			'PISOSC','PISOSW','PISOSI','PISOSP',
			'PISOST','PISOTE','PISOVA'
		),
		"Pityophthorus juglandis - Geosmithia morbida" => array('GEOHMO','PITOJU'),
		"Pseudomonas syringae pv. actinidiae" => array('PSDMAK'),
		"Ralstonia solanacearum" => array('RALSSO','PSDMS1','PSDMS2','PSDMS3'),
		"Scaphoideus titanus" => array('SCAPLI'),
		"Synchytrium endobioticum" => array('SYNCEN'),
		"ToLCNDV" => array('TOLCND'),
		"Toxoptera citricida" => array('TOXOCI'),
		"XYLELLA FASTIDIOSA" => array('XYLEFA'),
		"XYLELLA FASTIDIOSA subsp MULTIPLEX" => array('XYLEFM'),
		"XYLELLA FASTIDIOSA subsp PAUCA" => array('XYLEFP'),
		"XYLELLA FASTIDIOSA subsp SANDYI" => array('XYLEFS'),
		"BACTROCERA" => array('DACUDO')
	);
}
else if ($export_pest_year==2019) {
	$pests = array(
		'AGRLAX','AGRLPL','1ALECG','ALECBA','ALECCN','ALECCT','ALECCO','ALECGA',
		'ALECHU','ALECIN','ALECMA','ALECNG','ALECNI','ALECNU','ALECOB','ALECPI',
		'ALECRU','ALECSI','ALECSP','ALECSN','ALECSO','ALECWO','ALECZI','ANOLCN',
		'ANOLGL','ANTHEU','AROMBU','BURSXY','1LIBEG','LIBEAF','LIBEAM','LIBEAS',
		'LIBEPS','LIBEEU','DIAACI','TRIZER','CTV000','CORBSE','DACUDO','EPIXCA',
		'EPIXCU','EPIXDI','EPIXFA','EPIXFS','EPIXFU','EPIXPA','EPIXIN','EPIXNC',
		'EPIXNG','EPIXPI','EPIXPR','EPIXPU','EPIXSI','EPIXSP','EPIXSU','EPIXTU',
		'PITOJU','GEOHMO','1GLOBG','HETDPA','HETDRO','PHYP64','MONCAL','MONCCA','MONCCL',
		'MONCGA','MONCGP','MONCGR','MONCIM','MONCMR','MONCMC','MONCNI','MONCNO',
		'MONCNM','MONCOB','MONCOR','MONCRB','MONCRU','MONCSL','MONCSA','MONCSR',
		'MONCSC','MONCST','MONCSP','MONCSB','MONCSU','MONCTI','MONCUR','MONCVE',
		'GUIGCI','PISOAP','PISONO','PISOCE','PISODU','PISOEN','PISOFA','PISOHA',
		'PISOMU','PISONE','PISONI','PISOOB','PISOPC','PISOPN','PISOPP','PISORA',
		'PISORO','PISOSC','PISOSW','PISOSI','PISOSP','PISOST','PISOTE','PISOVA',
		'POPIJA','PSDMAK','RALSSO','PSDMS1','PSDMS2','PSDMS3','SCAPLI','SCITAU',
		'SCITBI','SCITCI','SCITCO','SCITDO','SCITLO','SCITMG','SCITMN','SCITSI',
		'SCITSP','SERTGR','SERTVA','TAETCA','1SCITG','SCITPE','SCITIN','SCITCA',
		'SCITDI','SCITBO','SYNCEN','ARGPLE','TOLCND','TOXOCI','XANTAR','XANTCA',
		'XANTCN','XANTCU','XANTCV','XANTHY','XANTIN','XANTMI','XANTOR','XANTRA',
		'XANTSE','XANTZN','XANTCS','XANTPI','XANTAL','XANTAT','XANTBE','XANTCE',
		'XANTCI','XANTCJ','XANTCM','XANTCP','XANTCR','XANTCY','XANTGL','XANTGR',
		'XANTHE','XANTHO','XANTJU','XANTMA','XANTMN','XANTNA','XANTPE','XANTPH',
		'XANTPL','XANTPR','XANTRI','XANTSC','XANTTO','XANTTR','XANTTU','XANTVA',
		'XANTVG','XANTVI','XANTDF','XANTFI','XANTGU','XANTAV','XANTAA','XANTMU',
		'XANTLO','XANTAO','XANTPU','XANTCB','XYLEFA','XYLEFM','XYLEFP','XYLEFS',
		'XYLBCR','1DACUG','DACUBI','DACUCI','DACUFE','DACUFR','DACUHA','DACUHU',
		'DACULO','DACUNE','DACUPE','DACUSP','TETTVI','PHILSU','PHILSP','1PHILG',
		'AGRLGT'
	);

	$macropests = array(
		"Agrilus anxius" => array('AGRLAX'),
		"Agrilus planipennis" => array('AGRLPL'),
		"Aleurocanthus spp." => array(
			'1ALECG','ALECBA','ALECCN','ALECCT',
			'ALECCO','ALECGA','ALECHU','ALECIN',
			'ALECMA','ALECNG','ALECNI','ALECNU',
			'ALECOB','ALECPI','ALECRU','ALECSI',
			'ALECSP','ALECSN','ALECSO','ALECWO',
			'ALECZI'
		),
		"Anoplophora chinensis" => array('ANOLCN'),
		"Anoplophora glabripennis" => array('ANOLGL'),
		"Anthonomus eugenii" => array('ANTHEU'),
		"Aromia bungii" => array('AROMBU'),
		"Bursaphelenchus xylophilus" => array('BURSXY'),
		"Candidatus liberibacter spp." => array(
			'1LIBEG','LIBEAF','LIBEAM','LIBEAS',
			'LIBEPS','LIBEEU'
		),
		"Diaphorina citri" => array('DIAACI'),
		"Trioza erytreae" => array('TRIZER'),
		"Citrus tristeza virus" => array('CTV000'),
		"Clavibacter michiganense subsp. sepedonicus" => array('CORBSE'),
		"Bactrocera dorsalis" => array('DACUDO'),
		"Epitrix cucumeris, Epitrix similaris, Epitrix subcritica, E. tuberis" => array(
			'EPIXAB','EPIXAL','EPIXAR','EPIXAT',
			'EPIXCA','EPIXCU','EPIXDI','EPIXFA',
			'EPIXFS','EPIXFU','EPIXPA','EPIXIN',
			'EPIXNC','EPIXNG','EPIXPI','EPIXPR',
			'EPIXPU','EPIXSI','EPIXSP','EPIXSU',
			'EPIXTU'
		),
		"Geosmithia morbida e Pityophtorus juglandis" => array('PITOJU','GEOHMO'),
		"Globodera rostochiensis, Globodera pallida" => array('1GLOBG','HETDPA','HETDRO'),
		"Grapevine flavescenza doree" => array('PHYP64'),
		"Monochamus spp." => array(
			'MONCAL','MONCCA','MONCCL','MONCGA',
			'MONCGP','MONCGR','MONCIM','MONCMR',
			'MONCMC','MONCNI','MONCNO','MONCNM',
			'MONCOB','MONCOR','MONCRB','MONCRU',
			'MONCSL','MONCSA','MONCSR','MONCSC',
			'MONCST','MONCSP','MONCSB','MONCSU',
			'MONCTI','MONCUR','MONCVE'
		),
		"Phyllosticta citricarpa" => array('GUIGCI'),
		"Pissodes spp (non-European)" => array(
			'PISOAP','PISONO','PISOCE','PISODU',
			'PISOEN','PISOFA','PISOHA','PISOMU',
			'PISONE','PISONI','PISOOB','PISOPC',
			'PISOPN','PISOPP','PISORA','PISORO',
			'PISOSC','PISOSW','PISOSI','PISOSP',
			'PISOST','PISOTE','PISOVA'
		),
		"Popillia japonica" => array('POPIJA'), 
		"Pseudomonas syringae pv. actinidiae" => array('PSDMAK'),
		"Ralstonia solanacearum" => array('RALSSO','PSDMS1','PSDMS2','PSDMS3'),
		"Scaphoideus titanus" => array('SCAPLI'),
		"Scirtothrips spp." => array(
			'SCITAU','SCITBI','SCITCI','SCITCO',
			'SCITDO','SCITLO','SCITMG','SCITMN',
			'SCITSI','SCITSP','SERTGR','SERTVA',
			'TAETCA','1SCITG','SCITPE','SCITIN',
			'SCITCA','SCITDI','SCITBO'
		),
		"Synchytrium endobioticum" => array('SYNCEN'),
		"Thaumatotibia leucotreta" => array('ARGPLE'),
		"Tomato leaf curl new delhi virus" => array('TOLCND'),
		"Toxoptera citricida" => array('TOXOCI'),
		"Xanthomonas campestris" => array(
			'XANTAR','XANTCA','XANTCN','XANTCU',
			'XANTCV','XANTHY','XANTIN','XANTMI',
			'XANTOR','XANTRA','XANTSE','XANTZN',
			'XANTCS','XANTPI','XANTAL','XANTAT',
			'XANTBE','XANTCE','XANTCI','XANTCJ',
			'XANTCM','XANTCP','XANTCR','XANTCY',
			'XANTGL','XANTGR','XANTHE','XANTHO',
			'XANTJU','XANTMA','XANTMN','XANTNA',
			'XANTPE','XANTPH','XANTPL','XANTPR',
			'XANTRI','XANTSC','XANTTO','XANTTR',
			'XANTTU','XANTVA','XANTVG','XANTVI',
			'XANTDF','XANTFI','XANTGU','XANTAV',
			'XANTAA','XANTMU','XANTLO','XANTAO',
			'XANTPU','XANTCB'
		),
		"Xylella fastidiosa" => array('XYLEFA','XYLEFM','XYLEFP','XYLEFS'),
		"Xylosandrus crassiusculus" => array('XYLBCR'),

		"Dacus dorsalis" => array(
			'1DACUG','DACUBI','DACUCI','DACUFE',
			'DACUFR','DACUHA','DACUHU','DACULO',
			'DACUNE','DACUPE','DACUSP'
		),
		"Cicadella viridis" => array('TETTVI'),
		"Philaenus sp"=> array('PHILSU','PHILSP','1PHILG'),

		"Agrilus auroguttatus"=>array('AGRLGT')

	);
}
else if ($export_pest_year==2020) {
	$pests = array(
		'AGRLAX','AGRLPL','1ALECG','ALECBA','ALECCN','ALECCT','ALECCO','ALECGA',
		'ALECHU','ALECIN','ALECMA','ALECNG','ALECNI','ALECNU','ALECOB','ALECPI',
		'ALECRU','ALECSI','ALECSP','ALECSN','ALECSO','ALECWO','ALECZI','ANOLCN',
		'ANOLGL','ANTHEU','AROMBU','BURSXY','1LIBEG','LIBEAF','LIBEAM','LIBEAS',
		'LIBEPS','LIBEEU','DIAACI','TRIZER','CTV000','CORBSE','DACUDO','EPIXCA',
		'EPIXCU','EPIXDI','EPIXFA','EPIXFS','EPIXFU','EPIXPA','EPIXIN','EPIXNC',
		'EPIXNG','EPIXPI','EPIXPR','EPIXPU','EPIXSI','EPIXSP','EPIXSU','EPIXTU',
		'PITOJU','GEOHMO','1GLOBG','HETDPA','HETDRO','PHYP64','MONCAL','MONCCA','MONCCL',
		'MONCGA','MONCGP','MONCGR','MONCIM','MONCMR','MONCMC','MONCNI','MONCNO',
		'MONCNM','MONCOB','MONCOR','MONCRB','MONCRU','MONCSL','MONCSA','MONCSR',
		'MONCSC','MONCST','MONCSP','MONCSB','MONCSU','MONCTI','MONCUR','MONCVE',
		'GUIGCI','PISOAP','PISONO','PISOCE','PISODU','PISOEN','PISOFA','PISOHA',
		'PISOMU','PISONE','PISONI','PISOOB','PISOPC','PISOPN','PISOPP','PISORA',
		'PISORO','PISOSC','PISOSW','PISOSI','PISOSP','PISOST','PISOTE','PISOVA',
		'POPIJA','PSDMAK','RALSSO','PSDMS1','PSDMS2','PSDMS3','SCAPLI','SCITAU',
		'SCITBI','SCITCI','SCITCO','SCITDO','SCITLO','SCITMG','SCITMN','SCITSI',
		'SCITSP','SERTGR','SERTVA','TAETCA','1SCITG','SCITPE','SCITIN','SCITCA',
		'SCITDI','SCITBO','SYNCEN','ARGPLE','TOLCND','TOXOCI','XANTAR','XANTCA',
		'XANTCN','XANTCU','XANTCV','XANTHY','XANTIN','XANTMI','XANTOR','XANTRA',
		'XANTSE','XANTZN','XANTCS','XANTPI','XANTAL','XANTAT','XANTBE','XANTCE',
		'XANTCI','XANTCJ','XANTCM','XANTCP','XANTCR','XANTCY','XANTGL','XANTGR',
		'XANTHE','XANTHO','XANTJU','XANTMA','XANTMN','XANTNA','XANTPE','XANTPH',
		'XANTPL','XANTPR','XANTRI','XANTSC','XANTTO','XANTTR','XANTTU','XANTVA',
		'XANTVG','XANTVI','XANTDF','XANTFI','XANTGU','XANTAV','XANTAA','XANTMU',
		'XANTLO','XANTAO','XANTPU','XANTCB','XYLEFA','XYLEFM','XYLEFP','XYLEFS',
		'XYLBCR','1DACUG','DACUBI','DACUCI','DACUFE','DACUFR','DACUHA','DACUHU',
		'DACULO','DACUNE','DACUPE','DACUSP','TETTVI','PHILSU','PHILSP','1PHILG',
		'AGRLGT',
		'TOBRFV',
		'DACUZO'
	);

	$macropests = array(
		"Agrilus anxius" => array('AGRLAX'),
		"Agrilus planipennis" => array('AGRLPL'),
		"Aleurocanthus spp." => array(
			'1ALECG','ALECBA','ALECCN','ALECCT',
			'ALECCO','ALECGA','ALECHU','ALECIN',
			'ALECMA','ALECNG','ALECNI','ALECNU',
			'ALECOB','ALECPI','ALECRU','ALECSI',
			'ALECSP','ALECSN','ALECSO','ALECWO',
			'ALECZI'
		),
		"Anoplophora chinensis" => array('ANOLCN'),
		"Anoplophora glabripennis" => array('ANOLGL'),
		"Anthonomus eugenii" => array('ANTHEU'),
		"Aromia bungii" => array('AROMBU'),
		"Bursaphelenchus xylophilus" => array('BURSXY'),
		"Candidatus liberibacter spp." => array(
			'1LIBEG','LIBEAF','LIBEAM','LIBEAS',
			'LIBEPS','LIBEEU'
		),
		"Diaphorina citri" => array('DIAACI'),
		"Trioza erytreae" => array('TRIZER'),
		"Citrus tristeza virus" => array('CTV000'),
		"Clavibacter michiganense subsp. sepedonicus" => array('CORBSE'),
		"Bactrocera dorsalis" => array(
			'DACUDO',
			'1DACUG','DACUBI','DACUCI','DACUFE',
			'DACUFR','DACUHA','DACUHU','DACULO',
			'DACUNE','DACUPE','DACUSP'
		),

		"Epitrix cucumeris, Epitrix similaris, Epitrix subcritica, E. tuberis" => array(
			'EPIXAB','EPIXAL','EPIXAR','EPIXAT',
			'EPIXCA','EPIXCU','EPIXDI','EPIXFA',
			'EPIXFS','EPIXFU','EPIXPA','EPIXIN',
			'EPIXNC','EPIXNG','EPIXPI','EPIXPR',
			'EPIXPU','EPIXSI','EPIXSP','EPIXSU',
			'EPIXTU'
		),
		"Geosmithia morbida" => array('GEOHMO'),
		"Pityophtorus juglandis" => array('PITOJU'),
		"Globodera rostochiensis, Globodera pallida" => array('1GLOBG','HETDPA','HETDRO'),
		"Grapevine flavescenza doree" => array('PHYP64'),
		"Monochamus spp." => array(
			'MONCAL','MONCCA','MONCCL','MONCGA',
			'MONCGP','MONCGR','MONCIM','MONCMR',
			'MONCMC','MONCNI','MONCNO','MONCNM',
			'MONCOB','MONCOR','MONCRB','MONCRU',
			'MONCSL','MONCSA','MONCSR','MONCSC',
			'MONCST','MONCSP','MONCSB','MONCSU',
			'MONCTI','MONCUR','MONCVE'
		),
		"Phyllosticta citricarpa" => array('GUIGCI'),
		"Pissodes spp (non-European)" => array(
			'PISOAP','PISONO','PISOCE','PISODU',
			'PISOEN','PISOFA','PISOHA','PISOMU',
			'PISONE','PISONI','PISOOB','PISOPC',
			'PISOPN','PISOPP','PISORA','PISORO',
			'PISOSC','PISOSW','PISOSI','PISOSP',
			'PISOST','PISOTE','PISOVA'
		),
		"Popillia japonica" => array('POPIJA'), 
		"Pseudomonas syringae pv. actinidiae" => array('PSDMAK'),
		"Ralstonia solanacearum" => array('RALSSO','PSDMS1','PSDMS2','PSDMS3'),
		"Scaphoideus titanus" => array('SCAPLI'),
		"Scirtothrips spp." => array(
			'SCITAU','SCITBI','SCITCI','SCITCO',
			'SCITDO','SCITLO','SCITMG','SCITMN',
			'SCITSI','SCITSP','SERTGR','SERTVA',
			'TAETCA','1SCITG','SCITPE','SCITIN',
			'SCITCA','SCITDI','SCITBO'
		),
		"Synchytrium endobioticum" => array('SYNCEN'),
		"Thaumatotibia leucotreta" => array('ARGPLE'),
		"Tomato leaf curl new delhi virus" => array('TOLCND'),
		"Toxoptera citricida" => array('TOXOCI'),
		"Xanthomonas campestris" => array(
			'XANTAR','XANTCA','XANTCN','XANTCU',
			'XANTCV','XANTHY','XANTIN','XANTMI',
			'XANTOR','XANTRA','XANTSE','XANTZN',
			'XANTCS','XANTPI','XANTAL','XANTAT',
			'XANTBE','XANTCE','XANTCI','XANTCJ',
			'XANTCM','XANTCP','XANTCR','XANTCY',
			'XANTGL','XANTGR','XANTHE','XANTHO',
			'XANTJU','XANTMA','XANTMN','XANTNA',
			'XANTPE','XANTPH','XANTPL','XANTPR',
			'XANTRI','XANTSC','XANTTO','XANTTR',
			'XANTTU','XANTVA','XANTVG','XANTVI',
			'XANTDF','XANTFI','XANTGU','XANTAV',
			'XANTAA','XANTMU','XANTLO','XANTAO',
			'XANTPU','XANTCB'
		),
		"Xylella fastidiosa" => array('XYLEFA','XYLEFM','XYLEFP','XYLEFS'),
		"Xylosandrus crassiusculus" => array('XYLBCR'),

		"Cicadella viridis" => array('TETTVI'),
		"Philaenus sp"=> array('PHILSU','PHILSP','1PHILG'),

		"Agrilus auroguttatus"=>array('AGRLGT'),

		"Tomato brown rugose fruit virus"=>array('TOBRFV'),
		"Bactrocera zonata" => array('DACUZO')

	);
}

?>