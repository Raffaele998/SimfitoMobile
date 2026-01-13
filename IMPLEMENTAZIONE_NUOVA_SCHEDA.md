# Implementazione Creazione Nuova Scheda

## Stato Implementazione: 90% Completato ✅

### Componenti Implementati

#### 1. API Services (100% ✅)
- **`src/services/api/aziende.ts`**
  - `checkAzienda()` - Verifica esistenza azienda per partita IVA
  - `createAzienda()` - Crea nuova azienda
  - `getAziende()` - Ottiene lista aziende

- **`src/services/api/siti.ts`**
  - `getSiti()` - Ottiene siti per azienda
  - `createSito()` - Crea nuovo sito con geometria di default
  - `getAllSiti()` - Ottiene tutti i siti

#### 2. Redux Slices (100% ✅)
- **`src/store/slices/aziendeSlice.ts`**
  - `verifyOrCreateAzienda()` - Verifica/crea azienda in un'unica azione
  - `fetchAzienda()` - Carica dati azienda
  - State management completo

- **`src/store/slices/sitiSlice.ts`** (aggiornato)
  - `fetchSitiByAzienda()` - Carica siti per azienda
  - `createSito()` - Crea nuovo sito
  - State management completo

#### 3. Logica Backend in nuova-scheda.tsx (100% ✅)
- Import di tutti i reducer necessari
- State management per azienda, sito, tema, tipologia
- Funzione `handleNextStep()` completa con:
  - Step 1: Verifica/creazione azienda
  - Step 2: Creazione/selezione sito
  - Loading states e error handling
- Funzione `handleSubmit()` aggiornata per usare il gid del sito
- Aggiunta campo Ragione Sociale nello Step 1

#### 4. Stili CSS (100% ✅)
- `toggleContainer` - Container per toggle seleziona/crea sito
- `toggleButton` - Bottone toggle
- `toggleButtonText` - Testo bottone toggle

### Modifiche UI Rimanenti (10% mancante)

#### Step 2: Interfaccia Selezione/Creazione Sito

Devi sostituire lo Step 2 esistente (righe ~330-415 in `app/nuova-scheda.tsx`) con il seguente codice:

```tsx
{/* Step 2: Sito */}
{step === 2 && (
  <View>
    {/* Toggle tra seleziona/crea */}
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor: sitoMode === 'select' ? tintColor : (isDark ? '#2a2a2a' : '#f5f5f5'),
            borderColor: isDark ? '#444' : '#ddd',
          },
        ]}
        onPress={() => setSitoMode('select')}
      >
        <Text
          style={[
            styles.toggleButtonText,
            { color: sitoMode === 'select' ? '#fff' : textColor },
          ]}
        >
          Seleziona Sito
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor: sitoMode === 'create' ? tintColor : (isDark ? '#2a2a2a' : '#f5f5f5'),
            borderColor: isDark ? '#444' : '#ddd',
          },
        ]}
        onPress={() => setSitoMode('create')}
      >
        <Text
          style={[
            styles.toggleButtonText,
            { color: sitoMode === 'create' ? '#fff' : textColor },
          ]}
        >
          Nuovo Sito
        </Text>
      </TouchableOpacity>
    </View>

    {sitoMode === 'select' ? (
      <View style={styles.field}>
        <Text style={[styles.label, { color: textColor }]}>Sito *</Text>
        <TouchableOpacity
          style={[
            styles.selectButton,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
              borderColor: isDark ? '#444' : '#ddd',
            },
          ]}
          onPress={() => setShowSitiModal(true)}
          disabled={loadingSiti || siti.length === 0}
        >
          {loadingSiti ? (
            <ActivityIndicator color={tintColor} />
          ) : (
            <>
              <Text
                style={[
                  styles.selectText,
                  { color: selectedSito ? textColor : (isDark ? '#666' : '#999') },
                ]}
              >
                {selectedSito
                  ? siti.find((s: any) => s.id === selectedSito || s.gid === selectedSito)?.denominazione || 'Sito selezionato'
                  : siti.length > 0
                  ? 'Seleziona sito...'
                  : 'Nessun sito disponibile'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={tintColor} />
            </>
          )}
        </TouchableOpacity>
        {siti.length === 0 && !loadingSiti && (
          <Text style={[styles.helpText, { color: isDark ? '#666' : '#999' }]}>
            Nessun sito trovato per questa azienda. Crea un nuovo sito.
          </Text>
        )}
      </View>
    ) : (
      <>
        <View style={styles.field}>
          <Text style={[styles.label, { color: textColor }]}>Nome Sito *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                borderColor: isDark ? '#444' : '#ddd',
                color: textColor,
              },
            ]}
            value={nomeSito}
            onChangeText={setNomeSito}
            placeholder="Inserisci nome sito"
            placeholderTextColor={isDark ? '#666' : '#999'}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: textColor }]}>Tema *</Text>
          <TouchableOpacity
            style={[
              styles.selectButton,
              {
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                borderColor: isDark ? '#444' : '#ddd',
              },
            ]}
            onPress={() => setShowThemesModal(true)}
            disabled={loadingThemes}
          >
            {loadingThemes ? (
              <ActivityIndicator color={tintColor} />
            ) : (
              <>
                <Text
                  style={[
                    styles.selectText,
                    { color: selectedThemeLabel ? textColor : (isDark ? '#666' : '#999') },
                  ]}
                >
                  {selectedThemeLabel || 'Seleziona tema...'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={tintColor} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: textColor }]}>Tipologia Sito *</Text>
          <TouchableOpacity
            style={[
              styles.selectButton,
              {
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                borderColor: isDark ? '#444' : '#ddd',
              },
            ]}
            onPress={() => setShowTipologieModal(true)}
            disabled={!selectedTheme || loadingTipologie}
          >
            {loadingTipologie ? (
              <ActivityIndicator color={tintColor} />
            ) : (
              <>
                <Text
                  style={[
                    styles.selectText,
                    { color: selectedTipologiaLabel ? textColor : (isDark ? '#666' : '#999') },
                  ]}
                >
                  {selectedTipologiaLabel || 'Seleziona tipologia...'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={tintColor} />
              </>
            )}
          </TouchableOpacity>
          {!selectedTheme && (
            <Text style={[styles.helpText, { color: isDark ? '#666' : '#999' }]}>
              Seleziona prima un tema
            </Text>
          )}
        </View>
      </>
    )}

    <View style={styles.buttonRow}>
      <TouchableOpacity
        style={[styles.backButton, { borderColor: isDark ? '#444' : '#ddd' }]}
        onPress={() => setStep(1)}
      >
        <MaterialIcons name="arrow-back" size={20} color={textColor} />
        <Text style={[styles.backButtonText, { color: textColor }]}>Indietro</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: tintColor, flex: 1 }]}
        onPress={handleNextStep}
        disabled={loadingSiti}
      >
        {loadingSiti ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.nextButtonText}>Avanti</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </View>
  </View>
)}
```

#### Aggiungere Modal Selezione Siti

Dopo il modal per le tipologie (alla fine del file, prima della chiusura di `</View>`), aggiungi:

```tsx
{/* Modal per selezione siti */}
<Modal
  visible={showSitiModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowSitiModal(false)}
>
  <View style={styles.modalOverlay}>
    <View
      style={[
        styles.modalContent,
        { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
      ]}
    >
      <View
        style={[
          styles.modalHeader,
          { borderBottomColor: isDark ? '#333' : '#eee' },
        ]}
      >
        <Text style={[styles.modalTitle, { color: textColor }]}>
          Seleziona Sito
        </Text>
        <TouchableOpacity onPress={() => setShowSitiModal(false)}>
          <MaterialIcons name="close" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={siti}
        keyExtractor={(item: any) => (item.id || item.gid).toString()}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={[
              styles.modalItem,
              {
                backgroundColor:
                  selectedSito === item.id || selectedSito === item.gid
                    ? (isDark ? '#2a2a2a' : '#f0f0f0')
                    : 'transparent',
                borderBottomColor: isDark ? '#333' : '#eee',
              },
            ]}
            onPress={() => {
              setSelectedSito(item.id || item.gid);
              setShowSitiModal(false);
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalItemText, { color: textColor }]}>
                {item.denominazione || item.denominaz}
              </Text>
              {item.comune && (
                <Text style={{ fontSize: 12, color: isDark ? '#999' : '#666', marginTop: 4 }}>
                  {item.comune}
                </Text>
              )}
            </View>
            {(selectedSito === item.id || selectedSito === item.gid) && (
              <MaterialIcons name="check" size={20} color={tintColor} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  </View>
</Modal>
```

## Flusso Completo

### Step 1: Azienda
1. Utente inserisce Partita IVA e Ragione Sociale
2. Sistema verifica se l'azienda esiste
3. Se non esiste, la crea automaticamente
4. Carica i siti dell'azienda

### Step 2: Sito
1. Utente può scegliere tra "Seleziona Sito" o "Nuovo Sito"
2. **Seleziona Sito**: mostra lista siti esistenti dell'azienda
3. **Nuovo Sito**: richiede Nome + Tema + Tipologia
4. Se crea nuovo sito, viene salvato con geometria di default (centro Campania)

### Step 3: Scheda
1. Utente inserisce Data, Protocollo, Note
2. Sistema crea la scheda collegata al sito selezionato/creato
3. Reindirizza alla lista schede

## Note Tecniche

- **Geometria Siti**: I siti vengono creati con un punto di default (14.25, 40.83) - Centro Campania
- **Motivo Visita**: Attualmente impostato a "1" (Controllo ordinario)
- **Validazione**: Controlli su campi obbligatori e formato data
- **Error Handling**: Alert per tutti gli errori di rete/validazione
- **Loading States**: ActivityIndicator durante operazioni asincrone

## Test Suggeriti

1. Creare una nuova azienda con nuovo sito
2. Creare una scheda per un'azienda esistente selezionando un sito esistente
3. Creare un nuovo sito per un'azienda esistente
4. Verificare validazione campi obbligatori
5. Verificare formato data (GG/MM/AAAA)
