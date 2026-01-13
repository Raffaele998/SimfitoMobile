import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Trappola {
  idtrappola: number;
  codtrappola: string;
  gid: number;
  idosservazione: number;
  data_cattura: string;
  specie: string;
  num_catture: number;
  note: string;
}

interface TrappolState {
  items: Trappola[];
  loading: boolean;
  error: string | null;
}

const initialState: TrappolState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTrappole = createAsyncThunk(
  'trappole/fetchTrappole',
  async ({ gid, idosservazione }: { gid: number; idosservazione: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: 'trappole',
          gid,
          idosservazione,
        },
      });
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Errore nel caricamento');
    }
  }
);

const trappolSlice = createSlice({
  name: 'trappole',
  initialState,
  reducers: {
    clearTrappole: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrappole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrappole.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTrappole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTrappole } = trappolSlice.actions;
export const selectTrappole = (state: any) => state.trappole;
export default trappolSlice.reducer;
