# Implementazione Dettaglio Osservazioni

## 📋 Panoramica

È stata implementata la schermata di dettaglio delle osservazioni, che permette di inserire e modificare tutte le informazioni relative a un'osservazione già creata. **La modifica è possibile solo per schede NON confermate (stato = 0)**.

## 🎯 Funzionalità Implementate

### 1. Schermata Dettaglio Osservazione (`app/osservazioni/[id].tsx`)

La nuova schermata permette di gestire i seguenti campi:

#### Informazioni Base
- **Parassita Presente**: Dropdown con 3 opzioni (Non presente, Presente, Da verificare)
- **Tipologia Controllata**: Dropdown caricato dinamicamente dal database
- **Fase Fenologica**: **DROPDOWN + CAMPO TESTO**
  - Switch per scegliere tra selezione da lista o inserimento manuale
  - Le fasi fenologiche sono caricate in base all'host (pianta ospite) dell'osservazione
  - Se selezionata da dropdown, viene salvato l'ID della fase
  - Se inserita manualmente, viene salvato solo il testo

#### Superficie
- **Superficie Totale sito [m²]**: Campo numerico
- **Superficie controllata [m²]**: Campo numerico

#### Unità
- **Unità totali**: Campo numerico
- **Unità controllate**: Campo numerico

#### Peso
- **Peso totale [kg]**: Campo decimale
- **Peso controllato [kg]**: Campo decimale

#### Lotti
- **Lotti totali**: Campo numerico
- **Lotti controllati**: Campo numerico
- **Lotti campione**: Campo numerico

#### Infestazione
- **Superficie Infestata [m²]**: Campo numerico
- **N. Piante Infestate**: Campo numerico
- **Numero piante abbattute**: Campo numerico

#### Serie Campione
- **Serie campione**: Switch on/off
- **Elementi della serie**: Campo testo multilinea (visibile solo se serie campione attiva)
- **Tipo serie campione**: Campo testo (visibile solo se serie campione attiva)

### 2. Controllo Stato Scheda

#### Logica di Modifica
- ✅ **Scheda NON confermata (stato = 0)**: Tutti i campi sono modificabili
- ❌ **Scheda confermata (stato = 2 o -1)**: Tutti i campi sono in sola lettura

#### Indicatori Visivi
- Alert giallo visibile quando la scheda è confermata
- Pulsante "Salva" nascosto se la scheda è confermata
- Tutti i TextInput hanno `editable={canEdit}`
- Tutti i Picker hanno `enabled={canEdit}`
- Tutti gli Switch hanno `disabled={!canEdit}`

## 🔌 Endpoint Backend

### Endpoint Aggiunti

#### `GET /services/ajax.php?mode=tipologiacontrollata`
Restituisce la lista di tutte le tipologie controllate disponibili.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "descrizione": "Descrizione tipologia"
    }
  ]
}
```

#### `GET /services/ajax.php?mode=fasifenologiche&idobs=123`
Restituisce le fasi fenologiche in base all'host dell'osservazione.

**Logica:**
1. Recupera l'hostcode dall'osservazione (ID)
2. Trova il gruppo fenologico (fenogruppo) dall'host nella tabella `tipo_fenologico`
3. Carica le fasi fenologiche per quel gruppo dalla tabella `fasi_fenologiche`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_fase_fenologica": 1,
      "fase_fenologica": "Frutti completamente sviluppati",
      "info": "BBCH 89"
    }
  ]
}
```

### Endpoint Esistenti Utilizzati

#### `POST /services/ajax-save-form.php` (mode=obsupdate_new)
Salva i dettagli di un'osservazione.

**Parametri aggiornati:**
- `idosservazioni`: ID dell'osservazione
- `idscheda`: ID della scheda
- `rilevato`: 0=non presente, 1=presente, 2=da verificare
- `tipologia_id`: ID della tipologia controllata
- `fase_fenologica`: Descrizione testuale della fase (può essere custom o da dropdown)
- `id_fase_fenologica`: ID della fase (0 se custom, altrimenti ID dalla tabella)
- ... (altri campi come prima)

## 🔗 Navigazione

### Da OsservazioniList
Quando l'utente clicca su un'osservazione dalla lista, viene navigato a:
```
/osservazioni/[id]?idscheda=X&statoScheda=0
```

### Parametri di Route
- `id`: ID dell'osservazione (dynamic route)
- `idscheda`: ID della scheda (query param)
- `statoScheda`: Stato della scheda (0=in attesa, 2/-1=confermata) (query param)

## 🔒 Sicurezza e Validazione

### Lato Client
- I campi sono disabilitati se `statoScheda !== 0`
- Il pulsante salva è nascosto se la scheda è confermata
- Alert visivo per informare l'utente

### Lato Server
Il backend **dovrebbe verificare** lo stato della scheda prima di permettere modifiche (da implementare se non presente).

## 📦 Dipendenze Aggiunte

- `@react-native-picker/picker`: ^2.x.x - Per i dropdown/select

## 🎨 UI/UX

### Layout
- **Header**: Mostra ospite e parassita dell'osservazione
- **Alert**: Banner giallo se scheda confermata (sola lettura)
- **Sezioni**: Ogni gruppo di campi è in una card separata
- **Save Button**: Icona checkmark nell'header (nascosta se read-only)
- **Loading States**: ActivityIndicator durante il caricamento e il salvataggio
- **Tema**: Supporto completo per dark/light mode

### Validazione
- I campi numerici accettano solo numeri
- I campi decimali (peso) usano `keyboardType="decimal-pad"`
- I valori vuoti vengono gestiti correttamente nel backend
- I campi sono disabilitati se la scheda è confermata

## 🔄 Flusso di Lavoro

1. L'utente crea un'osservazione (host + pest)
2. L'osservazione viene salvata nel database
3. L'utente clicca sull'osservazione dalla lista
4. Si apre la schermata di dettaglio con i dati già salvati
5. **Se la scheda è in attesa (stato=0):**
   - L'utente può compilare/modificare i campi
   - Può scegliere la fase fenologica da dropdown o inserirla manualmente
   - Salva premendo l'icona checkmark
   - I dati vengono inviati al backend con `obsupdate_new`
6. **Se la scheda è confermata (stato≠0):**
   - Appare un alert giallo "Scheda confermata"
   - Tutti i campi sono in sola lettura
   - Il pulsante salva è nascosto
7. La schermata ritorna alla lista osservazioni aggiornata

## 📝 Note Tecniche

### Gestione Fase Fenologica
La fase fenologica è un campo **ibrido**:
- Nel database: 2 campi (`fase_fenologica` TEXT e `id_fase_fenologica` INT)
- Nell'UI: Switch per scegliere modalità + Dropdown o TextInput
- Le fasi disponibili dipendono dall'host (pianta) dell'osservazione
- Logica: host → fenogruppo (da `tipo_fenologico`) → fasi (da `fasi_fenologiche`)

### Gestione Campi Null
Nel backend, i campi vengono gestiti con `nullif()` per PostgreSQL:
```php
unita=nullif('$_REQUEST[unit_tot]','')::integer
```

Questo converte stringhe vuote in NULL nel database.

### Transazioni
Il salvataggio usa transazioni PostgreSQL per garantire coerenza:
```php
$db->SQLReturn('BEGIN');
// ... operazioni ...
$db->SQLReturn('COMMIT');
```

## ✅ Testing

### Test Manuale
1. ✅ Navigazione da lista a dettaglio
2. ✅ Caricamento dati esistenti
3. ✅ Modifica campi (scheda in attesa)
4. ✅ Verifica read-only (scheda confermata)
5. ✅ Fase fenologica dropdown + custom
6. ✅ Salvataggio
7. ✅ Gestione errori
8. ✅ Dark/Light theme
9. ✅ Validazione campi numerici

### Casi di Test
- ✅ Scheda stato 0 → campi modificabili
- ✅ Scheda stato 2 → campi read-only + alert
- ✅ Fase fenologica da dropdown → salva ID + testo
- ✅ Fase fenologica custom → salva solo testo

---

**Ultima modifica**: 20 gennaio 2026  
**Autore**: GitHub Copilot
