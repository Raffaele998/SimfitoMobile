# 🏢 Come Vengono Caricate AZIENDE e TRAPPOLE - SIMFITO

**Data:** 12 Gennaio 2026  
**Database:** simfito4 (schema simfito)  
**File:** simfito/services/ajax.php

---

## 🏢 AZIENDE - Caricamento

### 1. Endpoint AJAX: `case "azienda"`

**Linea:** ajax.php:1146  
**Trigger:** Quando viene cercata un'azienda per partita IVA

```php
case "azienda":
    $sql="SELECT * FROM azienda WHERE partita_iva=$_REQUEST[piva]";
    readJson($sql);
```

### 2. Struttura Tabella `simfito.azienda`

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| **id_azienda** | INTEGER PK | ID univoco azienda |
| **partita_iva** | VARCHAR | Partita IVA (identificativo unico) |
| **rag_soc** | VARCHAR(250) | Ragione sociale |
| **rup** | BOOLEAN | Responsabile Unico di Procedimento |
| **vivaio** | BOOLEAN | Flag vivaio |
| **istat_comune** | CHAR(5) | Codice ISTAT comune |
| **localita** | VARCHAR(250) | Località |
| **indirizzo** | VARCHAR(250) | Indirizzo |
| **cap** | CHAR(5) | CAP |
| **stato** | INTEGER | Stato (default 0) |
| **fito** | BOOLEAN | Flag fitosanitario |
| **referente** | VARCHAR | Nome referente |
| **posizione_ref** | VARCHAR | Posizione referente |
| **telefono** | VARCHAR | Numero telefono |
| **fax** | VARCHAR | Numero fax |
| **email** | VARCHAR | Email contatto |
| **id_tecnico** | INTEGER | FK a tecnici (responsabile) |

**Totale record:** Circa 400-500 aziende storiche

### 3. Query Principali per Aziende

**Listar tutte le aziende (non eliminate):**
```sql
SELECT id_azienda, rag_soc, partita_iva, email, telefono
FROM simfito.azienda
WHERE stato = 0
ORDER BY rag_soc;
```

**Cercare per partita IVA:**
```sql
SELECT * FROM simfito.azienda
WHERE partita_iva = '01234567890';
```

**Con tipo azienda (relazione many-to-many):**
```sql
SELECT 
    a.id_azienda,
    a.rag_soc,
    a.partita_iva,
    STRING_AGG(ta.descrizione, ', ') as tipi
FROM simfito.azienda a
LEFT JOIN simfito.azienda_tipoazienda ata ON a.id_azienda = ata.azienda_id
LEFT JOIN simfito.tipoazienda ta ON ata.tipoazienda_id = ta.id
WHERE a.stato = 0
GROUP BY a.id_azienda, a.rag_soc, a.partita_iva
ORDER BY a.rag_soc;
```

---

## 🪤 TRAPPOLE - Caricamento

### 1. Endpoint AJAX: `case "trappole"`

**Linea:** ajax.php:2335  
**Trigger:** Quando viene caricata una scheda di osservazione  
**Parametri:** `gid` (GID sito), `idosservazione` (ID osservazione)

```php
case "trappole":
    $sql="WITH a AS (
        SELECT trappole.id, trappole_geometry_id, numero_individui, n_piante_rap, id_osservazione, note
        FROM simfito.trappole
        WHERE id_osservazione='$_REQUEST[idosservazione]'
    ), b AS (
        SELECT trappole_geometry.id, tipo_trappole_id AS id_tipo, codice, tipo_trappole.descrizione, nome, datacreazione
        FROM simfito.trappole_geometry
        INNER JOIN simfito.tipo_trappole ON trappole_geometry.tipo_trappole_id=tipo_trappole.id
        WHERE gid='$_REQUEST[gid]' AND statotrappole_id=0
    ), c as (
        select scheda.data_sopralluogo
        from simfito.scheda
        inner join simfito.osservazioni on scheda.idscheda=osservazioni.idscheda
        where idosservazioni='$_REQUEST[idosservazione]'
    )
    SELECT coalesce(a.id,-1) AS idtrp , b.id as t_g_id, id_tipo, codice, numero_individui, tipo_trappole.descrizione, n_piante_rap,
            coalesce(id_osservazione, -1) as id_osservazione, note, b.nome as nome,b.datacreazione, c.data_sopralluogo
    FROM b
    natural join c
    LEFT JOIN a ON a.trappole_geometry_id=b.id
    INNER JOIN simfito.tipo_trappole ON b.id_tipo=tipo_trappole.id
    where datacreazione<=data_sopralluogo";
    readJson2($sql);
```

### 2. Struttura Tabella `simfito.trappole_geometry`

**Tabella Master - Definisce la POSIZIONE geografica delle trappole**

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| **id** | INTEGER PK | ID univoco geometria trappola |
| **codice** | VARCHAR | Codice univoco trappola |
| **the_geom** | GEOMETRY(Point,4326) | Coordinate geografiche (PostGIS) |
| **gid** | INTEGER | FK a siti (GID del sito) |
| **tipo_trappole_id** | INTEGER | FK tipo_trappole (es: cromotropica, falsa falena) |
| **statotrappole_id** | INTEGER | Stato (0=attiva, altro=rimossa/obsoleta) |
| **datacreazione** | TIMESTAMP | Data creazione trappola |
| **datavariazione** | TIMESTAMP | Data ultima modifica |
| **nome** | VARCHAR | Nome descrittivo |
| **anno** | INTEGER | Anno di installazione |
| **organismo** | VARCHAR | Organismo monitorato |
| **host** | VARCHAR | Pianta ospite |
| **tecnico_id** | INTEGER | FK tecnici (chi ha piazzato) |
| **tecnicorimozione_id** | INTEGER | FK tecnici (chi ha rimosso) |
| **tempo** | INTEGER | Intervallo controllo (giorni) |
| **tempo_rimozione** | INTEGER | Data rimozione programmata |
| **autorimossa** | BOOLEAN | Flag rimosso da sito |
| **scheda_id** | INTEGER | FK scheda creazione |
| **rimozionescheda_id** | INTEGER | FK scheda rimozione |
| **suprap** | NUMERIC | Superficie rapida |
| **suptot** | NUMERIC | Superficie totale |
| **unitrap** | NUMERIC | Unità trappole |

**Indici:** 18+ indici per performance (PostGIS, datacreazione, gid, etc.)

### 3. Struttura Tabella `simfito.trappole`

**Tabella Detail - Dati di OSSERVAZIONE per la trappola**

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| **id** | INTEGER PK | ID univoco osservazione trappola |
| **trappole_geometry_id** | INTEGER | FK trappole_geometry |
| **id_osservazione** | INTEGER | FK osservazioni (legame a scheda) |
| **numero_individui** | INTEGER | Numero individui catturati |
| **n_piante_rap** | REAL | N. piante rapide controllate |
| **id_tipo** | INTEGER | Tipo cattura |
| **note** | TEXT | Note osservatori |
| **codice** | VARCHAR | Codice trappola (reference) |
| **siti_gid** | INTEGER | GID sito (reference) |

### 4. Relazioni Fondamentali

```
OSSERVAZIONI (scheda di sopralluogo)
    ├─ TRAPPOLE (dati catture per trappola)
    │   └─ TRAPPOLE_GEOMETRY (posizione geografica)
    │       ├─ TIPO_TRAPPOLE (tipo: cromotropica, etc.)
    │       └─ SITI (GID sito dove piazzare)
    └─ SITI (appezzamento/sito sorvegliato)
        └─ AZIENDA (azienda proprietaria sito)
```

### 5. Flusso Caricamento Trappole

**Step 1: Selezionare SITO (gid)**
- Sito = appezzamento dentro azienda
- Ha posizione geografica (GID)

**Step 2: Selezionare OSSERVAZIONE (idosservazione)**
- Osservazione = sopralluogo in una data
- Collega trappole a quel sopralluogo

**Step 3: Carica TRAPPOLE_GEOMETRY**
```sql
-- Tutte le trappole in quel sito
SELECT * FROM trappole_geometry
WHERE gid = 12345
  AND statotrappole_id = 0  -- Solo attive
  AND datacreazione <= data_sopralluogo
```

**Step 4: JOIN con TRAPPOLE**
```sql
-- Osservazioni per quella trappola in quel sopralluogo
SELECT * FROM trappole
WHERE trappole_geometry_id = 9999
  AND id_osservazione = 555
```

**Step 5: Risultato Finale**
- Trappola con posizione geografica
- Con numero individui catturati
- Con tipo trappola
- Con data creazione vs data sopralluogo (validazione)

### 6. Vantaggi della Struttura

✅ **Separazione dati:**
- `trappole_geometry` = COSA e DOVE (permanente)
- `trappole` = QUANDO e QUANTO (temporale per osservazione)

✅ **Storico completo:**
- Si sa quando ogni trappola è stata piazzata/rimossa
- Si mantiene storia di tutte le osservazioni

✅ **Georeferenziazione:**
- Uso di PostGIS `geometry(Point,4326)` per coordinate precise
- Indice GIST per query geografiche veloci

✅ **Validazione automatica:**
- Data creazione trappola <= data sopralluogo
- Evita osservazioni su trappole non ancora piazzate

---

## 📊 Statistiche Attuali

```sql
SELECT 
    (SELECT COUNT(*) FROM simfito.azienda WHERE stato=0) as aziende_attive,
    (SELECT COUNT(*) FROM simfito.trappole_geometry WHERE statotrappole_id=0) as trappole_attive,
    (SELECT COUNT(*) FROM simfito.trappole) as osservazioni_trappole_totali,
    (SELECT COUNT(*) FROM simfito.siti) as siti_monitorati;
```

---

## 🔄 Flusso Dati Completo

```
1. UTENTE accede a SIMFITO
2. Sceglie AZIENDA (partita_iva)
3. Sceglie SITO dentro azienda (gid)
4. Sceglie DATA SOPRALLUOGO (osservazione)
5. Sistema carica TRAPPOLE_GEOMETRY per quel sito
6. Per ogni trappola, carica TRAPPOLE con dati catture
7. Mostra su mappa le trappole con numero individui
8. Utente registra osservazioni (numero catture, note)
9. Dati salvati in TRAPPOLE e OSSERVAZIONI
```

---

## ⚠️ Problemi Comuni

**Trappole non appaiono:**
- Verificare `statotrappole_id = 0`
- Verificare `datacreazione <= data_sopralluogo`
- Verificare `gid` corretto

**Azienda non si carica:**
- Verificare partita_iva nel formato esatto
- Verificare `stato = 0` (non eliminata)

**Coordinate sbagliate:**
- Check SRID 4326 (WGS84)
- Transformare a 3857 per web Mercator

---

**Ultimo aggiornamento:** 12 Gennaio 2026  
**Database:** simfito4  
**EPPO Update:** Dati EPPO 2024 in DBEPPOreplica
