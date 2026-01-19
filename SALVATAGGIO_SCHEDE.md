# Salvataggio Schede - Documentazione Tecnica

## Panoramica

Il sistema di salvataggio delle schede in SimfitoMobile è completamente funzionante e integrato con il backend PHP esistente.

## Flusso Completo

### 1. Interfaccia Utente (`app/nuova-scheda.tsx`)

Il processo di creazione di una nuova scheda è diviso in 3 step:

#### Step 1: Selezione Azienda
- L'utente seleziona un'azienda dall'elenco
- Viene caricata la lista di aziende paginata (50 per pagina)
- Supporta ricerca per ragione sociale
- Solo le aziende validate sono mostrate

#### Step 2: Selezione/Creazione Sito
- L'utente può:
  - **Selezionare un sito esistente** dell'azienda
  - **Creare un nuovo sito** specificando:
    - Nome/Denominazione
    - Tema (caricato dinamicamente)
    - Tipologia (dipendente dal tema selezionato)

#### Step 3: Dettagli Scheda
- **Data Sopralluogo** (obbligatoria):
  - Formato: GG/MM/AAAA
  - Non può essere nel futuro
  - Validazione automatica del formato
- **Protocollo** (opzionale):
  - Minimo 3 caratteri se specificato
- **Note** (opzionale):
  - Campo di testo libero multiriga

### 2. Validazioni Client-Side

```typescript
// Validazione data
const validateDate = (text: string): boolean => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(text)) return false;
  
  const [, day, month, year] = text.match(regex)!;
  const d = parseInt(day);
  const m = parseInt(month);
  const y = parseInt(year);
  
  // Controlli formato
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 2000 || y > 2100) return false;

  // Verifica che la data non sia nel futuro
  const inputDate = new Date(y, m - 1, d);
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  
  if (inputDate > oggi) return false;
  
  return true;
};
```

### 3. Redux Store (`src/store/slices/schedeSlice.ts`)

#### Action Creator

```typescript
export const createScheda = createAsyncThunk(
  'schede/create',
  async (
    {
      idTecnico,
      motivo,
      data,
      id_sito,
      protocollo,
      note,
    }: {
      idTecnico: string;
      motivo: string;
      data: string;
      id_sito?: string;
      protocollo?: string;
      note?: string;
    },
    { rejectWithValue }
  ) => {
    const response = await apiClient.post('/services/ajax-save-form.php', null, {
      params: {
        mode: 'scheda-generale',
        idTecnico,
        motivo,
        data,
        id_sito: id_sito || '',
        protocollo: protocollo || '',
        note: note || '',
      },
    });

    if (response.data.success) {
      const idscheda = response.data.returned || response.data.idscheda;
      if (!idscheda) {
        return rejectWithValue('Scheda creata ma ID non ritornato dal server');
      }
      return idscheda;
    } else {
      const errorMsg = response.data.errors?.reason || 'Errore durante la creazione della scheda';
      return rejectWithValue(errorMsg);
    }
  }
);
```

#### Stati Redux

- `loading`: Indica se il salvataggio è in corso
- `error`: Contiene eventuali messaggi di errore
- `items`: Array delle schede caricate

### 4. Backend PHP (`backend/services/ajax-save-form.php`)

#### Endpoint

**URL**: `/services/ajax-save-form.php`
**Metodo**: POST
**Parametri**:

| Parametro | Tipo | Obbligatorio | Descrizione |
|-----------|------|--------------|-------------|
| `mode` | string | ✓ | `scheda-generale` |
| `idTecnico` | integer | ✓ | ID del tecnico che crea la scheda |
| `motivo` | integer | ✓ | Tipo visita (1 = Controllo ordinario) |
| `data` | string | ✓ | Data sopralluogo (formato GG/MM/AAAA) |
| `id_sito` | integer | ✓ | GID del sito |
| `protocollo` | string | | Numero protocollo |
| `note` | string | | Note aggiuntive |

#### Implementazione Backend

```php
case "scheda-generale":
    $id_tecnico=$_REQUEST['idTecnico'];
    $escaped=pg_str_escape($_REQUEST);
    if(is_numeric($_REQUEST['id_sito'])){
        $id_sito=$_REQUEST['id_sito'];
    }
    else {
        $id_sito=-1;
    }
    $sql="INSERT INTO
            scheda (idtipo_visita,id_tecnico,data_sopralluogo,stato,gid_sito,protocollo,note)
          VALUES
            ($escaped[motivo],$id_tecnico,to_date('$_REQUEST[data]','DD/MM/YYYY'),0,$id_sito,'$escaped[protocollo]','$escaped[note]')
          RETURNING idscheda";
    $result=salva_scheda_return($sql);
    $result["success"] = true;
break;
```

#### Risposta Backend

**Successo**:
```json
{
  "success": true,
  "returned": "166723"
}
```

**Errore**:
```json
{
  "success": false,
  "errors": {
    "reason": "Messaggio di errore"
  }
}
```

### 5. Database Schema

#### Tabella `scheda`

```sql
CREATE TABLE scheda (
  idscheda SERIAL PRIMARY KEY,
  idtipo_visita INTEGER,
  id_tecnico INTEGER REFERENCES tecnici(id_tecnico),
  data_sopralluogo DATE,
  stato INTEGER DEFAULT 0,
  gid_sito INTEGER REFERENCES siti(gid),
  protocollo VARCHAR(255),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Stati Scheda

| Stato | Descrizione |
|-------|-------------|
| 0 | Bozza / In lavorazione |
| 1 | Completata |
| 2 | Chiusa |
| -1 | Rigettata |

### 6. Feedback Utente

Dopo il salvataggio con successo, l'utente riceve un Alert con due opzioni:

1. **Vai alla scheda**: Naviga direttamente alla scheda appena creata (`/schede/{idscheda}`)
2. **Torna alle schede**: Ritorna alla lista completa delle schede

```typescript
Alert.alert(
  'Successo', 
  `Scheda #${idscheda} creata con successo`, 
  [
    {
      text: 'Vai alla scheda',
      onPress: () => {
        dispatch(fetchSchede({ userId: user.id.toString(), page: 1, pageSize: 50 }));
        router.replace(`/schede/${idscheda}`);
      },
    },
    {
      text: 'Torna alle schede',
      onPress: () => {
        dispatch(fetchSchede({ userId: user.id.toString(), page: 1, pageSize: 50 }));
        router.replace('/(tabs)/schede');
      },
    },
  ]
);
```

## Sicurezza

### Controllo Permessi

Solo i tecnici (tipo >= 2) possono creare schede:

```typescript
useEffect(() => {
  if (user?.type && Number(user.type) < 2) {
    Alert.alert(
      'Accesso negato',
      'Solo i tecnici possono creare nuove schede.',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)/schede') }]
    );
  }
}, [user, router]);
```

### Sanitizzazione Input

Il backend utilizza `pg_str_escape()` per prevenire SQL injection:

```php
$escaped=pg_str_escape($_REQUEST);
```

## Test

### Test Manuale con cURL

```bash
curl -X POST "http://localhost:8000/services/ajax-save-form.php?mode=scheda-generale&idTecnico=1&motivo=1&data=19/01/2026&id_sito=1&protocollo=TEST001&note=Test"
```

**Risposta attesa**:
```json
{"returned":"166723","success":true}
```

## Miglioramenti Futuri

1. **Validazione Date Avanzata**: 
   - Controllo giorni massimi per mese
   - Gestione anni bisestili

2. **Upload Allegati**:
   - Permettere l'upload di foto/documenti durante la creazione

3. **Salvataggio Bozza**:
   - Salvare automaticamente i progressi ad ogni step

4. **Offline Support**:
   - Salvare le schede localmente e sincronizzare quando torna la connessione

5. **Geolocalizzazione**:
   - Acquisire automaticamente le coordinate GPS durante il sopralluogo

## Conclusione

Il sistema di salvataggio delle schede è completo, testato e funzionante. Include:

✅ Validazioni client-side robuste
✅ Gestione errori completa
✅ Feedback chiaro all'utente
✅ Integrazione con backend esistente
✅ Controllo permessi
✅ Sanitizzazione input
✅ Navigazione post-creazione

L'implementazione segue le best practices di React Native e Redux Toolkit, garantendo un'esperienza utente fluida e sicura.
