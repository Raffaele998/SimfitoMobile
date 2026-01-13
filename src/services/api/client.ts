import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';

// Backend locale (PHP server)
// Usa 192.168.1.9:8000 per testare da telefono
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.9:8000'  // Development: PHP server locale
  : 'http://192.168.1.19';   // Production: Backend server

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere token
apiClient.interceptors.request.use(async (config) => {
  try {
    // Non aggiungere token alla richiesta di login
    if (config.url?.includes('/login.php')) {
      return config;
    }

    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.params = config.params || {};
      config.params.token = token;
    }
  } catch (error) {
    console.error('Error reading token from storage:', error);
  }
  return config;
});

// Interceptor per errori
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('Token expired or invalid');
      AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
