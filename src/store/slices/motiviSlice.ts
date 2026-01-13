import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Motivo {
  id: number;
  motivo: string;
}

interface MotiviState {
  items: Motivo[];
  loading: boolean;
  error: string | null;
}

const initialState: MotiviState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMotivi = createAsyncThunk(
  'motivi/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: 'motivoVisita',
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
        'Errore nel caricamento dei motivi'
      );
    }
  }
);

const motiviSlice = createSlice({
  name: 'motivi',
  initialState,
  reducers: {
    clearMotivi: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMotivi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMotivi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMotivi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMotivi } = motiviSlice.actions;
export const selectMotivi = (state: any) => state.motivi;
export default motiviSlice.reducer;
