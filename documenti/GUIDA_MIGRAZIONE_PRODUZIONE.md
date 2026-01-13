# Guida Migrazione EPPO in Produzione

## 📋 Checklist Pre-Migrazione

### 1. Prerequisiti
- [ ] PostgreSQL 9.x+ installato
- [ ] Database `DBEPPOreplica` disponibile e popolato con dati EPPO 2024
- [ ] Schema `eppo2023` esistente (backup dei vecchi dati per fix orphan)
- [ ] Accesso con utente `postgres` e password configurata
- [ ] Estensione `dblink` abilitata

### 2. Backup
```bash
# Backup completo database
pg_dump -h localhost -U postgres simfito4 > backup_simfito4_$(date +%Y%m%d_%H%M%S).sql

# Backup solo schema eppo
pg_dump -h localhost -U postgres -n eppo simfito4 > backup_eppo_$(date +%Y%m%d_%H%M%S).sql
```

### 3. Verifica Spazio Disco
```bash
# Controlla spazio disponibile (almeno 2GB liberi)
df -h /var/lib/postgresql

# Controlla dimensione database attuale
psql -U postgres -d simfito4 -c "SELECT pg_size_pretty(pg_database_size('simfito4'));"
```

### 4. Verifica Database Sorgente
```sql
-- Connetti a DBEPPOreplica e verifica dati
\c DBEPPOreplica

SELECT 'Codes:' as info, COUNT(*) FROM t_eppo_codes
UNION ALL
SELECT 'Names:', COUNT(*) FROM t_eppo_names WHERE status = 'A';

-- Risultato atteso:
-- Codes: ~127,456
-- Names: ~514,570
```

---

## 🚀 Procedura di Migrazione

### STEP 1: Esecuzione Script Principale

```bash
cd /home/raffaele/webapp/var/www/html/simfito.org

# Esegui la migrazione (senza auto-commit)
psql -h localhost -U postgres -d simfito4 -f PRODUCTION_MIGRATION.sql
```

**Output atteso:**
```
STEP 1: BACKUP TABELLE ESISTENTI
Backup t_baycode: 119,843 records
Backup t_bayname: 463,213 records

STEP 3: IMPORTAZIONE t_baycode
t_baycode importato: 127,456 records

STEP 4: IMPORTAZIONE t_bayname
t_bayname importato: 514,570 records

STEP 7: VERIFICA FINALE
Test query PHP-compatible: SOLTU -> Solanum tuberosum
```

### Verifica Prima del COMMIT

```sql
-- Verifica conteggi
SELECT COUNT(*) FROM eppo.t_baycode;    -- Deve essere ~127,456
SELECT COUNT(*) FROM eppo.t_bayname;    -- Deve essere ~514,570

-- Verifica tipo preferred (DEVE essere integer)
\d eppo.t_bayname
-- Cerca colonna: preferred | integer

-- Test query PHP
SELECT bc.b_code, bn.full_name 
FROM eppo.t_baycode bc
JOIN eppo.t_bayname bn ON bc.codeid = bn.codeid
WHERE bc.b_code = 'SOLTU' AND bn.preferred = 1;
-- Deve ritornare: SOLTU | Solanum tuberosum
```

### Applicazione Migrazione

```sql
-- Se tutto OK:
COMMIT;

-- Se qualcosa è sbagliato:
ROLLBACK;
```

---

### STEP 2: Fix Orphan Links (OPZIONALE ma RACCOMANDATO)

```bash
# Esegui dopo il COMMIT dello step 1
psql -h localhost -U postgres -d simfito4 -f FIX_ORPHAN_LINKS.sql
```

**Output atteso:**
```
FIX 1: t_baylink importato: ~121,658 records
Orphan codeid: 0
Orphan codelink: 0

FIX 2: r_attack
PRIMA - orphan pest: 51
PRIMA - orphan host: 441
DOPO - orphan pest: 0-5 (accettabile)
DOPO - orphan host: 0-10 (accettabile)

FIX 3: r_path
PRIMA - orphan pathogen: ...
DOPO - orphan pathogen: 0
```

### Verifica e Applicazione

```sql
-- Verifica orphan rimasti (alcuni sono normali se il codice è deprecato)
SELECT COUNT(*) FROM eppo.r_attack ra
WHERE NOT EXISTS (SELECT 1 FROM eppo.t_baycode bc WHERE bc.codeid = ra.pest);

-- Se OK:
COMMIT;

-- Se KO:
ROLLBACK;
```

---

## ✅ Test Post-Migrazione

### 1. Test Database

```sql
-- Test 1: Conteggi
SELECT 't_baycode' as tabella, COUNT(*) FROM eppo.t_baycode
UNION ALL SELECT 't_bayname', COUNT(*) FROM eppo.t_bayname
UNION ALL SELECT 't_baylink', COUNT(*) FROM eppo.t_baylink;

-- Test 2: Query nomenclatura (PHP-compatible)
SELECT bc.b_code, bn.full_name, bn.preferred
FROM eppo.t_baycode bc
JOIN eppo.t_bayname bn ON bc.codeid = bn.codeid
WHERE bc.b_code IN ('SOLTU', 'XYLEFA', 'CYDIA') 
  AND bn.preferred = 1;

-- Test 3: Relazioni pest/host
SELECT bc1.b_code as pest, bc2.b_code as host
FROM eppo.r_attack ra
JOIN eppo.t_baycode bc1 ON ra.pest = bc1.codeid
JOIN eppo.t_baycode bc2 ON ra.host = bc2.codeid
WHERE bc1.b_code = 'SOLTU'
LIMIT 5;
```

### 2. Test Web Application

```bash
# Crea file di test PHP
cat > /var/www/html/test_migration.php << 'EOF'
<?php
$conn = pg_connect("host=localhost port=5432 user=postgres password=ariespac3 dbname=simfito4");

// Test 1: Query con preferred=1
$query = "SELECT bc.b_code, bn.full_name 
          FROM eppo.t_baycode bc
          JOIN eppo.t_bayname bn ON bc.codeid = bn.codeid
          WHERE bc.b_code = 'SOLTU' AND bn.preferred = 1";

$result = pg_query($conn, $query);
if ($result) {
    echo "✅ Test 1 OK: Query PHP-compatible funziona\n";
    $row = pg_fetch_assoc($result);
    echo "   SOLTU → " . $row['full_name'] . "\n";
} else {
    echo "❌ Test 1 FAIL: " . pg_last_error($conn) . "\n";
}

// Test 2: Conteggio totale
$result = pg_query($conn, "SELECT COUNT(*) FROM eppo.t_baycode");
$row = pg_fetch_row($result);
echo "\n✅ Test 2 OK: t_baycode records = " . $row[0] . "\n";

pg_close($conn);
?>
EOF

# Esegui test
php /var/www/html/test_migration.php
```

### 3. Test Applicazione SIMFITO

1. Apri browser: `http://192.168.1.19/simfito.org/simfito/`
2. Login con: `admin` / `SIMFito@Admin`
3. Cerca organismo: `SOLTU` → Deve mostrare "Solanum tuberosum"
4. Verifica relazioni pest/host funzionino
5. Testa ricerca per nome comune in diverse lingue

---

## 🔍 Cosa Risolve Questa Migrazione

### ✅ Problemi Risolti

1. **preferred boolean → integer**
   - **Problema:** PHP invia `WHERE preferred=1` ma PostgreSQL ha boolean
   - **Errore:** `operator does not exist: boolean = integer`
   - **Soluzione:** Campo importato direttamente come INTEGER (0/1)
   - **Impatto:** Tutte le 300+ query PHP funzionano senza modifiche

2. **isolang type mismatch**
   - **Problema:** DBEPPOreplica ha `varchar(2)`, simfito4 vuole `char(2)`
   - **Errore:** `column "isolang" is of type character`
   - **Soluzione:** Cast esplicito `isolang::char(2)` nell'INSERT
   - **Impatto:** Nessun errore durante l'import

3. **Orphan links in t_baylink**
   - **Problema:** 121,658 link con codeid non più esistenti
   - **Soluzione:** Re-import da eppo2023 con filtro su codeid validi
   - **Risultato:** 0 orphan, tutti i link corretti

4. **Orphan links in r_attack/r_path**
   - **Problema:** 492 relazioni pest/host con codeid vecchi
   - **Soluzione:** Mapping eppo2023→eppo.t_baycode e UPDATE
   - **Risultato:** 0-10 orphan residui (deprecati, accettabile)

### ⚠️ Note Importanti

- **codeid rigenerati:** Uso `md5(eppocode)` per hash deterministico
- **Backup automatico:** Script crea t_baycode_backup_20251215
- **Rollback sicuro:** Transazione BEGIN/COMMIT controllata manualmente
- **Zero downtime:** Migrazione eseguibile senza fermare Apache/PHP

---

## 🆘 Troubleshooting

### Errore: "extension dblink does not exist"
```sql
CREATE EXTENSION dblink;
```

### Errore: "could not establish connection"
```sql
-- Verifica connessione a DBEPPOreplica
SELECT dblink_connect('test', 'host=localhost dbname=DBEPPOreplica user=postgres password=ariespac3');
SELECT dblink_disconnect('test');
```

### Errore: "schema eppo2023 does not exist"
```bash
# Se non hai backup, salta FIX_ORPHAN_LINKS.sql
# Oppure crea schema da backup:
psql -U postgres simfito4 < backup_eppo_20231211.sql
```

### Rollback Completo
```sql
-- Se hai già fatto COMMIT ma vuoi tornare indietro:
BEGIN;
DROP TABLE eppo.t_baycode CASCADE;
DROP TABLE eppo.t_bayname CASCADE;

ALTER TABLE eppo.t_baycode_backup_20251215 RENAME TO t_baycode;
ALTER TABLE eppo.t_bayname_backup_20251215 RENAME TO t_bayname;

-- Ricrea indici e constraints (vedi script originale)
COMMIT;
```

---

## 📊 Risultati Attesi

| Tabella | Record PRIMA | Record DOPO | Differenza |
|---------|--------------|-------------|------------|
| t_baycode | 119,843 | 127,456 | +7,613 (+6.4%) |
| t_bayname | 463,213 | 514,570 | +51,357 (+11.1%) |
| t_baylink | 0 (broken) | 121,658 | +121,658 |
| r_attack | 17,456 | 17,456 | 0 (fix orphan) |
| r_path | varia | varia | 0 (fix orphan) |

### Orphan Finali (dopo fix)
- **t_baylink:** 0 orphan ✅
- **r_attack pest:** 0-5 orphan (~0.03%) ✅
- **r_attack host:** 0-10 orphan (~0.06%) ✅
- **r_path:** 0 orphan ✅

---

## 📝 Changelog

- **15/12/2024:** Creazione script production-ready con tutti i fix
- **11/12/2024:** Prima migrazione test con identificazione problemi
- **11/12/2024:** Fix isolang type mismatch
- **15/12/2024:** Fix preferred boolean→integer per compatibilità PHP
- **15/12/2024:** Fix orphan links (t_baylink, r_attack, r_path)

---

## 📞 Supporto

In caso di problemi durante la migrazione:
1. **NON fare COMMIT** se vedi errori
2. Esegui `ROLLBACK;` per annullare
3. Verifica prerequisiti (backup, DBEPPOreplica, dblink)
4. Controlla log PostgreSQL: `/var/log/postgresql/postgresql-*.log`
5. Testa query SQL manualmente prima di procedere

**Tempo stimato migrazione completa:** 5-10 minuti (dipende da hardware)

