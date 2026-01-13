import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Azienda, checkAzienda, createAzienda as createAziendaAPI, CreateAziendaParams, getAllAziende, getAziende } from '../../services/api/aziende';

interface AziendeState {
  items: Azienda[];
  allItems: Azienda[]; // Tutte le aziende del sistema
  currentAzienda: Azienda | null;
  loading: boolean;
  loadingAll: boolean;
  error: string | null;
  creating: boolean;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
  filters: {
    searchText: string;
  };
}

const initialState: AziendeState = {
  items: [],
  allItems: [],
  currentAzienda: null,
  loading: false,
  loadingAll: false,
  error: null,
  creating: false,
  pagination: {
    currentPage: 1,
    pageSize: 50,
    total: 0,
  },
  filters: {
    searchText: '',
  },
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

export const fetchAziende = createAsyncThunk(
  'aziende/fetchAll',
  async (idTecnico: number, { rejectWithValue }) => {
    try {
      const aziende = await getAziende(idTecnico);
      return aziende;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Errore nel caricamento delle aziende'
      );
    }
  }
);

export const fetchAllAziende = createAsyncThunk(
  'aziende/fetchAllSystem',
  async (params: { searchText?: string; page?: number; pageSize?: number }, { rejectWithValue }) => {
    try {
      const query = params?.searchText;
      const pageSize = params?.pageSize || 50;
      const page = params?.page || 1;
      const start = (page - 1) * pageSize;
      
      const result = await getAllAziende(query, pageSize, start);
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Errore nel caricamento delle aziende'
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
    nextPage: (state) => {
      state.pagination.currentPage += 1;
    },
    previousPage: (state) => {
      if (state.pagination.currentPage > 1) {
        state.pagination.currentPage -= 1;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset alla prima pagina quando cambiano i filtri
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
      })
      .addCase(fetchAziende.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAziende.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAziende.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllAziende.pending, (state) => {
        state.loadingAll = true;
        state.error = null;
      })
      .addCase(fetchAllAziende.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.allItems = action.payload.aziende;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchAllAziende.rejected, (state, action) => {
        state.loadingAll = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAzienda, nextPage, previousPage, setFilters } = aziendeSlice.actions;
export const selectAziende = (state: any) => state.aziende;
export default aziendeSlice.reducer;
