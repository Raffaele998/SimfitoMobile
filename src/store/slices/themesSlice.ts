import apiClient from '@/services/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Theme {
  id: number;
  theme: string;
}

interface ThemesState {
  items: Theme[];
  loading: boolean;
  error: string | null;
}

const initialState: ThemesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchThemes = createAsyncThunk(
  'themes/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: 'themes',
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
        'Errore nel caricamento dei temi'
      );
    }
  }
);

const themesSlice = createSlice({
  name: 'themes',
  initialState,
  reducers: {
    clearThemes: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearThemes } = themesSlice.actions;
export const selectThemes = (state: any) => state.themes;
export default themesSlice.reducer;
