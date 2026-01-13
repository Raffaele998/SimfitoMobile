import apiClient from './client';

export interface TipoAzienda {
  id: number;
  descrizione: string;
  attiva?: boolean;
}

export interface Provincia {
  id: number;
  sigla: string;
  denominazione: string;
}

export interface Comune {
  istat: string;
  nome: string;
  provincia?: string;
}

export const getTipoAzienda = async (): Promise<TipoAzienda[]> => {
  const response = await apiClient.get('/services/ajax.php', {
    params: {
      mode: 'tipoazienda',
    },
  });
  return response.data.data || [];
};

export const getProvince = async (): Promise<Provincia[]> => {
  const response = await apiClient.get('/services/login.php', {
    params: {
      mode: 'idprovince',
    },
  });
  return response.data.data || [];
};

export const getComuni = async (provincia: string): Promise<Comune[]> => {
  const response = await apiClient.get('/services/ajax.php', {
    params: {
      mode: 'comuni',
      provincia,
    },
  });
  return response.data.data || [];
};
