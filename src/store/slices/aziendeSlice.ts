import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Azienda, checkAzienda, CreateAziendaParams, createAzienda as createAziendaAPI } from '../../services/api/aziende';

interface AziendeState {
  currentAzienda: Azienda | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
}

const initialState: AziendeState = {
  currentAzienda: null,
  loading: false,
  error: null,
  creating: false,
};

export const verifyOrCreateAzienda = createAsyncThunk(
  'aziende/verifyOrCreate',
  async (params: CreateAziendaParams, { rejectWithValue }) => {
    try {
      // Prima verifica se esiste
      const existing = await checkAzienda(params.piva);

      if (existing) {
        return { azienda: existing, created: false };
      }

      // Se non esiste, la crea
      const result = await createAziendaAPI(params);

      if (!result.success) {
        return rejectWithValue('Errore nella creazione dell\'azienda');
      }

      // Ricarica l'azienda appena creata
      const newAzienda = await checkAzienda(params.piva);

      if (!newAzienda) {
        return rejectWithValue('Azienda creata ma non trovata');
      }

      return { azienda: newAzienda, created: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Errore nella gestione dell\'azienda'
      );
    }
  }
);

export const fetchAzienda = createAsyncThunk(
  'aziende/fetch',
  async (piva: string, { rejectWithValue }) => {
    try {
      const azienda = await checkAzienda(piva);

      if (!azienda) {
        return rejectWithValue('Azienda non trovata');
      }

      return azienda;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Errore nel caricamento dell\'azienda'
      );
    }
  }
);

const aziendeSlice = createSlice({
  name: 'aziende',
  initialState,
  reducers: {
    clearAzienda: (state) => {
      state.currentAzienda = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOrCreateAzienda.pending, (state) => {
        state.loading = true;
        state.creating = true;
        state.error = null;
      })
      .addCase(verifyOrCreateAzienda.fulfilled, (state, action) => {
        state.loading = false;
        state.creating = false;
        state.currentAzienda = action.payload.azienda;
      })
      .addCase(verifyOrCreateAzienda.rejected, (state, action) => {
        state.loading = false;
        state.creating = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAzienda.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAzienda.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAzienda = action.payload;
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
