import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Scheda {
  idscheda: string;
  protocollo: string;
  data_sopralluogo: string;
  stato: string;
  statodesc: string;
  motivo: string;
  azienda: string;
  sito: string;
  comune: string;
  tecnici: string;
  numpositive?: string;
  totcatture?: string;
  allegati?: string;
}

interface SchemataState {
  items: Scheda[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  selectedScheda: Scheda | null;
  currentPage: number;
  pageSize: number;
}

const initialState: SchemataState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  selectedId: null,
  selectedScheda: null,
  currentPage: 1,
  pageSize: 50,
};

export const fetchSchede = createAsyncThunk(
  'schede/fetch',
  async (
    { userId, page = 1, pageSize = 50 }: { userId: string; page?: number; pageSize?: number },
    { rejectWithValue }
  ) => {
    try {
      const start = (page - 1) * pageSize;
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: 'app_schede',
          idTecnico: userId,
          limit: pageSize,
          start,
        },
      });

      // Check response structure
      if (!response.data.data || !Array.isArray(response.data.data)) {
        return rejectWithValue('Invalid response format');
      }

      return {
        records: response.data.data,
        total: parseInt(response.data.totaldata || '0', 10) || response.data.results || response.data.data.length,
        page,
        pageSize,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Errore nel caricamento delle schede'
      );
    }
  }
);

export const createScheda = createAsyncThunk(
  'schede/create',
  async (
    {
      idTecnico,
      motivo,
      data,
      id_sito,
      protocollo,
      note,
    }: {
      idTecnico: string;
      motivo: string;
      data: string;
      id_sito?: string;
      protocollo?: string;
      note?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/services/ajax-save-form.php', null, {
        params: {
          mode: 'scheda-generale',
          idTecnico,
          motivo,
          data,
          id_sito: id_sito || '',
          protocollo: protocollo || '',
          note: note || '',
        },
      });

      if (response.data.success) {
        return response.data.returned || response.data.idscheda;
      } else {
        return rejectWithValue('Errore durante la creazione della scheda');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Errore nella creazione della scheda'
      );
    }
  }
);

const schedeSlice = createSlice({
  name: 'schede',
  initialState,
  reducers: {
    setSelectedScheda: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
      // Find the scheda object from items
      state.selectedScheda = state.items.find((item) => item.idscheda === action.payload) || null;
    },
    clearSchede: (state) => {
      state.items = [];
      state.selectedId = null;
      state.selectedScheda = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    nextPage: (state) => {
      const maxPage = Math.ceil(state.total / state.pageSize);
      if (state.currentPage < maxPage) {
        state.currentPage += 1;
      }
    },
    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchede.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchede.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.records;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchSchede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createScheda.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createScheda.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createScheda.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedScheda, clearSchede, setPage, nextPage, previousPage } = schedeSlice.actions;
export const selectSchede = (state: any) => state.schede;
export default schedeSlice.reducer;
