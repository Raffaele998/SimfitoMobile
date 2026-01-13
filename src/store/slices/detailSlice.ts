import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
  async (params: { id: string; name: string } | string, { rejectWithValue }) => {
    try {
      // Handle both old format (string) and new format (object with id and name)
      const id = typeof params === 'string' ? params : params.id;
      const name = typeof params === 'string' ? params : params.name;

      // Use 'parassitinew' mode to fetch pest details by name (which is searchable)
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: 'parassitinew',
          query: name, // Search by organism name instead of pestcode
        },
      });

      // Extract data array and find matching item
      if (!response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
        return rejectWithValue('Elemento non trovato');
      }

      const item = response.data.data[0];
      
      // Transform to DetailItem format
      return {
        id: item.pestcode,
        code: item.pestcode,
        name: item.name,
        type: 'pest',
        names: { full_name: item.name },
        description: `Osservazioni: ${item.totale}`,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Errore nel caricamento dei dettagli'
      );
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
