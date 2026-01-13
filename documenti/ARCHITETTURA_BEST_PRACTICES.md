# 🏗 ARCHITETTURA DETTAGLIATA & BEST PRACTICES

**Progetto:** SIMFITO Mobile App  
**Framework:** React Native + Expo  
**Data:** 9 Gennaio 2026

---

## 📐 ARCHITETTURA A STRATI

```
┌─────────────────────────────────────────────────────┐
│         PRESENTATION LAYER (Screens & UI)           │
│  ┌──────────┬──────────┬──────────┬──────────┐     │
│  │ SearchUI │ DetailUI │  MapsUI  │ Reports  │     │
│  └──────────┴──────────┴──────────┴──────────┘     │
├─────────────────────────────────────────────────────┤
│         STATE MANAGEMENT LAYER (Redux)              │
│  ┌────────────┬────────────┬────────────┐          │
│  │   Search   │   Details  │ Bookmarks  │          │
│  │   Slices   │   Slices   │   Slices   │          │
│  └────────────┴────────────┴────────────┘          │
├─────────────────────────────────────────────────────┤
│           BUSINESS LOGIC LAYER (Hooks)              │
│  ┌────────────┬────────────┬────────────┐          │
│  │ useSearch  │ useDetail  │ useOffline │          │
│  │ useAuth    │ useExport  │ useMaps    │          │
│  └────────────┴────────────┴────────────┘          │
├─────────────────────────────────────────────────────┤
│          DATA ACCESS LAYER (Services)               │
│  ┌────────────┬────────────┬────────────┐          │
│  │ API Client │  Database  │  Storage   │          │
│  │ (HTTP)     │  (SQLite)  │ (Keychain) │          │
│  └────────────┴────────────┴────────────┘          │
├─────────────────────────────────────────────────────┤
│        EXTERNAL SERVICES (APIs, DB, Maps)           │
│  ┌────────────┬────────────┬────────────┐          │
│  │ Backend PHP│  MySQL DB  │   Maps API │          │
│  │ Services   │ (simfito4) │ (Google)   │          │
│  └────────────┴────────────┴────────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW PATTERN

### Scenario: User Search

```
USER INPUT (SearchBar)
    ↓
[SearchScreen] component dispatches action
    ↓
Redux store (searchSlice)
    ↓
Thunk middleware (async action)
    ↓
API Service (axios call to backend)
    ↓
Backend PHP (simfito4)
    ↓
MySQL Database
    ↓
Response → JSON
    ↓
Redux reducer updates state
    ↓
Cache stored (AsyncStorage)
    ↓
Component re-renders with results
    ↓
UI displays results
```

### Code Example:
```typescript
// 1. User types in SearchBar
<SearchBar 
  value={query}
  onChangeText={(text) => dispatch(setSearchQuery(text))}
/>

// 2. Dispatch async thunk
dispatch(fetchSearchResults(searchParams))

// 3. Thunk in searchSlice
fetchSearchResults: async (params) => {
  const response = await searchAPI.search(params)
  // Cache result
  await cacheService.saveResults(response)
  return response
}

// 4. Reducer updates state
state.results = action.payload
state.loading = false
```

---

## 🎯 FILE STRUCTURE CONVENTIONS

### 1. Screens (Container Components)

```typescript
// src/screens/Search/SearchScreen.tsx

import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchSearchResults, selectSearchResults } from '@store/slices/searchSlice';
import { SearchBar } from '@components/Common/SearchBar';
import { ResultItem } from '@components/Search/ResultItem';

export const SearchScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { results, loading, error } = useAppSelector(selectSearchResults);
  const [query, setQuery] = React.useState('');

  useEffect(() => {
    if (query.trim()) {
      dispatch(fetchSearchResults({ query, limit: 20 }));
    }
  }, [query]);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar value={query} onChangeText={setQuery} />
      <FlatList
        data={results}
        renderItem={({ item }) => <ResultItem item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
```

**Principi:**
- Screens connessi a Redux via selectors
- Orchestrano logica e componenti
- Gestiscono navigation e effects
- Minimal styling (usa theme)

---

### 2. Components (Presentational)

```typescript
// src/components/Search/ResultItem.tsx

import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EPPO } from '@types/index';
import { styles } from './ResultItem.styles';

interface ResultItemProps {
  item: EPPO.Item;
  onPress?: (item: EPPO.Item) => void;
}

export const ResultItem: React.FC<ResultItemProps> = ({ 
  item, 
  onPress 
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    onPress?.(item);
    navigation.navigate('Detail', { id: item.id });
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>{item.code}</Text>
    </TouchableOpacity>
  );
};
```

**Principi:**
- Pure presentational
- Props-driven
- No Redux dependency
- Fully reusable
- Exported as named exports

---

### 3. Redux Slices (State Management)

```typescript
// src/store/slices/searchSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/index';
import { searchAPI } from '@services/api/search';
import { EPPO } from '@types/index';

interface SearchState {
  results: EPPO.Item[];
  loading: boolean;
  error: string | null;
  query: string;
  filters: SearchFilters;
  page: number;
  total: number;
}

const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
  query: '',
  filters: {},
  page: 1,
  total: 0,
};

// Async thunk
export const fetchSearchResults = createAsyncThunk(
  'search/fetchResults',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const response = await searchAPI.search(params);
      // Cache results
      await storageService.saveResults(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.page = 1; // Reset pagination
    },
    setFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.filters = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectSearchResults = (state: RootState) => ({
  results: state.search.results,
  loading: state.search.loading,
  error: state.search.error,
  total: state.search.total,
  query: state.search.query,
});

export const selectSearchQuery = (state: RootState) => state.search.query;

export const { setSearchQuery, setFilters, setPagination, clearSearch } =
  searchSlice.actions;

export default searchSlice.reducer;
```

**Principi:**
- Slice-per-feature pattern
- Async thunks per side effects
- Normalized state shape
- Memoized selectors

---

### 4. Custom Hooks (Business Logic)

```typescript
// src/hooks/useSearch.ts

import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchSearchResults, selectSearchQuery } from '@store/slices/searchSlice';
import { debounce } from '@utils/debounce';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectSearchQuery);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.trim().length > 2) {
        await dispatch(fetchSearchResults({ query: searchQuery }));
        setHasSearched(true);
      }
    }, 300),
    [dispatch]
  );

  const handleSearchChange = useCallback((text: string) => {
    debouncedSearch(text);
  }, [debouncedSearch]);

  return {
    query,
    handleSearchChange,
    hasSearched,
  };
};
```

**Principi:**
- Encapsulate business logic
- Reusable across components
- Custom hooks pattern
- Easy to test

---

### 5. API Services

```typescript
// src/services/api/search.ts

import { axiosInstance } from './client';
import { EPPO } from '@types/index';

export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  items: EPPO.Item[];
  total: number;
  page: number;
}

export const searchAPI = {
  // Search items
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await axiosInstance.get<SearchResponse>(
      '/services/search.php',
      { params }
    );
    return response.data;
  },

  // Get item detail
  getDetail: async (id: string): Promise<EPPO.DetailItem> => {
    const response = await axiosInstance.get<EPPO.DetailItem>(
      `/services/detail.php`,
      { params: { id } }
    );
    return response.data;
  },

  // Get relations
  getRelations: async (id: string): Promise<EPPO.Relation[]> => {
    const response = await axiosInstance.get<EPPO.Relation[]>(
      `/services/relations.php`,
      { params: { id } }
    );
    return response.data;
  },
};
```

**Principi:**
- Separate API service per feature
- Type-safe responses
- Centralized axios config
- Error handling via interceptors

---

### 6. Database/Storage Layer

```typescript
// src/services/storage/sqlite.ts

import * as SQLite from 'expo-sqlite';
import { EPPO } from '@types/index';

const db = SQLite.openDatabase('simfito.db');

export const sqliteService = {
  // Initialize tables
  init: async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS search_results (
        id TEXT PRIMARY KEY,
        code TEXT,
        name TEXT,
        data JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        item_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_search_code ON search_results(code);
    `);
  },

  // Save search results
  saveResults: async (results: EPPO.Item[]) => {
    const values = results.map(item => [
      item.id,
      item.code,
      item.name,
      JSON.stringify(item),
    ]);

    await db.execAsync(
      'INSERT OR REPLACE INTO search_results (id, code, name, data) VALUES (?, ?, ?, ?)',
      values
    );
  },

  // Query local results
  queryResults: async (query: string): Promise<EPPO.Item[]> => {
    const results = await db.getAllAsync<EPPO.Item>(
      'SELECT json(data) as data FROM search_results WHERE code LIKE ? OR name LIKE ? LIMIT 50',
      [`%${query}%`, `%${query}%`]
    );
    return results;
  },

  // Bookmark management
  addBookmark: async (itemId: string) => {
    await db.runAsync(
      'INSERT OR IGNORE INTO bookmarks (id, item_id) VALUES (?, ?)',
      [new Date().getTime().toString(), itemId]
    );
  },

  getBookmarks: async (): Promise<string[]> => {
    const results = await db.getAllAsync<{ item_id: string }>(
      'SELECT DISTINCT item_id FROM bookmarks ORDER BY created_at DESC'
    );
    return results.map(r => r.item_id);
  },
};
```

**Principi:**
- Async/await pattern
- Type-safe DB operations
- Query optimization (indexes)
- Transaction support

---

## 🧪 TESTING STRATEGY

### Unit Tests (Reducers)

```typescript
// src/store/slices/__tests__/searchSlice.test.ts

import { configureStore } from '@reduxjs/toolkit';
import searchReducer, { 
  setSearchQuery, 
  fetchSearchResults 
} from '../searchSlice';

describe('searchSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { search: searchReducer } });
  });

  test('setSearchQuery updates query', () => {
    store.dispatch(setSearchQuery('test query'));
    expect(store.getState().search.query).toBe('test query');
  });

  test('fetchSearchResults.pending sets loading', () => {
    const action = { type: fetchSearchResults.pending.type };
    const state = searchReducer(undefined, action);
    expect(state.loading).toBe(true);
  });

  test('fetchSearchResults.fulfilled sets results', () => {
    const payload = { items: [{ id: '1', name: 'Test' }], total: 1 };
    const action = { type: fetchSearchResults.fulfilled.type, payload };
    const state = searchReducer(undefined, action);
    expect(state.results).toEqual(payload.items);
    expect(state.loading).toBe(false);
  });
});
```

### Component Tests

```typescript
// src/components/Search/__tests__/ResultItem.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ResultItem } from '../ResultItem';

describe('ResultItem', () => {
  const mockItem = {
    id: '1',
    code: 'EPPO-001',
    name: 'Test Item',
  };

  test('renders item name and code', () => {
    const { getByText } = render(<ResultItem item={mockItem} />);
    expect(getByText('Test Item')).toBeTruthy();
    expect(getByText('EPPO-001')).toBeTruthy();
  });

  test('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <ResultItem item={mockItem} onPress={onPress} />
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledWith(mockItem);
  });
});
```

### Integration Tests

```typescript
// src/screens/Search/__tests__/SearchScreen.integration.test.ts

import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { SearchScreen } from '../SearchScreen';
import * as searchAPI from '@services/api/search';

jest.mock('@services/api/search');

describe('SearchScreen Integration', () => {
  test('searches and displays results', async () => {
    const mockResults = {
      items: [{ id: '1', name: 'Pest 1' }],
      total: 1,
    };
    
    searchAPI.search.mockResolvedValue(mockResults);

    const { getByPlaceholderText, getByText } = render(<SearchScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Search...'), 'test');

    await waitFor(() => {
      expect(getByText('Pest 1')).toBeTruthy();
    });
  });
});
```

---

## 🔒 SECURITY BEST PRACTICES

### 1. Token Management

```typescript
// src/services/storage/secureStorage.ts

import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  saveToken: async (token: string) => {
    await SecureStore.setItemAsync('auth_token', token);
  },

  getToken: async () => {
    return await SecureStore.getItemAsync('auth_token');
  },

  deleteToken: async () => {
    await SecureStore.deleteItemAsync('auth_token');
  },
};
```

### 2. API Client Security

```typescript
// src/services/api/client.ts

import axios from 'axios';
import { secureStorage } from '@services/storage/secureStorage';

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  // SSL pinning (platform specific)
  httpsAgent: {
    // Android/iOS certificate pinning
  },
});

// Add auth interceptor
axiosInstance.interceptors.request.use(async (config) => {
  const token = await secureStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      const newToken = await refreshToken();
      // Retry request
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
```

### 3. Input Validation

```typescript
// src/utils/validators.ts

import { z } from 'zod';

export const searchParamsSchema = z.object({
  query: z.string().min(1).max(100),
  filters: z.record(z.any()).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export const validateSearchParams = (params: unknown) => {
  try {
    return searchParamsSchema.parse(params);
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
};
```

---

## 📊 PERFORMANCE OPTIMIZATION

### 1. Lazy Loading

```typescript
// src/navigation/RootNavigator.tsx

import React, { Suspense } from 'react';
import { Loading } from '@components/Common/Loading';

const SearchScreen = React.lazy(() => 
  import('@screens/Search/SearchScreen')
    .then(m => ({ default: m.SearchScreen }))
);

export const RootNavigator = () => (
  <Suspense fallback={<Loading />}>
    {/* Navigation screens */}
  </Suspense>
);
```

### 2. Memoization

```typescript
// Prevent unnecessary re-renders

import React, { memo, useCallback } from 'react';

export const ResultItem = memo(({ item, onPress }: Props) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <TouchableOpacity onPress={handlePress}>
      {/* Render */}
    </TouchableOpacity>
  );
}, (prev, next) => {
  // Custom equality check
  return prev.item.id === next.item.id;
});
```

### 3. FlatList Optimization

```typescript
// Optimized list rendering

<FlatList
  data={results}
  renderItem={({ item }) => <ResultItem item={item} />}
  keyExtractor={(item) => item.id}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: 70,
    offset: 70 * index,
    index,
  })}
/>
```

---

## 🌍 LOCALIZATION PATTERN

```typescript
// src/locale/i18n.ts

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import itTranslations from './locales/it.json';
import enTranslations from './locales/en.json';
// ... import 73 other EPPO languages

i18next
  .use(initReactI18next)
  .init({
    defaultLanguage: getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    resources: {
      it: { translation: itTranslations },
      en: { translation: enTranslations },
      // ... all 75 languages
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
```

---

## 🎨 DESIGN SYSTEM PATTERN

```typescript
// src/theme/theme.ts

import { createTheme } from 'react-native-paper';
import { colors, typography, spacing } from './tokens';

export const lightTheme = createTheme({
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.danger,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
  },
});

export const darkTheme = createTheme({
  colors: {
    primary: colors.primary,
    secondary: '#FFFFFF',
    error: colors.danger,
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
  },
});

// Usage in component
const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: lightTheme.colors.background,
  },
  title: {
    fontSize: typography.h2.fontSize,
    color: lightTheme.colors.text,
  },
});
```

---

## 📈 MONITORING & ANALYTICS

```typescript
// src/services/analytics.ts

import * as Sentry from 'sentry-expo';

// Initialize Sentry
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_ENV,
});

// Analytics events
export const analytics = {
  trackScreenView: (screenName: string) => {
    Sentry.captureEvent({
      message: `Screen: ${screenName}`,
      level: 'info',
    });
  },

  trackSearch: (query: string, resultCount: number) => {
    Sentry.captureEvent({
      message: 'Search performed',
      level: 'info',
      contexts: { search: { query, resultCount } },
    });
  },

  trackError: (error: Error) => {
    Sentry.captureException(error);
  },
};
```

---

**Documento creato:** 9 Gennaio 2026
