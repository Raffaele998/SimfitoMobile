import apiClient from '@/services/api/client';
import { tokenService } from '@/services/tokenService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface User {
  id: string | number;
  username: string;
  email?: string;
  name?: string;
  type?: string;
  province?: string;
  userType?: string;
  // Campi dal database
  cognome?: string;
  nome?: string;
  codicefiscale?: string;
  sesso?: string;
  comune_nascita?: string;
  data_nascita?: string;
  residenza_indirizzo?: string;
  residenza_comune?: string;
  telefono?: string;
  mobile?: string;
  web?: string;
  ufficio?: string;
  cap_ufficio?: string;
  titolo?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/services/login.php', 
        `loginUsername=${encodeURIComponent(username)}&loginPassword=${encodeURIComponent(password)}&mode=simfito`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // Controlla il response
      if (!response.data.success) {
        return rejectWithValue(response.data.errors?.reason || 'Login fallito');
      }

      const user = {
        id: response.data.id,
        username: response.data.username || username,
        email: response.data.email || '',
        name: response.data.nome,
        type: response.data.tipo,
        province: response.data.provincia,
        userType: response.data.tipotecnico,
        // Campi dal database
        cognome: response.data.cognome,
        nome: response.data.nome,
        codicefiscale: response.data.codicefiscale,
        sesso: response.data.sesso,
        comune_nascita: response.data.comune_nascita,
        data_nascita: response.data.data_nascita,
        residenza_indirizzo: response.data.residenza_indirizzo,
        residenza_comune: response.data.residenza_comune,
        telefono: response.data.telefono,
        mobile: response.data.mobile,
        web: response.data.web,
        ufficio: response.data.ufficio,
        cap_ufficio: response.data.cap_ufficio,
        titolo: response.data.titolo,
      };

      // Salva il token solo in memoria (non persistente)
      const token = btoa(`${username}:${password}`);
      tokenService.setToken(token);

      return { user, token };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errors?.reason || 
        error.message || 
        'Errore durante il login'
      );
    }
  }
);

export const restoreToken = createAsyncThunk(
  'auth/restoreToken',
  async (_, { rejectWithValue }) => {
    // Il token non viene più persistito, quindi restoreToken non è più utilizzato
    return rejectWithValue('Token not persisted');
  }
);
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    tokenService.clearToken();
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(restoreToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(restoreToken.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export const selectAuth = (state: any) => state.auth;
export default authSlice.reducer;
