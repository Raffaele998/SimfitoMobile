import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Sito {
  idsito: string;
  denominazione: string;
  comune: string;
  provincia: string;
  region: string;
  indirizzo?: string;
  sito?: string;
  telono?: string;
  email?: string;
}

interface SitiState {
  items: Sito[];
  selectedSito: Sito | null;
  loading: boolean;
  error: string | null;
  filters: {
    searchText: string;
    provincia?: string;
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

const initialState: SitiState = {
  items: [],
  selectedSito: null,
  loading: false,
  error: null,
  filters: {
    searchText: '',
  },
  pagination: {
    currentPage: 1,
    pageSize: 50,
    total: 0,
  },
};

export const fetchSiti = createAsyncThunk(
  'siti/fetch',
  async (
    {
      userId,
      searchText = '',
      page = 1,
      pageSize = 50,
    }: { userId: string; searchText?: string; page?: number; pageSize?: number },
    { rejectWithValue },
  ) => {
    try {
      const start = (page - 1) * pageSize;
      const params: any = {
        mode: 'siti1',
        idTecnico: userId,
        limit: pageSize,
        start,
      };

      if (searchText) {
        params.query = searchText;
      }

      const response = await apiClient.get('/services/ajax.php', {
        params,
      });

      const data = response.data?.data || response.data || [];
      const itemsArray = Array.isArray(data) ? data : [];

      return {
        items: itemsArray,
        total: response.data?.totaldata ? parseInt(response.data.totaldata) : itemsArray.length,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Errore nel caricamento dei siti');
    }
  },
);

const sitiSlice = createSlice({
  name: 'siti',
  initialState,
  reducers: {
    setSelectedSito: (state, action: PayloadAction<Sito | null>) => {
      state.selectedSito = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<SitiState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = { searchText: '', provincia: undefined };
      state.pagination.currentPage = 1;
    },
    clearSiti: (state) => {
      state.items = [];
      state.selectedSito = null;
      state.pagination = { currentPage: 1, pageSize: 50, total: 0 };
    },
    nextPage: (state) => {
      const maxPage = Math.ceil(state.pagination.total / state.pagination.pageSize);
      if (state.pagination.currentPage < maxPage) {
        state.pagination.currentPage += 1;
      }
    },
    previousPage: (state) => {
      if (state.pagination.currentPage > 1) {
        state.pagination.currentPage -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiti.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiti.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchSiti.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedSito, setFilters, clearFilters, clearSiti, nextPage, previousPage } = sitiSlice.actions;

export const selectSiti = (state: RootState) => state.siti;
export const selectSelectedSito = (state: RootState) => state.siti.selectedSito;

export default sitiSlice.reducer;
