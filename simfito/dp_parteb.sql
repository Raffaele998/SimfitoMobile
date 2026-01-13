ALTER TABLE simfito.osservazioni
    ADD COLUMN trappole_geometry_id integer DEFAULT null;

ALTER TABLE simfito.osservazioni
    ADD COLUMN visiva boolean;

ALTER TABLE simfito.osservazioni
    ADD COLUMN catture integer;

UPDATE simfito.osservazioni set visiva=true;

ALTER TABLE simfito.osservazioni
	ALTER COLUMN visiva SET DEFAULT true;

ALTER TABLE simfito.osservazioni
    ADD COLUMN cambioferomone boolean;

ALTER TABLE simfito.trappole_geometry
    ADD COLUMN scheda_id integer,
	ADD COLUMN host character varying,
	ADD COLUMN suprap numeric, 
	ADD COLUMN suptot numeric,
	ADD COLUMN unitrap numeric;
	
ALTER TABLE simfitolab.analisys
	ADD COLUMN metodo character varying;

CREATE TABLE IF NOT EXISTS simfito.areas
(
    id serial NOT NULL,
    params json,
    anno integer,
    enabled boolean DEFAULT true,
    CONSTRAINT areas_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE simfito.areas
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS simfitolab.partanalyzed
(
    id serial NOT NULL,
    descrizione character varying COLLATE pg_catalog."default",
    description character varying COLLATE pg_catalog."default",
    enabled boolean DEFAULT true,
    CONSTRAINT part_analyzed_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE simfitolab.partanalyzed
    OWNER to postgres;

ALTER TABLE simfitolab.analisys
	ADD COLUMN partanalyzed_id integer

INSERT INTO simfitolab.partanalyzed (descrizione, description, enabled)
	select distinct analyzedpart, analyzedpart, false
	from simfitolab.analisys 
	where analyzedpart is not null
	order by analyzedpart;

update simfitolab.analisys set partanalyzed_id= (select id from simfitolab.partanalyzed where analisys.analyzedpart=partanalyzed.descrizione);

insert into simfitolab.partanalyzed (description, descrizione)
values 
    ('Fruit','Frutto'),
    ('Insect - adult','Insetto - Adulto'),
    ('Insect - larvae','Insetto - Larva'),
    ('Insect - pupe/crisalid','Insetto - Pupa/Crisalide'),
    ('Leaf','Foglia'),
    ('Mixed sample','Campione misto'),
    ('Plant','Pianta intera'),
    ('Plant for planting','Piantina da vivaio'),
    ('Root','Radice'),
    ('Sawdust','Segatura'),
    ('Seeds','Semi'),
    ('Shoot','Germoglio'),
    ('Soil and root sample','Campione di suolo e radice'),
    ('Soil sample','Campione di suolo'),
    ('Trap','Trappola'),
    ('Tubers','Tuberi'),
    ('Water','Acqua'),
    ('Wood packing','Legno da imballaggio'),
    ('Other - specify in Note','Altro - Specificare nelle note');

-- Table: simfito.pest_priority

-- DROP TABLE IF EXISTS simfito.pest_priority;

CREATE TABLE IF NOT EXISTS simfito.pest_priority
(
    id SERIAL,
    baycode character varying COLLATE pg_catalog."default" NOT NULL,
    priority character varying COLLATE pg_catalog."default",
    CONSTRAINT pest_priority_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS simfito.pest_priority
    OWNER to postgres;

INSERT INTO simfito.pest_priority (baycode,priority)
values ('1LIBEG', 'Priorità 1'),
('LIBEAF', 'Priorità 1'),
('LIBEAM', 'Priorità 1'),
('LIBEAS', 'Priorità 1'),
('CORBSE', 'Priorità 2'),
('ERWIAM', 'N.D.'),
('ERWIST', 'Priorità 3'),
('PSDMAK', 'N.D.'),
('RALSPS', 'Priorità 3'),
('RALSSL','Priorità 2'),
('XANTAU', 'Priorità 3'),
('XANTCI', 'Priorità 3'),
('XYLEFA', 'Priorità 1'),
('CRSPAN', 'Priorità 3'),
('CERAFP', 'Priorità 2'),
('ELSIAU', 'Priorità 3'),
('ELSICI', 'Priorità 3'),
('ELSIFA', 'Priorità 3'),
('GIBBCI', 'Priorità 2'),
('GEOHMO', 'Priorità 2'),
('GUIGCI', 'Priorità 1'),
('PHYTRA', 'Priorità 3'),
('DEUTTR', 'N.D.'),
('SYNCEN', 'Priorità 2'),
('THPHSO', 'Priorità 3'),
('NEOVIN', 'Priorità 3'),
('PHILSU', 'Priorità 2'),
('NUMOPI', 'Priorità 3'),
('AGRLAX', 'Priorità 1'),
('AGRLPL', 'Priorità 1'),
('ALECSN', 'Priorità 2'),
('ANMLOR', 'Priorità 3'),
('ANOLCN', 'Priorità 1'),
('ANOLGL', 'Priorità 1'),
('ANTHEU', 'Priorità 1'),
('TACYQU', 'Priorità 3'),
('AROMBU', 'Priorità 1'),
('PARZCO', 'Priorità 2'),
('CARHDI', 'N.D.'),
('1CICDF', 'Priorità 3'),
('CARNFU', 'Priorità 3'),
('DRAEMI', 'Priorità 3'),
('GRCPAT', 'Priorità 3'),
('HOMLTR', 'Priorità 3'),
('CONHNE', 'Priorità 1'),
('DACLPI', 'Priorità 4'),
('CRYBGN', 'N.D.'),
('DENDSI', 'Priorità 1'),
('DIAACI', 'Priorità 3'),
('EOTELE', 'Priorità 3'),
('EPIXCU', 'Priorità 2'),
('EPIXPP', 'Priorità 2'),
('EPIXSU',  'Priorità 2'),
('EPIXTU', 'Priorità 2'),
('ERSHMU', 'Priorità 4'),
('LASPMO', 'N.D.'),
('HALYHA', 'N.D.'),
('MATSFE', 'N.D.'),
('PLTPMU', 'N.D.'),
('1MONCG', 'Priorità 3'),
('PISOFA', 'Priorità 3'),
('PISONE', 'Priorità 3'),
('PISONI', 'Priorità 3'),
('PISOPU', 'Priorità 3'),
('PISOST', 'Priorità 3'),
('PISOTE', 'Priorità 3'),
('PISOYU', 'Priorità 3'),
('PITOJU', 'Priorità 2'),
('POLGPR', 'Priorità 3'),
('POPIJA', 'Priorità 1'),
('SCAPLI', 'Priorità 2'),
('SCITAU', 'Priorità 3'),
('SCITCI', 'Priorità 3'),
('LAPHFR', 'Priorità 1'),
('TECASO', 'Priorità 3'),
('1TEPHF', 'Priorità 1'),
('ANSTLU', 'Priorità 1'),
('DACUZO', 'Priorità 1'),
('DACUDO', 'Priorità 1'),
('RHAGPO', 'Priorità 1'),
('ARGPLE', 'Priorità 1'),
('THAUPI', 'N.D.'),
('TOUMPA', 'N.D.'),
('TOXOCI', 'Priorità 2'),
('TRIZER', 'Priorità 2'),
('TROGGA', 'N.D.'),
('PHYCFR', 'Priorità 2'),
('1POMAG', 'Priorità 2'),
('POMASP', 'Priorità 2'),
('BURSXY', 'Priorità 1'),
('DITYDE', 'N.D.'),
('DITYDI', 'N.D.'),
('HETDPA', 'Priorità 2'),
('HETDRO', 'Priorità 2'),
('MELGCH', 'Priorità 2'),
('MELGFA', 'Priorità 2'),
('MELGGC', 'Priorità 2'),
('PHYPMA', 'N.D.'),
('CSNV00', 'Priorità 3'),
('CTV000', 'Priorità 3'),
('CTV000', 'Priorità 3'),
('PHYP64', 'Priorità 2'),
('GRBAV0','Priorità 3'),
('GINV00','Priorità 3'),
('GGVA00','Priorità 3'),
('PPV000', 'N.D.'),
('RRV000', 'Priorità 2'),
('TOBRFV', 'Priorità 2'),
('TOCHV0', 'Priorità 3'),
('TOLCND', 'Priorità 2'),
('TOANV0', 'Priorità 3'),
('TRSV00', 'Priorità 3'),
('CRLV00', 'Priorità 3'),
('PRMV00', 'Priorità 3'),
('RLCV00', 'Priorità 3'),
('APLPV0', 'Priorità 3'),
('BLMOV0', 'Priorità 3'),
('PCMV00', 'Priorità 3'),
('SYWB00', 'Priorità 3');

ALTER TABLE simfitolab.reportdetail
	ADD COLUMN statocampione character varying DEFAULT null;