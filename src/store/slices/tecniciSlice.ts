import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Tecnico {
  id_tecnico: number;
  nome: string;
  cognome?: string;
  nome_tecnico?: string;
  tipotecnico?: string;
}

interface SchedaTecnico extends Tecnico {
  id: number;
  idscheda: number;
}

interface TecniciState {
  allTecnici: Tecnico[];
  schedaTecnici: SchedaTecnico[];
  loading: boolean;
  error: string | null;
}

const initialState: TecniciState = {
  allTecnici: [],
  schedaTecnici: [],
  loading: false,
  error: null,
};

// Fetch tutti i tecnici
export const fetchAllTecnici = createAsyncThunk(
  'tecnici/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/services/ajax.php?mode=tecnici');
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Errore nel caricamento tecnici');
    }
  }
);

// Fetch tecnici associati a una scheda
export const fetchSchedaTecnici = createAsyncThunk(
  'tecnici/fetchSchedaTecnici',
  async (idscheda: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/services/ajax.php?mode=scheda_tecnici&idscheda=${idscheda}`);
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Errore nel caricamento tecnici scheda');
    }
  }
);

// Associa un tecnico a una scheda
export const associaTecnico = createAsyncThunk(
  'tecnici/associa',
  async ({ idscheda, id_tecnico }: { idscheda: number; id_tecnico: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        '/services/ajax.php',
        `mode=associa_tecnico&idscheda=${idscheda}&id_tecnico=${id_tecnico}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      if (response.data.success) {
        return { idscheda, id_tecnico };
      } else {
        return rejectWithValue('Errore nell\'associazione');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Errore nell\'associazione tecnico');
    }
  }
);

// Rimuovi un tecnico da una scheda
export const rimuoviTecnico = createAsyncThunk(
  'tecnici/rimuovi',
  async ({ idscheda, id_tecnico }: { idscheda: number; id_tecnico: number }, { rejectWithValue }) => {
    try {
      console.log('rimuoviTecnico - Parametri:', { idscheda, id_tecnico });
      const response = await apiClient.post(
        '/services/ajax.php',
        `mode=rimuovi_tecnico&idscheda=${idscheda}&id_tecnico=${id_tecnico}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log('rimuoviTecnico - Response:', response.data);
      if (response.data.success) {
        return { idscheda, id_tecnico };
      } else {
        console.error('rimuoviTecnico - Errore:', response.data);
        return rejectWithValue('Errore nella rimozione');
      }
    } catch (error: any) {
      console.error('rimuoviTecnico - Eccezione:', error);
      return rejectWithValue(error.message || 'Errore nella rimozione tecnico');
    }
  }
);

const tecniciSlice = createSlice({
  name: 'tecnici',
  initialState,
  reducers: {
    clearSchedaTecnici: (state) => {
      state.schedaTecnici = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tecnici
      .addCase(fetchAllTecnici.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTecnici.fulfilled, (state, action) => {
        state.loading = false;
        state.allTecnici = action.payload;
      })
      .addCase(fetchAllTecnici.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch scheda tecnici
      .addCase(fetchSchedaTecnici.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedaTecnici.fulfilled, (state, action) => {
        state.loading = false;
        state.schedaTecnici = action.payload;
      })
      .addCase(fetchSchedaTecnici.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Associa tecnico
      .addCase(associaTecnico.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(associaTecnico.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(associaTecnico.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Rimuovi tecnico
      .addCase(rimuoviTecnico.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rimuoviTecnico.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(rimuoviTecnico.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSchedaTecnici, clearError } = tecniciSlice.actions;
export const selectTecnici = (state: any) => state.tecnici;
export default tecniciSlice.reducer;
