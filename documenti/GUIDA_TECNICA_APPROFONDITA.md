# 📘 Guida Tecnica Approfondita - SimFito Mobile

## 📑 Indice
1. [Fondamenti: React Native, Expo e Redux Toolkit](#fondamenti-react-native-expo-e-redux-toolkit)
2. [Panoramica Architetturale](#panoramica-architetturale)
3. [Linguaggi e Tecnologie Utilizzati](#linguaggi-e-tecnologie-utilizzati)
4. [Architettura Frontend](#architettura-frontend)
5. [Architettura Backend](#architettura-backend)
6. [Flussi di Dati e Logica](#flussi-di-dati-e-logica)
7. [Pattern e Best Practices](#pattern-e-best-practices)
8. [Sistema di Autenticazione](#sistema-di-autenticazione)
9. [Gestione dello Stato](#gestione-dello-stato)
10. [Comunicazione Client-Server](#comunicazione-client-server)

---

## 🚀 Fondamenti: React Native, Expo e Redux Toolkit

Questa sezione fornisce una panoramica approfondita delle tre tecnologie fondamentali utilizzate in SimFito Mobile.

---

### 📱 React Native

#### **Cosa è React Native?**

React Native è un framework JavaScript/TypeScript open-source creato da Meta (Facebook) che permette di sviluppare **applicazioni mobile native** utilizzando React.

**Differenza chiave rispetto ad altri approcci:**
- ❌ **Non è una WebView** (come Ionic/Cordova): non "wrappa" una pagina web
- ✅ **Rendering Nativo**: i componenti React vengono convertiti in componenti nativi iOS/Android
- ✅ **Prestazioni Native**: accesso diretto alle API del sistema operativo
- ✅ **Codice Condiviso**: ~90% del codice è condiviso tra iOS e Android

#### **Come Funziona React Native (Teoria)**

```
┌───────────────────────────────────────────┐
│         JavaScript Code                   │
│   (React Components + Business Logic)    │
└──────────────┬────────────────────────────┘
               │
         Metro Bundler
         (JavaScript Bundler)
               │
┌──────────────▼────────────────────────────┐
│         JavaScript Thread                 │
│   - Esegue il codice JavaScript          │
│   - Gestisce lo stato dell'app           │
│   - Decide cosa renderizzare             │
└──────────────┬────────────────────────────┘
               │
          Bridge (JSON)
          Comunica tramite messaggi
               │
┌──────────────▼────────────────────────────┐
│         Native Thread                     │
│   - Renderizza UI nativa                 │
│   - Gestisce eventi touch                │
│   - Esegue animazioni                    │
└───────────────────────────────────────────┘
```

**Nuova Architettura (New Architecture - abilitata in SimFito):**
- **JSI (JavaScript Interface)**: comunicazione diretta JS ↔ Native (no più bridge asincrono)
- **Fabric**: nuovo rendering engine più veloce
- **TurboModules**: caricamento lazy dei moduli nativi

#### **Componenti Core di React Native**

React Native fornisce componenti che mappano direttamente su elementi nativi:

| Componente RN | iOS Native | Android Native | HTML (web) |
|--------------|-----------|---------------|-----------|
| `<View>` | UIView | android.view.ViewGroup | `<div>` |
| `<Text>` | UILabel | TextView | `<span>` |
| `<Image>` | UIImageView | ImageView | `<img>` |
| `<TextInput>` | UITextField | EditText | `<input>` |
| `<ScrollView>` | UIScrollView | ScrollView | `<div>` overflow |
| `<FlatList>` | UICollectionView | RecyclerView | virtualized list |

#### **Esempio Pratico: Un Componente React Native**

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// Componente funzionale TypeScript
interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      onSubmit(username, password);
    }
  };

  return (
    <View style={styles.container}>
      {/* Text nativo iOS/Android, non HTML */}
      <Text style={styles.title}>Accedi a SimFito</Text>
      
      {/* Input nativo */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* TouchableOpacity: componente nativo per pulsanti */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styling con StyleSheet (simile a CSS ma limitato)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

**Cosa succede quando esegui questo codice:**
1. Metro bundler compila il TypeScript → JavaScript
2. Il codice JS viene eseguito nel JavaScript thread
3. Quando chiami `setUsername`, React calcola il nuovo Virtual DOM
4. React Native invia le modifiche al Native thread tramite JSI
5. Il Native thread aggiorna il `UITextField` (iOS) o `EditText` (Android)
6. L'utente vede il testo aggiornato istantaneamente

#### **API Native di React Native**

React Native fornisce accesso a funzionalità native:

```typescript
// Geolocalizzazione
import * as Location from 'expo-location';
const location = await Location.getCurrentPositionAsync();

// Camera
import * as ImagePicker from 'expo-image-picker';
const result = await ImagePicker.launchCameraAsync();

// Storage locale
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('key', 'value');

// Notifiche
import * as Notifications from 'expo-notifications';
await Notifications.scheduleNotificationAsync({
  content: { title: 'Alert', body: 'Nuova scheda' },
  trigger: { seconds: 10 },
});

// Network
import NetInfo from '@react-native-community/netinfo';
const state = await NetInfo.fetch();
console.log(state.isConnected);
```

#### **Vantaggi di React Native**

✅ **Cross-platform**: Un codebase per iOS e Android  
✅ **Riutilizzo conoscenze**: Se conosci React, sai già il 70% di React Native  
✅ **Hot Reload**: Vedi le modifiche istantaneamente senza ricompilare  
✅ **Ecosistema**: npm packages, community attiva  
✅ **Prestazioni**: Molto vicine a app native pure  
✅ **Fast Iteration**: Sviluppo più rapido rispetto a Swift/Kotlin  

#### **Limitazioni di React Native**

❌ **Bridge Overhead** (architettura classica): comunicazione asincrona JS ↔ Native  
❌ **Alcune UI complesse**: animazioni molto complesse meglio native  
❌ **Dimensione app**: Bundle JavaScript aumenta dimensione (~30-50MB base)  
❌ **Platform-specific code**: alcune feature richiedono codice nativo separato  
❌ **Third-party libraries**: dipendenza da librerie di terze parti per funzionalità native  

---

### 🔷 Expo

#### **Cosa è Expo?**

Expo è una **piattaforma e un framework** costruito sopra React Native che semplifica drasticamente lo sviluppo mobile.

**Metafora**: Se React Native è come costruire una casa da zero, Expo è come avere una casa prefabbricata con elettricità, acqua e riscaldamento già installati.

#### **Componenti di Expo**

```
┌─────────────────────────────────────────────┐
│            Expo Platform                    │
├─────────────────────────────────────────────┤
│                                             │
│  1. Expo SDK                                │
│     - Librerie pre-configurate              │
│     - expo-camera, expo-location, ecc.      │
│                                             │
│  2. Expo CLI                                │
│     - npx expo start                        │
│     - Build, test, deploy                   │
│                                             │
│  3. Expo Go App                             │
│     - App container per test rapido         │
│     - Scan QR code e vedi l'app            │
│                                             │
│  4. EAS (Expo Application Services)         │
│     - Build cloud (iOS/Android)             │
│     - OTA Updates                           │
│     - Push Notifications                    │
│                                             │
└─────────────────────────────────────────────┘
```

#### **Expo SDK: Librerie Pre-Integrate**

Expo fornisce ~50 moduli pronti all'uso:

```typescript
// CAMERA
import * as Camera from 'expo-camera';
const { status } = await Camera.requestCameraPermissionsAsync();
const photo = await cameraRef.current.takePictureAsync();

// FILE SYSTEM
import * as FileSystem from 'expo-file-system';
await FileSystem.writeAsStringAsync(
  FileSystem.documentDirectory + 'data.json',
  JSON.stringify(data)
);

// LOCATION
import * as Location from 'expo-location';
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.High,
});

// SENSORS
import { Accelerometer, Gyroscope } from 'expo-sensors';
Accelerometer.addListener(({ x, y, z }) => {
  console.log('Accelerazione:', x, y, z);
});

// SQLITE
import * as SQLite from 'expo-sqlite';
const db = await SQLite.openDatabaseAsync('mydb.db');
await db.execAsync('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY)');

// FONTS PERSONALIZZATI
import * as Font from 'expo-font';
await Font.loadAsync({
  'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
});
```

#### **Expo Router: File-based Routing**

Expo Router è il sistema di navigazione di Expo (basato su Next.js):

```
app/
├── _layout.tsx          → Layout radice
├── index.tsx            → Schermata iniziale (/)
├── login.tsx            → /login
├── (tabs)/             → Gruppo con tab navigation
│   ├── _layout.tsx     → Tab layout
│   ├── schede.tsx      → /schede
│   ├── siti.tsx        → /siti
│   └── settings.tsx    → /settings
├── schede/
│   └── [id].tsx        → /schede/:id (dynamic)
└── modal.tsx           → Modal overlay
```

**Esempio pratico di navigazione:**

```typescript
// app/(tabs)/schede.tsx
import { Link, router } from 'expo-router';

export default function SchedeScreen() {
  return (
    <View>
      {/* Link dichiarativo */}
      <Link href="/schede/123">
        <Text>Vai alla scheda 123</Text>
      </Link>
      
      {/* Navigazione programmatica */}
      <Button 
        title="Nuova scheda"
        onPress={() => router.push('/nuova-scheda')}
      />
      
      {/* Navigazione con parametri */}
      <Button
        title="Dettaglio"
        onPress={() => router.push({
          pathname: '/schede/[id]',
          params: { id: '456', mode: 'edit' }
        })}
      />
    </View>
  );
}

// app/schede/[id].tsx - Riceve i parametri
import { useLocalSearchParams } from 'expo-router';

export default function SchedaDetail() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  
  return <Text>Scheda ID: {id}, Mode: {mode}</Text>;
}
```

#### **Workflow di Sviluppo con Expo**

```bash
# 1. Avvia development server
npx expo start

# Output:
# › Metro waiting on exp://192.168.1.9:8081
# › QR code displayed
# › Press i │ open iOS simulator
# › Press a │ open Android emulator
# › Press r │ reload app
```

**Testing rapido:**
1. Installa **Expo Go** su smartphone
2. Scansiona QR code
3. Vedi l'app in tempo reale
4. Modifichi il codice → Hot reload automatico

#### **EAS Build: Compilazione Cloud**

```bash
# Build per iOS (richiede account Apple Developer)
eas build --platform ios

# Build per Android
eas build --platform android

# Build locale (alternativa)
eas build --platform android --local
```

**Processo:**
1. Expo invia il codice al cloud
2. Server Expo compila l'app nativa
3. Ricevi `.ipa` (iOS) o `.apk/.aab` (Android)
4. Pubblichi su App Store / Play Store

#### **OTA Updates (Over-The-Air)**

Feature killer di Expo: aggiorna l'app senza passare per store:

```bash
# Pubblica aggiornamento
eas update --branch production --message "Bug fix autenticazione"
```

**Funzionamento:**
1. Utente apre l'app
2. App controlla se c'è un update
3. Scarica nuovo bundle JavaScript
4. Al prossimo riavvio: nuova versione!

**Limitazioni OTA:**
- ✅ Aggiorna: JavaScript, assets, configurazione
- ❌ Non aggiorna: codice nativo, dipendenze native

#### **Expo vs React Native Bare**

| Feature | Expo | React Native Bare |
|---------|------|-------------------|
| Setup | `npx create-expo-app` (2 min) | `npx react-native init` + config (1-2 ore) |
| API native | Librerie pre-integrate | Installazione manuale |
| Build iOS | Cloud (no Mac necessario) | Xcode su Mac |
| Build Android | Cloud o locale | Android Studio locale |
| OTA Updates | Incluso (EAS) | Manuale (CodePush) |
| Dimensione app | +10MB (Expo modules) | Più leggera |
| Codice nativo | Limitato (config plugins) | Pieno controllo |
| Ideale per | MVP, startup, team piccoli | App enterprise, custom native |

**SimFito Mobile usa Expo perché:**
- ✅ Sviluppo rapido
- ✅ Testing facile (Expo Go)
- ✅ Non richiede hardware Apple per build iOS
- ✅ OTA updates per bug fix rapidi
- ❌ Non servono moduli nativi custom

---

### 🔴 Redux Toolkit

#### **Cosa è Redux?**

Redux è una libreria per la **gestione dello stato globale** dell'applicazione. Implementa il pattern **Flux** di Facebook.

**Problema che risolve:**

Senza Redux (prop drilling):
```typescript
<App>                          // Ha lo stato user
  <Header user={user} />       // Passa user
    <Profile user={user} />    // Passa user
      <Avatar user={user} />   // Finalmente usa user! 😩
```

Con Redux:
```typescript
<App>                       // Non passa nulla
  <Header />                // Non passa nulla
    <Profile />             // Non passa nulla
      <Avatar />            // Legge user direttamente dallo store! 🎉
```

#### **Concetti Fondamentali di Redux**

```
┌─────────────────────────────────────────────┐
│                 STORE                       │
│  (Single Source of Truth)                  │
│  {                                         │
│    auth: { user, token, isAuthenticated }, │
│    schede: { items, loading, error },      │
│    siti: { items, filters },               │
│  }                                         │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
    READ (select)   WRITE (dispatch)
        │             │
   ┌────▼─────┐  ┌───▼──────┐
   │ Component│  │  Action  │
   │  (View)  │  │  (Event) │
   └──────────┘  └────┬─────┘
                      │
                 ┌────▼──────┐
                 │  Reducer  │
                 │ (Pure fn) │
                 └────┬──────┘
                      │
              Updates Store ──┘
```

**Termini chiave:**

- **Store**: Oggetto contenente tutto lo stato dell'app
- **Action**: Oggetto che descrive cosa è successo (es. `{ type: 'USER_LOGGED_IN', payload: user }`)
- **Reducer**: Funzione pura che calcola il nuovo stato: `(state, action) => newState`
- **Dispatch**: Funzione per inviare un'action allo store
- **Selector**: Funzione per leggere dati dallo store

#### **Redux Toolkit: Redux Semplificato**

**Problema con Redux classico:**
```typescript
// REDUX CLASSICO = Troppo boilerplate 😫

// 1. Action types (costanti)
const FETCH_SCHEDE_REQUEST = 'schede/fetchRequest';
const FETCH_SCHEDE_SUCCESS = 'schede/fetchSuccess';
const FETCH_SCHEDE_FAILURE = 'schede/fetchFailure';

// 2. Action creators
const fetchSchedeRequest = () => ({ type: FETCH_SCHEDE_REQUEST });
const fetchSchedeSuccess = (schede) => ({ 
  type: FETCH_SCHEDE_SUCCESS, 
  payload: schede 
});
const fetchSchedeFailure = (error) => ({ 
  type: FETCH_SCHEDE_FAILURE, 
  payload: error 
});

// 3. Reducer
function schedeReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SCHEDE_REQUEST:
      return { ...state, loading: true };
    case FETCH_SCHEDE_SUCCESS:
      return { ...state, loading: false, items: action.payload };
    case FETCH_SCHEDE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// 4. Thunk async
function fetchSchede() {
  return async (dispatch) => {
    dispatch(fetchSchedeRequest());
    try {
      const response = await api.getSchede();
      dispatch(fetchSchedeSuccess(response.data));
    } catch (error) {
      dispatch(fetchSchedeFailure(error.message));
    }
  };
}
```

**Redux Toolkit = Stesso risultato, 10x meno codice:**
```typescript
// REDUX TOOLKIT = Conciso e potente! 🚀

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Async thunk (genera automaticamente 3 action types)
export const fetchSchede = createAsyncThunk(
  'schede/fetch',
  async (userId: string) => {
    const response = await api.getSchede(userId);
    return response.data;
  }
);

// 2. Slice (combina reducer + actions)
const schedeSlice = createSlice({
  name: 'schede',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous actions
    clearSchede: (state) => {
      state.items = []; // Immer permette "mutazioni" (in realtà immutabile)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchede.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchede.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSchede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSchede } = schedeSlice.actions;
export default schedeSlice.reducer;
```

#### **Store Configuration in SimFito**

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import schedeReducer from './slices/schedeSlice';
import sitiReducer from './slices/sitiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schede: schedeReducer,
    siti: sitiReducer,
    // ... altri reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora azioni con date/functions
        ignoredActions: ['schede/fetch/fulfilled'],
      },
    }),
});

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### **Uso Pratico: CRUD con Redux Toolkit**

**Esempio completo: Gestione Schede**

```typescript
// src/store/slices/schedeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/services/api';

interface Scheda {
  id: number;
  titolo: string;
  data_sopralluogo: string;
  tecnico_id: number;
}

interface SchedeState {
  items: Scheda[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: SchedeState = {
  items: [],
  loading: false,
  error: null,
  currentPage: 0,
  hasMore: true,
};

// Async Thunks
export const fetchSchede = createAsyncThunk(
  'schede/fetchList',
  async ({ userId, page }: { userId: string; page: number }) => {
    const response = await apiClient.get('/ajax.php', {
      params: { op: 'schede_list', idtecnico: userId, page },
    });
    return response.data;
  }
);

export const createScheda = createAsyncThunk(
  'schede/create',
  async (schedaData: Partial<Scheda>) => {
    const response = await apiClient.post('/ajax.php', {
      op: 'scheda_insert',
      ...schedaData,
    });
    return response.data;
  }
);

export const deleteScheda = createAsyncThunk(
  'schede/delete',
  async (schedaId: number) => {
    await apiClient.post('/ajax.php', {
      op: 'scheda_delete',
      id: schedaId,
    });
    return schedaId;
  }
);

// Slice
const schedeSlice = createSlice({
  name: 'schede',
  initialState,
  reducers: {
    resetSchede: (state) => {
      state.items = [];
      state.currentPage = 0;
      state.hasMore = true;
    },
    updateSchedaLocal: (state, action: PayloadAction<Scheda>) => {
      const index = state.items.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch schede
    builder.addCase(fetchSchede.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSchede.fulfilled, (state, action) => {
      state.loading = false;
      if (action.meta.arg.page === 0) {
        state.items = action.payload.schede;
      } else {
        state.items.push(...action.payload.schede);
      }
      state.currentPage = action.meta.arg.page;
      state.hasMore = action.payload.schede.length === 20;
    });
    builder.addCase(fetchSchede.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Errore caricamento';
    });
    
    // Create scheda
    builder.addCase(createScheda.fulfilled, (state, action) => {
      state.items.unshift(action.payload); // Aggiungi in testa
    });
    
    // Delete scheda
    builder.addCase(deleteScheda.fulfilled, (state, action) => {
      state.items = state.items.filter(s => s.id !== action.payload);
    });
  },
});

export const { resetSchede, updateSchedaLocal } = schedeSlice.actions;
export default schedeSlice.reducer;
```

**Uso nei componenti:**

```typescript
// app/(tabs)/schede.tsx
import { useEffect } from 'react';
import { FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSchede, deleteScheda } from '@/src/store/slices/schedeSlice';
import type { RootState, AppDispatch } from '@/src/store';

export default function SchedeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selettori: leggere dati dallo store
  const { items, loading, error } = useSelector((state: RootState) => state.schede);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  
  useEffect(() => {
    if (userId) {
      // Dispatch async action
      dispatch(fetchSchede({ userId, page: 0 }));
    }
  }, [userId]);
  
  const handleDelete = async (schedaId: number) => {
    // Dispatch con unwrap per gestire errori
    try {
      await dispatch(deleteScheda(schedaId)).unwrap();
      Alert.alert('Successo', 'Scheda eliminata');
    } catch (error) {
      Alert.alert('Errore', 'Impossibile eliminare');
    }
  };
  
  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Errore: {error}</Text>;
  
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <SchedaCard
          scheda={item}
          onDelete={() => handleDelete(item.id)}
        />
      )}
    />
  );
}
```

#### **Selettori Memoizzati (Reselect)**

Per calcoli complessi, usa `createSelector`:

```typescript
import { createSelector } from '@reduxjs/toolkit';

// Selector base
const selectSchede = (state: RootState) => state.schede.items;
const selectSearchTerm = (state: RootState) => state.filters.searchTerm;

// Selector memoizzato: ricalcola solo se inputs cambiano
export const selectFilteredSchede = createSelector(
  [selectSchede, selectSearchTerm],
  (schede, searchTerm) => {
    if (!searchTerm) return schede;
    return schede.filter(s => 
      s.titolo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);

// Uso nel componente
const filteredSchede = useSelector(selectFilteredSchede);
// Ricalcola solo quando schede o searchTerm cambiano!
```

#### **Redux DevTools**

Redux Toolkit abilita automaticamente i DevTools:

```typescript
// In development, apri Redux DevTools nel browser/simulatore
// Vedrai:
// - Tutte le actions dispatched in ordine
// - State tree completo
// - Diff di ogni cambiamento
// - Time-travel debugging (vai avanti/indietro nel tempo!)

// Esempio di log:
// ┌─ schede/fetchList/pending
// ├─ schede/fetchList/fulfilled
// │  Payload: { schede: [...], total: 45 }
// │  State diff: + items: [10 schede]
// │               + loading: false
```

#### **Best Practices Redux Toolkit**

✅ **DO:**
- Usa `createSlice` per tutto (no reducer/action separati)
- Usa `createAsyncThunk` per chiamate API
- Normalizza dati complessi (usa `@reduxjs/toolkit` con `createEntityAdapter`)
- Usa selettori memoizzati per calcoli pesanti
- Tipa tutto con TypeScript

❌ **DON'T:**
- Non mettere funzioni/classi nello state (solo dati serializzabili)
- Non fare chiamate API nei reducer (solo in thunk)
- Non duplicare dati (single source of truth)
- Non usare Redux per stato locale (usa `useState` se è solo nel componente)

#### **Quando Usare Redux?**

**Usa Redux per:**
- ✅ Stato condiviso tra molti componenti
- ✅ Dati da API che servono in tutta l'app
- ✅ Stato che deve persistere tra navigazioni
- ✅ Logica complessa di aggiornamento stato

**NON usare Redux per:**
- ❌ Form state (usa `useState` o `react-hook-form`)
- ❌ UI state locale (menu aperto/chiuso)
- ❌ Cache temporanea (usa React Query/SWR)

---

### 🔗 Come Si Integrano le Tre Tecnologie in SimFito

```
┌────────────────────────────────────────────────────┐
│                  EXPO                              │
│  - Build system                                    │
│  - Development server                              │
│  - Native API access (Camera, Location, FS)       │
│  - File-based routing (Expo Router)               │
└──────────────┬─────────────────────────────────────┘
               │
┌──────────────▼─────────────────────────────────────┐
│              REACT NATIVE                          │
│  - UI Components (View, Text, FlatList)           │
│  - Navigation logic                                │
│  - Component lifecycle                             │
│  - Event handling                                  │
└──────────────┬─────────────────────────────────────┘
               │
┌──────────────▼─────────────────────────────────────┐
│           REDUX TOOLKIT                            │
│  - Global state management                         │
│  - Auth state (user, token)                       │
│  - Data caching (schede, siti, aziende)           │
│  - Async operations (API calls)                    │
└────────────────────────────────────────────────────┘
```

**Flusso pratico: Utente apre lista schede**

1. **Expo Router** carica `app/(tabs)/schede.tsx`
2. **React Native** renderizza la UI (FlatList, Card)
3. Il componente fa **dispatch(fetchSchede())** → **Redux Toolkit**
4. Redux thunk chiama l'API tramite **Axios**
5. Backend risponde con JSON
6. Redux aggiorna lo store
7. **React Native** ri-renderizza con nuovi dati
8. **Expo** mostra la UI aggiornata su iOS/Android

**Gestione offline:**
1. **Redux** mantiene l'ultimo stato in memoria
2. **Expo FileSystem** salva dati localmente
3. Al prossimo avvio, Redux ripristina lo stato
4. App funziona anche offline

---

### 📚 Risorse per Approfondire

#### React Native
- 📖 Documentazione ufficiale: https://reactnative.dev/docs/getting-started
- 🎓 Tutorial: https://reactnative.dev/docs/tutorial
- 🏗️ New Architecture: https://reactnative.dev/docs/the-new-architecture/landing-page

#### Expo
- 📖 Documentazione: https://docs.expo.dev/
- 🚀 Expo Router: https://docs.expo.dev/router/introduction/
- ☁️ EAS Build: https://docs.expo.dev/build/introduction/
- 📦 Expo SDK API Reference: https://docs.expo.dev/versions/latest/

#### Redux Toolkit
- 📖 Documentazione: https://redux-toolkit.js.org/
- 🎓 Tutorial ufficiale: https://redux-toolkit.js.org/tutorials/quick-start
- 📝 Style Guide: https://redux.js.org/style-guide/
- 🔧 TypeScript Guide: https://redux-toolkit.js.org/usage/usage-with-typescript

---

## 🏗️ Panoramica Architetturale

**SimFito Mobile** è un'applicazione ibrida mobile che combina:
- **Frontend**: React Native con Expo
- **Backend**: PHP con PostgreSQL
- **Database**: PostgreSQL 13+ (schema `simfito` e `eppo`)

### Architettura a 3 Livelli

```
┌─────────────────────────────────────┐
│   PRESENTATION LAYER                │
│   (React Native + Expo Router)      │
│   - Componenti UI                   │
│   - Screens                         │
│   - Navigation                      │
└──────────────┬──────────────────────┘
               │ HTTP/REST API
               │ (Axios)
┌──────────────▼──────────────────────┐
│   BUSINESS LOGIC LAYER              │
│   (PHP Backend)                     │
│   - Services                        │
│   - CRUD Operations                 │
│   - Authentication                  │
└──────────────┬──────────────────────┘
               │ PostgreSQL
               │ Connection
┌──────────────▼──────────────────────┐
│   DATA LAYER                        │
│   (PostgreSQL Database)             │
│   - simfito schema                  │
│   - eppo schema                     │
└─────────────────────────────────────┘
```

---

## 💻 Linguaggi e Tecnologie Utilizzati

### 🎯 Frontend Stack

#### **1. TypeScript (v5.9.2)**
- **Ruolo**: Linguaggio principale per il frontend
- **Vantaggi**: Type safety, autocompletamento, refactoring sicuro
- **Configurazione**: `tsconfig.json` con strict mode

```typescript
// Esempio di tipizzazione forte
interface User {
  id: string | number;
  username: string;
  email?: string;
  name?: string;
  type?: string;
  province?: string;
  userType?: string;
}
```

#### **2. JavaScript/JSX (React Native 0.81.5)**
- **Ruolo**: Framework UI mobile cross-platform
- **Caratteristiche**: 
  - Rendering nativo (non WebView)
  - Hot reload per sviluppo rapido
  - Accesso alle API native (camera, GPS, storage, ecc.)

#### **3. JSON**
- **Ruolo**: Formato di scambio dati
- **Uso**: Configurazione (`app.json`, `package.json`), API responses, storage locale

### 🔧 Framework e Librerie Frontend

#### **Expo (v54.0.31)**
Piattaforma per React Native che semplifica:
- Build e deploy
- Accesso a API native (camera, location, notifications)
- Development workflow
- OTA (Over-The-Air) updates

```json
{
  "expo": {
    "name": "SimfitoMobile",
    "newArchEnabled": true,
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
```

#### **Expo Router (v6.0.21)**
- **Ruolo**: Sistema di navigazione file-based
- **Logica**: La struttura delle cartelle in `app/` definisce le route

```
app/
├── _layout.tsx          → Root layout
├── login.tsx            → /login
├── (tabs)/             → Tab navigation group
│   ├── schede.tsx      → /schede
│   ├── siti.tsx        → /siti
│   └── aziende.tsx     → /aziende
└── schede/
    └── [id].tsx        → /schede/:id (dynamic route)
```

#### **Redux Toolkit (v2.11.2)**
- **Ruolo**: State management globale
- **Pattern**: Flux/Redux con slices
- **Vantaggi**: Predictable state, time-travel debugging, middleware

**Store Structure:**
```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,           // Gestione autenticazione
    schede: schedeReducer,       // Lista schede
    siti: sitiReducer,           // Gestione siti
    aziende: aziendeReducer,     // Gestione aziende
    osservazioni: osservazioniReducer,
    trappole: trappolReducer,
    settings: settingsReducer,   // Impostazioni app
    themes: themesReducer,       // Tema dark/light
  },
});
```

#### **Axios (v1.13.2)**
- **Ruolo**: HTTP client per chiamate API
- **Caratteristiche**:
  - Interceptors per request/response
  - Timeout automatico
  - Gestione errori centralizzata

```typescript
// Configurazione base
export const apiClient = axios.create({
  baseURL: 'http://192.168.1.9:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere token (in memoria, non persistente)
apiClient.interceptors.request.use((config) => {
  const token = tokenService.getToken();
  if (token && !config.url?.includes('/login.php')) {
    config.params = config.params || {};
    config.params.token = token;
  }
  return config;
});
```

### 🗄️ Backend Stack

#### **1. PHP (v7.4+)**
- **Ruolo**: Linguaggio backend principale
- **Caratteristiche**:
  - Supporto nativo PostgreSQL (`pg_*` functions)
  - Session management
  - File upload handling

**Struttura Backend:**
```php
backend/
├── config.php              # Configurazione DB
├── index.php               # Entry point
├── etc/
│   ├── db_config.php      # Connessione PostgreSQL
│   └── prj.php            # Configurazione progetto
└── services/
    ├── login.php          # Autenticazione
    ├── ajax.php           # API principale
    ├── crud.php           # Database abstraction
    └── export_*.php       # Export dati
```

#### **2. SQL (PostgreSQL 13+)**
- **Ruolo**: Query database
- **Dialect**: PostgreSQL-specific (schemas, array types, JSON functions)

```sql
-- Esempio di query con schema multipli
SET search_path TO public, simfito, eppo;

SELECT s.*, t.tipologiadesc 
FROM schede s
LEFT JOIN tipo_scheda t ON t.idtipo_scheda = s.idtipo_scheda
WHERE s.idtecnico = $1
ORDER BY s.data_sopralluogo DESC
LIMIT 20 OFFSET $2;
```

#### **3. PostgreSQL**
- **Database**: `simfito4`
- **Schemas**:
  - `public`: Tabelle di sistema
  - `simfito`: Dati applicativi (schede, siti, aziende, trappole)
  - `eppo`: Dati tassonomici (pest, piante, malattie)

**Principali Tabelle:**

```sql
-- Schema simfito
simfito.tecnici              # Utenti/tecnici
simfito.schede               # Schede fitosanitarie
simfito.siti                 # Siti monitorati
simfito.aziende              # Aziende agricole
simfito.trappole             # Trappole per monitoraggio
simfito.osservazioni         # Osservazioni su schede

-- Schema eppo
eppo.host                    # Piante host
eppo.pest                    # Parassiti/malattie
eppo.taxa                    # Tassonomia biologica
```

---

## 🎨 Architettura Frontend

### Pattern di Progettazione

#### **1. Component-Based Architecture**

```
components/
├── ui/                    # Componenti riutilizzabili
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── themed-text.tsx        # Text con tema
├── themed-view.tsx        # View con tema
└── external-link.tsx      # Link esterni
```

Ogni componente è:
- **Isolato**: Non dipende da state globale (tranne theme)
- **Riutilizzabile**: Può essere usato in più screens
- **Tipizzato**: Props definiti con TypeScript interfaces

```typescript
// Esempio di componente tipizzato
interface ThemedTextProps {
  type?: 'default' | 'title' | 'subtitle';
  style?: TextStyle;
  children: React.ReactNode;
}

export function ThemedText({ type = 'default', style, children }: ThemedTextProps) {
  const color = useThemeColor({}, 'text');
  // Rendering logic...
}
```

#### **2. Screen-Based Navigation**

```typescript
// app/_layout.tsx - Root navigator
export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="schede/[id]" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
```

**Navigation Flow:**
1. `_layout.tsx` → Root provider (Redux + Theme)
2. Check token → Redirect to login or (tabs)
3. Tab navigator → schede, siti, aziende, settings
4. Dynamic routes → [id].tsx per dettagli

#### **3. Custom Hooks Pattern**

```typescript
// hooks/use-theme-color.ts
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];
  
  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
```

### State Management (Redux Toolkit)

#### **Slice Pattern**

Ogni slice gestisce una "fetta" dello stato globale:

```typescript
// src/store/slices/authSlice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Async thunk per login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/services/login.php', ...);
      const token = btoa(`${username}:${password}`);
      tokenService.setToken(token); // Salva solo in memoria
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice con reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});
```

#### **Selectors Pattern**

```typescript
// Selectors per accedere allo stato
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

// Uso nei componenti
const { user, token, loading } = useAppSelector(selectAuth);
```

---

## ⚙️ Architettura Backend

### PHP Service Layer

#### **CRUD Abstraction**

```php
// backend/services/crud.php
class CRUD {
    private $conn;
    
    public function __construct($connection_string) {
        $this->conn = pg_connect($connection_string);
    }
    
    public function Read($sql) {
        $this->result = pg_query($this->conn, $sql);
        return $this->result;
    }
    
    public function fetch_assoc() {
        return pg_fetch_assoc($this->result);
    }
    
    public function Insert($table, $data) {
        // Build INSERT query
        $fields = implode(',', array_keys($data));
        $values = implode(',', array_map(function($v) {
            return "'$v'";
        }, array_values($data)));
        
        $sql = "INSERT INTO $table ($fields) VALUES ($values)";
        return pg_query($this->conn, $sql);
    }
}
```

#### **API Endpoints Structure**

**1. Login Endpoint** (`login.php`)

```php
// Request: POST /services/login.php
// Body: loginUsername=admin&loginPassword=pass&mode=simfito

function login_chk($user, $pass) {
    global $connection, $user_tb;
    
    $user_db = new CRUD($connection);
    $user_db->connect();
    $user_db->SQL("SET search_path TO public, simfito, eppo");
    
    $sql = "SELECT * FROM tecnici 
            LEFT JOIN tipo_tecnico ON tipo_tecnico.idtipo_tecnico=tecnici.idtipo_tecnico
            WHERE username='$user' 
            AND pswrd='$pass' 
            AND validated 
            AND NOT cancellato";
    
    $user_db->Read($sql);
    $result = $user_db->fetch_assoc();
    
    if ($result) {
        $_SESSION['user_id'] = $result['idtecnico'];
        $_SESSION['username'] = $result['username'];
        return [
            'success' => true,
            'id' => $result['idtecnico'],
            'nome' => $result['nome'],
            'tipo' => $result['tipo'],
            'provincia' => $result['provincia'],
            'tipotecnico' => $result['tipotecnico']
        ];
    }
    
    return ['success' => false, 'errors' => ['reason' => 'Credenziali non valide']];
}
```

**2. Data Retrieval** (`ajax.php`)

```php
// Request: GET /services/ajax.php?mode=getschede&idtecnico=123&page=0

if ($_REQUEST['mode'] == 'getschede') {
    $idtecnico = $_REQUEST['idtecnico'];
    $page = $_REQUEST['page'] ?? 0;
    $limit = 20;
    $offset = $page * $limit;
    
    $sql = "SELECT 
                s.idscheda, 
                s.protocollo, 
                s.data_sopralluogo,
                s.motivo,
                st.nome as sito,
                s.stato,
                ts.tipologiadesc as statodesc,
                COUNT(o.idosservazione) FILTER (WHERE o.positiva) as numpositive
            FROM simfito.schede s
            LEFT JOIN simfito.siti st ON st.idsito = s.idsito
            LEFT JOIN simfito.tipo_scheda ts ON ts.idtipo_scheda = s.idtipo_scheda
            LEFT JOIN simfito.osservazioni o ON o.idscheda = s.idscheda
            WHERE s.idtecnico = $idtecnico
            GROUP BY s.idscheda, st.nome, ts.tipologiadesc
            ORDER BY s.data_sopralluogo DESC
            LIMIT $limit OFFSET $offset";
    
    $db->Read($sql);
    $results = [];
    while ($row = $db->fetch_assoc()) {
        $results[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $results,
        'total' => count($results),
        'page' => $page
    ]);
}
```

### Database Schema Design

#### **Schema Multipli**

PostgreSQL usa il concetto di **schema** per organizzare le tabelle:

```sql
-- Public schema: Tabelle di sistema e utility
public.spatial_ref_sys
public.geometry_columns

-- Simfito schema: Dati applicativi
simfito.tecnici          # Utenti dell'app
simfito.schede           # Schede fitosanitarie
simfito.siti             # Siti agricoli
simfito.aziende          # Aziende
simfito.trappole         # Trappole di monitoraggio
simfito.osservazioni     # Osservazioni nelle schede

-- EPPO schema: Database tassonomico europeo
eppo.pest                # Organismi nocivi
eppo.host                # Piante ospiti
eppo.taxa                # Tassonomia biologica
```

#### **Relazioni Chiave**

```sql
-- 1:N - Un tecnico ha molte schede
tecnici.idtecnico ←→ schede.idtecnico

-- 1:N - Un sito ha molte schede
siti.idsito ←→ schede.idsito

-- 1:N - Una scheda ha molte osservazioni
schede.idscheda ←→ osservazioni.idscheda

-- N:M - Osservazioni collegano schede e pest
osservazioni.idscheda ←→ schede.idscheda
osservazioni.eppoid ←→ pest.eppocode
```

---

## 🔄 Flussi di Dati e Logica

### 1. Flusso di Autenticazione

```
┌──────────┐                ┌──────────┐               ┌──────────┐
│  Login   │                │  Redux   │               │  Backend │
│  Screen  │                │  Store   │               │   PHP    │
└────┬─────┘                └────┬─────┘               └────┬─────┘
     │                           │                          │
     │  1. Dispatch loginUser()  │                          │
     ├──────────────────────────►│                          │
     │                           │                          │
     │                           │  2. POST /login.php      │
     │                           ├─────────────────────────►│
     │                           │                          │
     │                           │                          │  3. Query DB
     │                           │                          ├──────┐
     │                           │                          │      │
     │                           │                          │◄─────┘
     │                           │                          │
     │                           │  4. Response {user,token}│
     │                           │◄─────────────────────────┤
     │                           │                          │
     │  5. Save to memory        │                          │
     │     (tokenService)        │                          │
     │                           ├──────┐                   │
     │                           │      │                   │
     │                           │◄─────┘                   │
     │                           │                          │
     │  6. Update state          │                          │
     │                           ├──────┐                   │
     │                           │      │                   │
     │                           │◄─────┘                   │
     │                           │                          │
     │  7. Navigate to (tabs)    │                          │
     │◄──────────────────────────┤                          │
     │                           │                          │
```

**Codice dettagliato:**

```typescript
// 1. User preme il button Login
const handleLogin = () => {
  dispatch(loginUser({ username, password }));
};

// 2. Thunk esegue la chiamata API
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    // 3. POST request
    const response = await apiClient.post('/services/login.php',
      `loginUsername=${username}&loginPassword=${password}&mode=simfito`
    );

    // 4. Salva token solo in memoria (non persistente)
    const token = btoa(`${username}:${password}`);
    tokenService.setToken(token);

    // 5. Return data
    return { user, token };
  }
);

// 6. Reducer aggiorna lo stato
.addCase(loginUser.fulfilled, (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.loading = false;
});

// 7. useEffect nel _layout.tsx naviga automaticamente
// Il token viene monitorato per il redirect automatico
useEffect(() => {
  if (!isReady) return;
  const inAuthGroup = segments[0] === 'login';

  if (!token && !inAuthGroup) {
    router.replace('/login');
  } else if (token && inAuthGroup) {
    router.replace('/(tabs)');
  }
}, [token, segments, isReady]);
```

### 2. Flusso Caricamento Schede

```
┌──────────┐              ┌──────────┐              ┌──────────┐
│ Schede   │              │  Redux   │              │ Backend  │
│ Screen   │              │  Slice   │              │   PHP    │
└────┬─────┘              └────┬─────┘              └────┬─────┘
     │                         │                         │
     │  useEffect on mount     │                         │
     ├────────┐                │                         │
     │        │                │                         │
     │◄───────┘                │                         │
     │                         │                         │
     │  dispatch(fetchSchede)  │                         │
     ├────────────────────────►│                         │
     │                         │                         │
     │                         │  GET /ajax.php?mode=... │
     │                         ├────────────────────────►│
     │                         │                         │
     │                         │                         │  Query DB
     │                         │                         ├──────┐
     │                         │                         │      │
     │                         │                         │◄─────┘
     │                         │                         │
     │                         │  {success, data:[...]}  │
     │                         │◄────────────────────────┤
     │                         │                         │
     │                         │  Update state           │
     │                         ├──────┐                  │
     │                         │      │                  │
     │                         │◄─────┘                  │
     │                         │                         │
     │  Re-render with data    │                         │
     │◄────────────────────────┤                         │
     │                         │                         │
```

**Codice:**

```typescript
// Screen component
const SchemataScreen = () => {
  const dispatch = useAppDispatch();
  const { schede, loading } = useAppSelector(selectSchede);
  const { user } = useAppSelector(selectAuth);
  
  // 1. Carica schede al mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSchede({ idtecnico: user.id, page: 0 }));
    }
  }, [user?.id]);
  
  // 2. Render lista
  return (
    <FlatList
      data={schede}
      renderItem={({ item }) => <SchedaItem item={item} />}
      loading={loading}
    />
  );
};

// Async thunk
export const fetchSchede = createAsyncThunk(
  'schede/fetch',
  async ({ idtecnico, page }) => {
    const response = await apiClient.get('/services/ajax.php', {
      params: {
        mode: 'getschede',
        idtecnico,
        page,
        limit: 20
      }
    });
    return response.data.data;
  }
);
```

### 3. Paginazione e Sorting

```typescript
// Slice con paginazione
interface SchedeState {
  schede: Scheda[];
  currentPage: number;
  totalPages: number;
  sortBy: 'data' | 'protocollo' | 'stato';
  sortOrder: 'asc' | 'desc';
}

// Actions
export const nextPage = createAsyncThunk(
  'schede/nextPage',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { currentPage, totalPages } = state.schede;
    const { user } = state.auth;
    
    if (currentPage < totalPages - 1) {
      await dispatch(fetchSchede({ 
        idtecnico: user.id, 
        page: currentPage + 1 
      }));
    }
  }
);

// Sorting locale
export const setSortBy = createAction<'data' | 'protocollo'>('schede/setSortBy');

// Reducer
.addCase(setSortBy, (state, action) => {
  state.sortBy = action.payload;
  
  // Sort in-memory
  state.schede.sort((a, b) => {
    if (action.payload === 'data') {
      return new Date(b.data_sopralluogo).getTime() - 
             new Date(a.data_sopralluogo).getTime();
    } else {
      return a.protocollo.localeCompare(b.protocollo);
    }
  });
})
```

---

## 🔐 Sistema di Autenticazione

### Meccanismo di Autenticazione

**1. Login Flow:**

```
User Input → Base64 Encode → In-Memory Storage (tokenService) → Axios Interceptor → PHP Session
```

**IMPORTANTE**: Il token NON è persistente. Ad ogni reload dell'app, l'utente deve rifare il login.

**2. Token Generation:**

```typescript
// Client-side: Basic Auth encoding
const token = btoa(`${username}:${password}`);
// Esempio: "admin:password" → "YWRtaW46cGFzc3dvcmQ="

// Salvataggio solo in memoria (non persistente)
tokenService.setToken(token);
```

**3. Token Service (In-Memory Only):**

```typescript
// src/services/tokenService.ts
let authToken: string | null = null;

export const tokenService = {
  setToken: (token: string) => {
    authToken = token;
  },

  getToken: (): string | null => {
    return authToken;
  },

  clearToken: () => {
    authToken = null;
  },
};
```

**4. Navigation Protection:**

```typescript
// In _layout.tsx - Gestisce il redirect al login quando non c'è token
useEffect(() => {
  if (!isReady) return;

  const inAuthGroup = segments[0] === 'login';

  if (!token && !inAuthGroup) {
    // Redirect al login se non c'è token e non si è già nella pagina di login
    router.replace('/login');
  } else if (token && inAuthGroup) {
    // Redirect alle tabs se c'è il token e si è nella pagina di login
    router.replace('/(tabs)');
  }
}, [token, segments, isReady, router]);
```

**5. Request Interceptor:**

```typescript
// Aggiunge automaticamente il token a ogni richiesta
apiClient.interceptors.request.use((config) => {
  // Skip login endpoint
  if (config.url?.includes('/login.php')) {
    return config;
  }

  // Aggiungi token alle altre richieste (dalla memoria)
  const token = tokenService.getToken();
  if (token) {
    config.params = config.params || {};
    config.params.token = token;
  }

  return config;
});
```

**5. Backend Validation:**

```php
// ajax.php - Ogni richiesta controlla il token
session_start();

if (!isset($_SESSION['user_id']) && !isset($_REQUEST['token'])) {
    echo json_encode([
        'success' => false,
        'errors' => ['reason' => 'Non autenticato']
    ]);
    exit();
}

// Decode e valida token
if (isset($_REQUEST['token'])) {
    $decoded = base64_decode($_REQUEST['token']);
    list($username, $password) = explode(':', $decoded);
    
    // Ri-valida credenziali
    $result = login_chk($username, $password);
    if (!$result['chk']) {
        http_response_code(401);
        exit();
    }
}
```

### Logout Flow

```typescript
// 1. Dispatch logout
const handleLogout = () => {
  dispatch(logoutUser());
};

// 2. Thunk pulisce token dalla memoria
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    tokenService.clearToken();
    return null;
  }
);

// 3. Reducer resetta stato
.addCase(logoutUser.fulfilled, (state) => {
  state.user = null;
  state.token = null;
  state.error = null;
});

// 4. Navigation automatica al login (tramite useEffect in _layout.tsx)
// Il token è null, quindi viene triggerato il redirect automatico
```

---

## 🎯 Pattern e Best Practices

### 1. Separation of Concerns

```
├── app/                    # Routes & Navigation ONLY
├── src/
│   ├── components/         # UI Components (presentational)
│   ├── screens/            # Business logic + rendering
│   ├── services/api/       # API calls abstraction
│   ├── store/              # State management
│   ├── types/              # TypeScript definitions
│   └── utils/              # Helper functions
```

### 2. TypeScript Interfaces

```typescript
// types/schede.ts
export interface Scheda {
  idscheda: number;
  protocollo: string;
  data_sopralluogo: string;  // ISO date string
  motivo: string;
  idsito: number;
  sito?: string;             // Join field
  stato: '0' | '1' | '-1' | '2';
  statodesc?: string;
  numpositive?: string;
}

export interface SchedaDettaglio extends Scheda {
  osservazioni: Osservazione[];
  allegati: Allegato[];
}

// Usage in components
const renderScheda = (scheda: Scheda) => {
  // TypeScript garantisce che scheda.protocollo esiste
  return <Text>{scheda.protocollo}</Text>;
};
```

### 3. Custom Hooks

```typescript
// hooks/use-pagination.ts
export function usePagination<T>(
  items: T[],
  itemsPerPage: number = 20
) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  
  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };
  
  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };
  
  return {
    currentItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    canGoNext: currentPage < totalPages - 1,
    canGoPrev: currentPage > 0,
  };
}

// Usage
const { currentItems, nextPage, prevPage, canGoNext } = usePagination(schede);
```

### 4. Error Handling Pattern

```typescript
// Centralized error handling
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.errors?.reason || 
           error.response.statusText ||
           'Errore del server';
  } else if (error.request) {
    // Request made but no response
    return 'Nessuna risposta dal server. Controlla la connessione.';
  } else {
    // Something else happened
    return error.message || 'Errore sconosciuto';
  }
};

// Usage in slice
.addCase(fetchSchede.rejected, (state, action) => {
  state.loading = false;
  state.error = handleApiError(action.error);
});
```

### 5. Optimistic Updates

```typescript
// Per migliorare UX, aggiorna UI prima della risposta server
export const deleteScheda = createAsyncThunk(
  'schede/delete',
  async (idscheda: number, { dispatch, rejectWithValue }) => {
    // 1. Rimuovi subito dalla UI
    dispatch(removeSchedaFromList(idscheda));
    
    try {
      // 2. Chiama backend
      await apiClient.post('/services/ajax.php', {
        mode: 'deletescheda',
        idscheda
      });
      
      // 3. Successo - niente da fare, già rimosso
      return idscheda;
    } catch (error) {
      // 4. Errore - ripristina
      dispatch(restoreScheda(idscheda));
      return rejectWithValue(error);
    }
  }
);
```

### 6. Memoization per Performance

```typescript
import { useMemo } from 'react';

const SchemataScreen = () => {
  const { schede, filters } = useAppSelector(selectSchede);
  
  // Filtra solo quando cambiano schede o filters
  const filteredSchede = useMemo(() => {
    return schede.filter(scheda => {
      if (filters.stato && scheda.stato !== filters.stato) {
        return false;
      }
      if (filters.searchText && 
          !scheda.protocollo.toLowerCase().includes(filters.searchText.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [schede, filters]);
  
  return <FlatList data={filteredSchede} />;
};
```

---

## 📊 Gestione dello Stato (Redux Deep Dive)

### Store Structure

```typescript
{
  auth: {
    user: {
      id: '123',
      username: 'admin',
      name: 'Mario Rossi',
      type: 'tecnico',
      province: 'MI'
    },
    token: 'YWRtaW46cGFzc3dvcmQ=',
    loading: false,
    error: null
  },
  schede: {
    items: [...],
    currentPage: 0,
    totalPages: 5,
    loading: false,
    error: null,
    filters: {
      stato: null,
      searchText: ''
    },
    sortBy: 'data',
    sortOrder: 'desc'
  },
  siti: {
    items: [...],
    selectedSito: null,
    loading: false
  }
}
```

### Action Types

```typescript
// Synchronous actions
{
  type: 'schede/setFilters',
  payload: { stato: '1', searchText: '' }
}

// Async actions (thunks)
dispatch(fetchSchede({ idtecnico: 123, page: 0 }))
  → schede/fetch/pending
  → schede/fetch/fulfilled (or rejected)
```

### Middleware Pipeline

```
Action → Thunk Middleware → Reducer → State Update → UI Re-render
```

### Selectors (Reselect pattern)

```typescript
import { createSelector } from '@reduxjs/toolkit';

// Selettore base
export const selectSchede = (state: RootState) => state.schede;

// Selettore derivato (memoizzato)
export const selectFilteredSchede = createSelector(
  [selectSchede],
  (schedeState) => {
    const { items, filters } = schedeState;
    return items.filter(scheda => {
      // Apply filters...
    });
  }
);

// Uso nel componente
const filteredSchede = useAppSelector(selectFilteredSchede);
// Si ricalcola SOLO se state.schede cambia
```

---

## 🌐 Comunicazione Client-Server

### API Design Patterns

#### **REST-like Endpoints**

```
POST   /services/login.php              # Autenticazione
GET    /services/ajax.php?mode=X        # Fetch data
POST   /services/ajax.php                # Create/Update
DELETE /services/ajax.php?mode=delete   # Delete
```

#### **Request/Response Format**

**Request:**
```typescript
// GET con query params
apiClient.get('/services/ajax.php', {
  params: {
    mode: 'getschede',
    idtecnico: 123,
    page: 0
  }
});
// → /services/ajax.php?mode=getschede&idtecnico=123&page=0

// POST con form data
apiClient.post('/services/ajax.php', 
  'mode=savescheda&idscheda=456&protocollo=ABC123',
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
);
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 42,
  "page": 0,
  "message": "Operazione completata"
}

// In caso di errore
{
  "success": false,
  "errors": {
    "reason": "Parametri mancanti",
    "field": "idscheda"
  }
}
```

### Error Handling Cascade

```typescript
try {
  const response = await apiClient.get('/services/ajax.php');
  
  // 1. Check HTTP status (handled by axios)
  if (response.status !== 200) {
    throw new Error('HTTP Error');
  }
  
  // 2. Check application-level success
  if (!response.data.success) {
    throw new Error(response.data.errors?.reason || 'Unknown error');
  }
  
  // 3. Use data
  return response.data.data;
  
} catch (error) {
  // 4. Handle in thunk
  return rejectWithValue(handleApiError(error));
}

// 5. Handle in component
.addCase(fetchSchede.rejected, (state, action) => {
  state.error = action.payload;
  Alert.alert('Errore', action.payload);
});
```

---

## 🔍 Code Examples Completi

### Esempio Completo: Creazione Nuova Scheda

**1. UI Component:**
```typescript
// app/nuova-scheda.tsx
export default function NuovaSchedaScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector(selectSchede);
  
  const [formData, setFormData] = useState({
    protocollo: '',
    idsito: null,
    motivo: '',
    data_sopralluogo: new Date().toISOString()
  });
  
  const handleSubmit = async () => {
    const result = await dispatch(createScheda(formData));
    
    if (result.meta.requestStatus === 'fulfilled') {
      Alert.alert('Successo', 'Scheda creata');
      router.back();
    }
  };
  
  return (
    <View>
      <TextInput 
        placeholder="Protocollo"
        value={formData.protocollo}
        onChangeText={(text) => setFormData({ ...formData, protocollo: text })}
      />
      
      <Button title="Salva" onPress={handleSubmit} disabled={loading} />
      
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
}
```

**2. Redux Slice:**
```typescript
// store/slices/schedeSlice.ts
export const createScheda = createAsyncThunk(
  'schede/create',
  async (data: Partial<Scheda>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const idtecnico = state.auth.user?.id;
      
      const response = await apiClient.post('/services/ajax.php',
        new URLSearchParams({
          mode: 'savescheda',
          idtecnico: String(idtecnico),
          ...data
        }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.errors?.reason);
      }
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const schedeSlice = createSlice({
  name: 'schede',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createScheda.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createScheda.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // Aggiungi all'inizio
      })
      .addCase(createScheda.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});
```

**3. Backend PHP:**
```php
// services/ajax.php
if ($_REQUEST['mode'] == 'savescheda') {
    $idtecnico = $_REQUEST['idtecnico'];
    $protocollo = $_REQUEST['protocollo'];
    $idsito = $_REQUEST['idsito'];
    $motivo = $_REQUEST['motivo'];
    $data_sopralluogo = $_REQUEST['data_sopralluogo'];
    
    // Validate
    if (empty($protocollo) || empty($idsito)) {
        echo json_encode([
            'success' => false,
            'errors' => ['reason' => 'Dati mancanti']
        ]);
        exit();
    }
    
    // Insert
    $db = new CRUD($connection);
    $db->SQL("SET search_path TO simfito");
    
    $sql = "INSERT INTO schede 
            (protocollo, idsito, idtecnico, motivo, data_sopralluogo, stato) 
            VALUES 
            ('$protocollo', $idsito, $idtecnico, '$motivo', '$data_sopralluogo', '0')
            RETURNING idscheda";
    
    $result = $db->Read($sql);
    $row = $db->fetch_assoc();
    
    if ($row) {
        echo json_encode([
            'success' => true,
            'data' => [
                'idscheda' => $row['idscheda'],
                'protocollo' => $protocollo,
                'stato' => '0',
                'statodesc' => 'In attesa'
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'errors' => ['reason' => 'Errore durante il salvataggio']
        ]);
    }
}
```

---

## 🚀 Performance Optimization

### 1. FlatList Optimization

```typescript
<FlatList
  data={schede}
  renderItem={({ item }) => <SchedaItem item={item} />}
  keyExtractor={(item) => item.idscheda.toString()}
  
  // Performance optimizations
  removeClippedSubviews={true}              // Unmount off-screen items
  maxToRenderPerBatch={10}                  // Render 10 items per batch
  updateCellsBatchingPeriod={50}            // Batch updates every 50ms
  windowSize={10}                           // Keep 10 screens worth in memory
  initialNumToRender={20}                   // Render 20 items initially
  
  // Avoid re-renders
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### 2. React.memo per Components

```typescript
const SchedaItem = React.memo(({ item, onPress }: SchedaItemProps) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.idscheda)}>
      <Text>{item.protocollo}</Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Re-render solo se item.idscheda cambia
  return prevProps.item.idscheda === nextProps.item.idscheda;
});
```

### 3. Lazy Loading Images

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: allegato.url }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

---

## 📱 Platform-Specific Code

### Conditional Rendering

```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

---

## 🎓 Conclusioni

Questa applicazione dimostra:

1. **Architettura moderna**: React Native + Expo + Redux Toolkit
2. **Type safety**: TypeScript per prevenire errori
3. **Separazione delle responsabilità**: Frontend (UI) vs Backend (Business Logic)
4. **State management predittibile**: Redux con pattern consolidati
5. **Backend robusto**: PHP + PostgreSQL con schema multipli
6. **API RESTful**: Comunicazione client-server strutturata
7. **Best practices**: Error handling, optimistic updates, memoization

L'applicazione è scalabile, manutenibile e pronta per essere estesa con nuove funzionalità.
