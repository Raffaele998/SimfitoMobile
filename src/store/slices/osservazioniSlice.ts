import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Osservazione {
  idosservazioni: string;
  scheda_id?: string;
  protocollo?: string;
  data_osservazione?: string;
  // Campi dal backend web app
  ospite?: string;  // alias di a.full_name nel backend
  parassita?: string;  // alias di b.full_name nel backend
  presente?: string;  // stato: 'presente', 'non presente', 'da verificare'
  rilevato?: number;
  sospetti?: string;  // note/sospetti
  nome_intensity?: string;
  nome_grado?: string;
  completa?: string;
  // Campi legacy per compatibilità
  pestcode?: string;
  nome_parassita?: string;
  hostcode?: string;
  nome_ospite?: string;
  stato?: string;
  catture?: string;
  note?: string;
  localita?: string;
  data_sopralluogo?: string;
  [key: string]: any; // Allow other fields from backend
}

interface OsservazioniState {
  items: Osservazione[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  filters: {
    pestcode?: string;
    stato?: string;
    searchText?: string;
  };
}

const initialState: OsservazioniState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  selectedId: null,
  filters: {},
};

export const fetchOsservazioni = createAsyncThunk(
  'osservazioni/fetch',
  async (
    { userId, limit = 100, start = 0, filters }: 
    { userId: string; limit?: number; start?: number; filters?: any },
    { rejectWithValue }
  ) => {
    try {
      const params: any = {
        mode: 'osservazioni',
        idTecnico: userId,
        limit,
        start,
      };

      // Add filters if provided
      if (filters?.scheda_id) {
        params.idscheda = filters.scheda_id;
      }
      if (filters?.pestcode) {
        params.pestcode = filters.pestcode;
      }
      if (filters?.stato) {
        params.stato = filters.stato;
      }

      const response = await apiClient.get('/services/ajax.php', {
        params,
      });

      // Check response structure
      if (!response.data.data || !Array.isArray(response.data.data)) {
        return rejectWithValue('Invalid response format');
      }

      return {
        records: response.data.data,
        total: response.data.results || response.data.data.length,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Errore nel caricamento delle osservazioni'
      );
    }
  }
);

export const fetchOsservazioniCatture = createAsyncThunk(
  'osservazioni/fetchCatture',
  async (
    { userId, limit = 100, start = 0 }: 
    { userId: string; limit?: number; start?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: 'osservazionicatture',
          idTecnico: userId,
          limit,
          start,
        },
      });

      // Check response structure
      if (!response.data.data || !Array.isArray(response.data.data)) {
        return rejectWithValue('Invalid response format');
      }

      return {
        records: response.data.data,
        total: response.data.results || response.data.data.length,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Errore nel caricamento delle catture'
      );
    }
  }
);

const osservazioniSlice = createSlice({
  name: 'osservazioni',
  initialState,
  reducers: {
    setSelectedOsservazione: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearOsservazioni: (state) => {
      state.items = [];
      state.selectedId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOsservazioni.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOsservazioni.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.records;
        state.total = action.payload.total;
      })
      .addCase(fetchOsservazioni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOsservazioniCatture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOsservazioniCatture.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.records;
        state.total = action.payload.total;
      })
      .addCase(fetchOsservazioniCatture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedOsservazione, setFilters, clearFilters, clearOsservazioni } = osservazioniSlice.actions;
export const selectOsservazioni = (state: any) => state.osservazioni;
export default osservazioniSlice.reducer;
