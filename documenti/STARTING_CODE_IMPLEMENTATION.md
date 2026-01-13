# 💻 STARTING CODE - REACT NATIVE IMPLEMENTATION

**Per:** Developer  
**Basato su:** SIMFITO_REVERSE_ENGINEERING.md  
**Data:** 9 Gennaio 2026

---

## 🎯 FASE 1: SETUP DELLE API

### Step 1: Crea API Client (come ajax.php per web)

**File:** `src/services/api/client.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://your-simfito-server.org';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor per aggiungere token
apiClient.interceptors.request.use(async (config) => {
  const token = await getStoredToken();
  if (token) {
    config.params = config.params || {};
    config.params.token = token;
  }
  return config;
});

// Interceptor per errori
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token scaduto - fai refresh
    }
    return Promise.reject(error);
  }
);
```

---

### Step 2: Crea Service per Search (come ajax.php?action=search)

**File:** `src/services/api/search.ts`

```typescript
import { apiClient } from './client';

export interface SearchParams {
  query: string;
  type?: 'eppo' | 'pest' | 'plant' | 'disease';
  language?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  id: string;
  code: string;
  name: string;
  type: string;
  description?: string;
}

export interface SearchResponse {
  success: boolean;
  records: SearchResult[];
  total: number;
}

export const searchAPI = {
  // Equivalente a: GET /services/ajax.php?action=search
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await apiClient.get<SearchResponse>(
      '/services/ajax.php',
      {
        params: {
          action: 'search',
          ...params,
        },
      }
    );
    return response.data;
  },

  // Equivalente a: GET /services/ajax.php?action=getDetail
  getDetail: async (id: string): Promise<DetailItem> => {
    const response = await apiClient.get<{success: boolean; item: DetailItem}>(
      '/services/ajax.php',
      {
        params: {
          action: 'getDetail',
          id,
        },
      }
    );
    return response.data.item;
  },

  // Equivalente a: GET /services/ajax.php?action=getRelations
  getRelations: async (
    id: string,
    type: 'host' | 'pest'
  ): Promise<Relation[]> => {
    const response = await apiClient.get<{success: boolean; relations: Relation[]}>(
      '/services/ajax.php',
      {
        params: {
          action: 'getRelations',
          id,
          type,
        },
      }
    );
    return response.data.relations;
  },
};

// Tipi per Detail View
export interface DetailItem {
  id: string;
  code: string;
  names: Record<string, string>; // 75 languages
  taxonomy: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
    species?: string;
  };
  relations: {
    hosts: Relation[];
    pests: Relation[];
  };
  authorities: Authority[];
  references: string[];
}

export interface Relation {
  id: string;
  code: string;
  name: string;
  type: 'host' | 'pest' | 'disease';
}

export interface Authority {
  id: string;
  name: string;
  url?: string;
}
```

---

### Step 3: Crea Service per Authentication

**File:** `src/services/api/auth.ts`

```typescript
import { apiClient } from './client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export const authAPI = {
  // Equivalente a: POST /services/login.php
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/services/login.php',
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Call backend logout if needed
    await apiClient.post('/services/logout.php');
  },

  refreshToken: async (token: string): Promise<{token: string}> => {
    const response = await apiClient.post<{token: string}>(
      '/services/refresh-token.php',
      {token}
    );
    return response.data;
  },
};
```

---

## 🎯 FASE 2: SETUP REDUX STATE (come Stores in ExtJS)

### Step 4: Crea Redux Slice per Search

**File:** `src/store/slices/searchSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchAPI, SearchParams, SearchResult } from '@services/api/search';

// Async thunk (come Store.load() in ExtJS)
export const fetchSearchResults = createAsyncThunk(
  'search/fetchResults',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const response = await searchAPI.search(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface SearchState {
  // Dati
  results: SearchResult[];
  total: number;
  
  // Stato UI
  loading: boolean;
  error: string | null;
  
  // Query attuali
  query: string;
  filters: {
    type?: string;
    language?: string;
  };
  page: number;
  limit: number;
  
  // Cache
  searchHistory: string[];
}

const initialState: SearchState = {
  results: [],
  total: 0,
  loading: false,
  error: null,
  query: '',
  filters: {},
  page: 1,
  limit: 20,
  searchHistory: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Azioni sincrone (come store.fireEvent in ExtJS)
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.page = 1; // Reset pagination
    },
    
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    
    setPagination: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    
    clearSearch: (state) => {
      state.results = [];
      state.query = '';
      state.filters = {};
    },
    
    addToHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload;
      state.searchHistory = [
        query,
        ...state.searchHistory.filter(q => q !== query),
      ].slice(0, 10);
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Pending state
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Success state
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.records;
        state.total = action.payload.total;
      })
      // Error state
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Esporta actions (usa questi nei components)
export const { setQuery, setFilters, setPagination, clearSearch, addToHistory } =
  searchSlice.actions;

// Esporta selectors (usa questi per accedere lo stato)
export const selectSearchResults = (state: any) => ({
  results: state.search.results,
  total: state.search.total,
  loading: state.search.loading,
  error: state.search.error,
  query: state.search.query,
  page: state.search.page,
});

export const selectSearchHistory = (state: any) => state.search.searchHistory;

export default searchSlice.reducer;
```

---

### Step 5: Crea Redux Slice per Detail

**File:** `src/store/slices/detailSlice.ts`

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchAPI, DetailItem } from '@services/api/search';

export const fetchDetailItem = createAsyncThunk(
  'detail/fetchItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const item = await searchAPI.getDetail(id);
      const relations = await Promise.all([
        searchAPI.getRelations(id, 'host'),
        searchAPI.getRelations(id, 'pest'),
      ]);
      
      item.relations = {
        hosts: relations[0],
        pests: relations[1],
      };
      
      return item;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface DetailState {
  item: DetailItem | null;
  loading: boolean;
  error: string | null;
  bookmarked: boolean;
  selectedLanguage: string;
}

const initialState: DetailState = {
  item: null,
  loading: false,
  error: null,
  bookmarked: false,
  selectedLanguage: 'it',
};

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    toggleBookmark: (state) => {
      state.bookmarked = !state.bookmarked;
    },
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

export const { setSelectedLanguage, toggleBookmark, clearDetail } = detailSlice.actions;
export const selectDetail = (state: any) => state.detail;
export default detailSlice.reducer;
```

---

## 🎯 FASE 3: CREA COMPONENTS (come Views in ExtJS)

### Step 6: Search Screen (come Grid in ExtJS)

**File:** `src/screens/SearchScreen.tsx`

```typescript
import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchSearchResults,
  setQuery,
  selectSearchResults,
  addToHistory,
} from '@/store/slices/searchSlice';
import { SearchResultItem } from '@/components/Search/SearchResultItem';
import { debounce } from '@/utils/debounce';

export const SearchScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { results, total, loading, query } = useAppSelector(selectSearchResults);

  // Debounced search
  const performSearch = React.useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim().length > 2) {
        dispatch(fetchSearchResults({ query: searchQuery, limit: 20 }));
        dispatch(addToHistory(searchQuery));
      }
    }, 300),
    [dispatch]
  );

  const handleSearch = (text: string) => {
    dispatch(setQuery(text));
    performSearch(text);
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Cerca pest, pianta, malattia..."
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor="#999"
      />

      {/* Loading State */}
      {loading && <ActivityIndicator size="large" color="#1976D2" />}

      {/* Results List (equivalente a Grid in ExtJS) */}
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <SearchResultItem item={item} />
        )}
        keyExtractor={(item) => item.id}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={
          !loading ? <Text>Nessun risultato trovato</Text> : null
        }
        ListFooterComponent={
          total > results.length ? (
            <View style={styles.footer}>
              <Text>Risultati: {results.length} di {total}</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});
```

---

### Step 7: Search Result Item Component

**File:** `src/components/Search/SearchResultItem.tsx`

```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@/store/hooks';
import { fetchDetailItem } from '@/store/slices/detailSlice';
import type { SearchResult } from '@/services/api/search';

interface Props {
  item: SearchResult;
}

export const SearchResultItem: React.FC<Props> = ({ item }) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const handlePress = async () => {
    // Fetch detail data quando utente clicca
    await dispatch(fetchDetailItem(item.id));
    // Navigate to detail screen
    navigation.navigate('Detail', { id: item.id });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.code}>{item.code}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.type}>{item.type}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  code: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginVertical: 4,
  },
  type: {
    fontSize: 12,
    color: '#666',
  },
});
```

---

### Step 8: Detail Screen (come Detail Panel in ExtJS)

**File:** `src/screens/DetailScreen.tsx`

```typescript
import React from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { selectDetail } from '@/store/slices/detailSlice';

export const DetailScreen: React.FC = () => {
  const { item, loading } = useAppSelector(selectDetail);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Elemento non trovato</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.title}>{item.names.it || item.names.en}</Text>
      </View>

      {/* Taxonomy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tassonomia</Text>
        {item.taxonomy.kingdom && (
          <View style={styles.row}>
            <Text style={styles.label}>Regno:</Text>
            <Text>{item.taxonomy.kingdom}</Text>
          </View>
        )}
        {item.taxonomy.family && (
          <View style={styles.row}>
            <Text style={styles.label}>Famiglia:</Text>
            <Text>{item.taxonomy.family}</Text>
          </View>
        )}
      </View>

      {/* Relations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relazioni Host</Text>
        {item.relations.hosts.map((host) => (
          <Text key={host.id} style={styles.relation}>
            • {host.name}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relazioni Pest</Text>
        {item.relations.pests.map((pest) => (
          <Text key={pest.id} style={styles.relation}>
            • {pest.name}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  label: {
    fontWeight: '600',
    width: 100,
  },
  relation: {
    paddingVertical: 4,
    fontSize: 14,
  },
});
```

---

## 🚀 PROSSIMI STEP

Dopo aver completato questi 8 step:

1. **Setup completo:**
   - Crea il resto dei Redux slices (auth, settings, etc)
   - Crea tutti i service file (geospatial, export, etc)

2. **UI completa:**
   - Crea Navigation (RootNavigator, TabNavigator)
   - Completa tutti gli schermi
   - Setup tema

3. **Testing:**
   - Unit tests per Redux slices
   - Component tests
   - API integration tests

4. **Deployment:**
   - Build Android + iOS
   - Test su device reali
   - Submit app stores

---

**Documento creato:** 9 Gennaio 2026  
**Prossimo file da leggere:** TIMELINE_MILESTONES_MOBILE.md (per scheduling)
