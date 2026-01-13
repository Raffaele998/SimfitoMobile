import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: string;
  theme: 'light' | 'dark';
}

const initialState: SettingsState = {
  language: 'it',
  theme: 'light',
};

// Async thunk per salvare il tema in AsyncStorage
export const saveTheme = createAsyncThunk(
  'settings/saveTheme',
  async (theme: 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem('appTheme', theme);
      return theme;
    } catch (error) {
      console.error('Error saving theme:', error);
      return theme;
    }
  }
);

// Async thunk per recuperare il tema da AsyncStorage
export const restoreTheme = createAsyncThunk(
  'settings/restoreTheme',
  async () => {
    try {
      const theme = await AsyncStorage.getItem('appTheme');
      return theme || 'light';
    } catch (error) {
      console.error('Error restoring theme:', error);
      return 'light';
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.theme = action.payload as 'light' | 'dark';
      })
      .addCase(restoreTheme.fulfilled, (state, action) => {
        state.theme = action.payload as 'light' | 'dark';
      });
  },
});

export const { setLanguage, setTheme } = settingsSlice.actions;
export const selectSettings = (state: any) => state.settings;
export default settingsSlice.reducer;
