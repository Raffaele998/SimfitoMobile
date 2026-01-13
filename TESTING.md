# Testing Guide - SimFito Mobile

## Setup

1. **Assicurati che il backend sia in esecuzione su `192.168.1.19`**
   - Il database deve essere raggiungibile
   - I servizi PHP devono essere configurati

2. **Installa dipendenze**
   ```bash
   npm install
   ```

3. **Avvia il server Expo**
   ```bash
   npx expo start
   ```

## Flusso di Test

### 1. Login Screen
- Inserisci credenziali valide dal database
- Se il login ha successo:
  - ✅ Token salvato in AsyncStorage
  - ✅ Reindirizzamento automatico alle tabs
  - ✅ User info disponibile in Redux

### 2. Search Screen (Tab 1)
- Inserisci query di ricerca (min 3 caratteri)
- Aspetta 500ms di debounce
- Verifica la lista dei risultati
- Clicca su un elemento per andare ai dettagli

### 3. Detail Screen
- Mostra info complete dell'elemento
- Sezioni: Informazioni generali, Tassonomia, Relazioni
- Torna alla ricerca con il back button

### 4. Settings Screen (Tab 4)
- Mostra info utente loggato
- Clicca "Logout" per tornare al login
- Verifica che il token sia rimosso da AsyncStorage

### 5. Persistenza del Login
- Chiudi l'app
- Riaprila
- Dovresti rimanere loggato (se il token è valido)
- Se il token è scaduto, torna al login

## Debug

### Leggere i log
```bash
# Nel terminale dove gira Expo, premi:
# - j: open debugger
# - r: reload app
# - ? : show all commands
```

### Controllare Redux State
Aggiungi questo nel componente:
```typescript
const state = useAppSelector(state => state);
console.log('Redux State:', state);
```

### Controllare AsyncStorage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lettura
const token = await AsyncStorage.getItem('authToken');
console.log('Token:', token);

// Pulizia
await AsyncStorage.removeItem('authToken');
```

## Possibili Errori

### "Unable to resolve module @..."
→ Controlla `tsconfig.json` e gli alias path

### "Metro error: API not responding"
→ Riavvia il server Expo: `Ctrl+C` e `npx expo start`

### "401 Unauthorized"
→ Token scaduto o credenziali invalide
→ Fai logout e login di nuovo

### "Network error: connect ECONNREFUSED"
→ Backend non raggiungibile su `192.168.1.19`
→ Controlla configurazione server
