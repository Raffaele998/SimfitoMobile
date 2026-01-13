import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface TipologiaSito {
  tipologiasito_id: number;
  tipologiasito: string;
  theme_id: number;
  theme: string;
  enabled: boolean;
  order: number;
}

interface TipologiaSitoState {
  items: TipologiaSito[];
  loading: boolean;
  error: string | null;
}

const initialState: TipologiaSitoState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTipologiaSito = createAsyncThunk(
  'tipologiasito/fetch',
  async ({ theme }: { theme: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: 'tipologiasito',
          theme,
        },
      });

      if (!response.data.data || !Array.isArray(response.data.data)) {
        return rejectWithValue('Invalid response format');
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Errore nel caricamento delle tipologie sito'
      );
    }
  }
);

const tipologiaSitoSlice = createSlice({
  name: 'tipologiasito',
  initialState,
  reducers: {
    clearTipologiaSito: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTipologiaSito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTipologiaSito.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTipologiaSito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTipologiaSito } = tipologiaSitoSlice.actions;
export const selectTipologiaSito = (state: any) => state.tipologiasito;
export default tipologiaSitoSlice.reducer;
