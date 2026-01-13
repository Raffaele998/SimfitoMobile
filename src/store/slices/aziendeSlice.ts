import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Azienda {
  id_azienda: number;
  rag_soc: string;
  partita_iva: string;
  indirizzo?: string;
  cap?: string;
  comune?: string;
  provincia?: string;
  telefono?: string;
  email?: string;
  referente?: string;
}

interface AziendeState {
  items: Azienda[];
  loading: boolean;
  error: string | null;
}

const initialState: AziendeState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchAzienda = createAsyncThunk(
  'aziende/fetchAzienda',
  async (
    { piva }: { piva: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: 'azienda',
          piva,
        },
      });

      if (!response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
        return rejectWithValue('Azienda non trovata');
      }

      return response.data.data[0];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Errore nel caricamento dei dati azienda'
      );
    }
  }
);

const aziendeSlice = createSlice({
  name: 'aziende',
  initialState,
  reducers: {
    clearAzienda: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAzienda.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAzienda.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload];
      })
      .addCase(fetchAzienda.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAzienda } = aziendeSlice.actions;
export const selectAziende = (state: any) => state.aziende;
export default aziendeSlice.reducer;
