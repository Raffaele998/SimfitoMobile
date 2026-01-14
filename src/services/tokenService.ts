// Servizio per gestire il token solo in memoria (non persistente)
let authToken: string | null = null;

export const tokenService = {
  setToken: (token: string) => {
    console.log('[TokenService] Token salvato in memoria');
    authToken = token;
  },

  getToken: (): string | null => {
    if (!authToken) {
      console.log('[TokenService] Token richiesto ma non presente in memoria');
    }
    return authToken;
  },

  clearToken: () => {
    console.log('[TokenService] Token cancellato dalla memoria');
    authToken = null;
  },
};
