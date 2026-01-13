# 🚀 REALIZZAZIONE APP MOBILE - GUIDA PASSO PASSO

**Per:** Developer - Realizzazione step-by-step  
**Tecnologia:** React Native + Expo  
**Data Inizio:** 9 Gennaio 2026

---

## 📋 PIANO GENERALE

### **PUNTO 1: Setup API + Redux State Management**
- Passo 1.1: Inizializzare progetto Expo
- Passo 1.2: Installare dipendenze necessarie
- Passo 1.3: Creare cartelle e struttura progetto
- Passo 1.4: Implementare API client
- Passo 1.5: Implementare Redux store
- Passo 1.6: Creare slices Redux

### **PUNTO 2: Setup Navigation + Schermi**
- Passo 2.1: Configurare React Navigation
- Passo 2.2: Creare Tab Navigator (Search, Detail, Settings)
- Passo 2.3: Creare Stack Navigator (Detail con parametri)
- Passo 2.4: Implementare SearchScreen
- Passo 2.5: Implementare DetailScreen
- Passo 2.6: Implementare SettingsScreen

### **PUNTO 3: Testing**
- Passo 3.1: Setup Jest + React Testing Library
- Passo 3.2: Test su emulatore
- Passo 3.3: Test su device reale

---

## ✅ PUNTO 1: SETUP API + REDUX

### **PASSO 1.1: Inizializzare progetto Expo**

**Comando da eseguire:**

```bash
npx create-expo-app SimfitoMobile
cd SimfitoMobile
```

**Cosa fa:**
- Crea cartella progetto `SimfitoMobile`
- Installa Expo CLI
- Setup base React Native

**Output atteso:**
```
✓ Created app
✓ Installed Expo
✓ Created package.json
```

---

### **PASSO 1.2: Installare dipendenze necessarie**

**Comando da eseguire:**

```bash
npm install \
  @reduxjs/toolkit \
  react-redux \
  axios \
  @react-navigation/native \
  @react-navigation/bottom-tabs \
  @react-navigation/stack \
  react-native-screens \
  react-native-safe-area-context \
  react-native-gesture-handler \
  @react-native-async-storage/async-storage \
  react-native-paper \
  @react-native-material/core \
  typescript \
  @types/react \
  @types/react-native

npm install --save-dev \
  jest \
  @testing-library/react-native \
  @types/jest \
  ts-node
```

**Cosa fa:**
- Installa Redux per state management
- Installa Navigation libreria
- Installa Axios per API calls
- Installa UI component library (Paper)
- Installa testing tools

**Verifica:**
```bash
npm list @reduxjs/toolkit react-redux axios
```

---

### **PASSO 1.3: Creare cartelle e struttura progetto**

**Comandi da eseguire:**

```bash
mkdir -p src/services/api
mkdir -p src/store/slices
mkdir -p src/store/hooks
mkdir -p src/screens
mkdir -p src/components
mkdir -p src/components/Search
mkdir -p src/components/Common
mkdir -p src/utils
mkdir -p src/types
mkdir -p __tests__/unit
mkdir -p __tests__/integration
```

**Struttura finale:**
```
SimfitoMobile/
├── src/
│   ├── services/
│   │   └── api/
│   │       ├── client.ts         ← API client (Axios)
│   │       ├── search.ts         ← Search API
│   │       ├── auth.ts           ← Login API
│   │       └── geospatial.ts     ← Maps API
│   ├── store/
│   │   ├── store.ts              ← Redux store configuration
│   │   ├── slices/
│   │   │   ├── searchSlice.ts
│   │   │   ├── detailSlice.ts
│   │   │   ├── authSlice.ts
│   │   │   └── settingsSlice.ts
│   │   └── hooks.ts              ← Custom useAppDispatch, useAppSelector
│   ├── screens/
│   │   ├── SearchScreen.tsx
│   │   ├── DetailScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   │   ├── Search/
│   │   │   └── SearchResultItem.tsx
│   │   └── Common/
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorMessage.tsx
│   ├── utils/
│   │   ├── debounce.ts
│   │   ├── storage.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx                   ← Entry point
│   └── RootNavigator.tsx         ← Navigation setup
├── __tests__/
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
└── jest.config.js
```

---

### **PASSO 1.4: Implementare API client**

**File:** `src/services/api/client.ts`

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-simfito-server.org'; // CAMBIA QUESTO

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere token
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.params = config.params || {};
      config.params.token = token;
    }
  } catch (error) {
    console.error('Error reading token from storage:', error);
  }
  return config;
});

// Interceptor per errori
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token scaduto - potremmo aggiungere refresh logic qui
      console.log('Token expired');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**Verifica:**
```bash
npm run build  # Controlla che non ci siano errori TypeScript
```

---

### **PASSO 1.5: Implementare Redux store**

**File:** `src/store/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import detailReducer from './slices/detailSlice';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    detail: detailReducer,
    auth: authReducer,
    settings: settingsReducer,
  },
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

**File:** `src/store/hooks.ts`

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

### **PASSO 1.6: Creare Redux slices**

**File:** `src/store/slices/searchSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@services/api/client';

export interface SearchResult {
  id: string;
  code: string;
  name: string;
  type: string;
  description?: string;
}

interface SearchState {
  results: SearchResult[];
  total: number;
  loading: boolean;
  error: string | null;
  query: string;
}

const initialState: SearchState = {
  results: [],
  total: 0,
  loading: false,
  error: null,
  query: '',
};

// Async thunk per fetch
export const fetchSearchResults = createAsyncThunk(
  'search/fetchResults',
  async (
    { query, limit = 20 }: { query: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          action: 'search',
          query,
          limit,
        },
      });
      
      if (!response.data.success) {
        return rejectWithValue('Search failed');
      }
      
      return {
        records: response.data.records,
        total: response.data.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.results = [];
      state.query = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.records;
        state.total = action.payload.total;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export const selectSearch = (state: any) => state.search;
export default searchSlice.reducer;
```

**File:** `src/store/slices/detailSlice.ts`

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@services/api/client';

export interface DetailItem {
  id: string;
  code: string;
  name: string;
  type: string;
  names: Record<string, string>;
  taxonomy?: any;
  relations?: any;
}

interface DetailState {
  item: DetailItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: DetailState = {
  item: null,
  loading: false,
  error: null,
};

export const fetchDetailItem = createAsyncThunk(
  'detail/fetchItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          action: 'getDetail',
          id,
        },
      });

      if (!response.data.success) {
        return rejectWithValue('Failed to fetch detail');
      }

      return response.data.item;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {
    clearDetail: (state) => {
      state.item = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailItem.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(fetchDetailItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDetail } = detailSlice.actions;
export const selectDetail = (state: any) => state.detail;
export default detailSlice.reducer;
```

**File:** `src/store/slices/authSlice.ts`

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@services/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/services/login.php', {
        username,
        password,
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Login failed');
      }

      // Salva token
      await AsyncStorage.setItem('authToken', response.data.token);

      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('authToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: any) => state.auth;
export default authSlice.reducer;
```

**File:** `src/store/slices/settingsSlice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: string;
  theme: 'light' | 'dark';
}

const initialState: SettingsState = {
  language: 'it',
  theme: 'light',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { setLanguage, setTheme } = settingsSlice.actions;
export const selectSettings = (state: any) => state.settings;
export default settingsSlice.reducer;
```

---

## ✅ PUNTO 2: SETUP NAVIGATION + SCHERMI

### **PASSO 2.1: Configurare React Navigation**

**File:** `src/RootNavigator.tsx`

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from './store/hooks';
import { selectAuth } from './store/slices/authSlice';

// Screens
import LoginScreen from './screens/LoginScreen';
import SearchScreen from './screens/SearchScreen';
import DetailScreen from './screens/DetailScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SearchStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1976D2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="SearchList"
        component={SearchScreen}
        options={{ title: 'Ricerca' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }: any) => ({
          title: route.params?.itemName || 'Dettagli',
        })}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="SearchStack"
        component={SearchStackNavigator}
        options={{
          title: 'Ricerca',
          tabBarLabel: 'Ricerca',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Impostazioni',
          tabBarLabel: 'Impostazioni',
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { token } = useAppSelector(selectAuth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ animationEnabled: false }}
          />
        ) : (
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ animationEnabled: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

### **PASSO 2.2 - 2.6: Implementare Screens**

**File:** `src/screens/LoginScreen.tsx`

```typescript
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, selectAuth } from '../store/slices/authSlice';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(selectAuth);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Errore', 'Inserisci username e password');
      return;
    }

    await dispatch(loginUser({ username, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIMFito Mobile</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;
```

**File:** `src/screens/SearchScreen.tsx`

```typescript
import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchSearchResults,
  setQuery,
  selectSearch,
} from '../store/slices/searchSlice';
import SearchResultItem from '../components/Search/SearchResultItem';
import { debounce } from '../utils/debounce';

const SearchScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { results, loading, error, query } = useAppSelector(selectSearch);

  // Debounced search
  const performSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim().length > 2) {
        dispatch(fetchSearchResults({ query: searchQuery }));
      }
    }, 500),
    [dispatch]
  );

  const handleSearch = (text: string) => {
    dispatch(setQuery(text));
    performSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Cerca pest, pianta, malattia..."
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor="#999"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading && <ActivityIndicator size="large" color="#1976D2" />}

      <FlatList
        data={results}
        renderItem={({ item }) => <SearchResultItem item={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <Text style={styles.empty}>Nessun risultato trovato</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    color: '#999',
  },
});

export default SearchScreen;
```

**File:** `src/screens/DetailScreen.tsx`

```typescript
import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectDetail, fetchDetailItem } from '../store/slices/detailSlice';

const DetailScreen: React.FC<any> = ({ route }) => {
  const dispatch = useAppDispatch();
  const { item, loading, error } = useAppSelector(selectDetail);
  const itemId = route.params?.id;

  useEffect(() => {
    if (itemId) {
      dispatch(fetchDetailItem(itemId));
    }
  }, [itemId, dispatch]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.center}>
        <Text>{error || 'Elemento non trovato'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.title}>{item.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informazioni</Text>
        <Text style={styles.text}>Tipo: {item.type}</Text>
      </View>

      {item.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrizione</Text>
          <Text style={styles.text}>{item.description}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  code: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default DetailScreen;
```

**File:** `src/screens/SettingsScreen.tsx`

```typescript
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, selectAuth } from '../store/slices/authSlice';
import { setLanguage, setTheme, selectSettings } from '../store/slices/settingsSlice';

const SettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { language, theme } = useAppSelector(selectSettings);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utente</Text>
        <View style={styles.item}>
          <Text style={styles.label}>Nome utente:</Text>
          <Text style={styles.value}>{user?.username || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lingua</Text>
        <View style={styles.item}>
          <Text style={styles.label}>Lingua:</Text>
          <Text style={styles.value}>{language}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tema</Text>
        <View style={styles.item}>
          <Text style={styles.label}>Dark mode:</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={(value) =>
              dispatch(setTheme(value ? 'dark' : 'light'))
            }
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => dispatch(logout())}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
```

---

### **PASSO 2.3: Creare component SearchResultItem**

**File:** `src/components/Search/SearchResultItem.tsx`

```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store/hooks';
import { fetchDetailItem } from '../../store/slices/detailSlice';
import type { SearchResult } from '../../store/slices/searchSlice';

interface Props {
  item: SearchResult;
}

const SearchResultItem: React.FC<Props> = ({ item }) => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const handlePress = () => {
    dispatch(fetchDetailItem(item.id));
    navigation.navigate('Detail', {
      id: item.id,
      itemName: item.name,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.code}>{item.code}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.type}>{item.type}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
    marginHorizontal: 4,
  },
  code: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginVertical: 4,
  },
  type: {
    fontSize: 12,
    color: '#666',
  },
});

export default SearchResultItem;
```

---

### **PASSO 2.4: Utility functions**

**File:** `src/utils/debounce.ts`

```typescript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
```

---

### **PASSO 2.5: App.tsx entry point**

**File:** `src/App.tsx`

```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './store/store';
import { RootNavigator } from './RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}
```

---

## 🎯 NEXT STEP

Ora devi eseguire questi comandi in sequenza:

```bash
# 1. Vai nella cartella
cd SimfitoMobile

# 2. Crea tutti i file che abbiamo listato sopra
# (scegli editor: VS Code, etc)

# 3. Verifica dipendenze
npm list

# 4. Avvia app su emulatore
npx expo start

# Poi premi:
# - 'a' per Android emulator
# - 'i' per iOS simulator
# - 'w' per web (testing rapido)
```

---

**Sei pronto a iniziare? Dimmi quando hai completato il PASSO 1 e 2, poi passiamo al PUNTO 3 (Testing).**
