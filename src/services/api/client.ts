import axios, { AxiosError } from 'axios';
import { tokenService } from '@/services/tokenService';

// Backend locale (PHP server)
// Usa l'IP della tua macchina Linux per testare da telefono/emulatore
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.20:8000'  // Development: PHP server locale
  : 'http://192.168.1.19';   // Production: Backend server

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere token
apiClient.interceptors.request.use((config) => {
  // Non aggiungere token alla richiesta di login
  if (config.url?.includes('/login.php')) {
    return config;
  }

  const token = tokenService.getToken();
  if (token) {
    config.params = config.params || {};
    config.params.token = token;
  }
  return config;
});

// Interceptor per errori
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('[API Client] Errore 401 - Token non valido o scaduto');
      tokenService.clearToken();
      // Il token è stato invalidato, l'app dovrebbe reindirizzare al login
      // tramite il meccanismo di navigation protection in _layout.tsx
    }
    return Promise.reject(error);
  }
);

export default apiClient;
