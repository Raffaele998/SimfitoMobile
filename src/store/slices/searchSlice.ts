import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export const fetchSearchResults = createAsyncThunk(
  'search/fetchResults',
  async (
    { query, limit = 20, userId }: { query: string; limit?: number; userId?: string },
    { rejectWithValue }
  ) => {
    try {
      // Use 'parassitinew' mode to search for pests/diseases/hosts by name
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: 'parassitinew',
          query,
        },
      });
      
      // Extract data array from response
      if (!response.data.data || !Array.isArray(response.data.data)) {
        return rejectWithValue('Invalid response format');
      }
      
      // Transform backend response to match SearchResult interface
      const records = response.data.data.map((item: any) => ({
        id: item.pestcode || item.id,
        code: item.pestcode || item.code,
        name: item.name || item.full_name,
        type: 'pest', // Backend returns pests mainly
        description: item.name,
      })).slice(0, limit);
      
      return {
        records,
        total: response.data.results || records.length,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Ricerca fallita'
      );
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
