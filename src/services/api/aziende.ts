import api from './client';

export interface Azienda {
  id_azienda: number;
  partita_iva: string;
  rag_soc: string;
  istat_comune?: string;
  indirizzo?: string;
  cap?: string;
  referente?: string;
  posizione_ref?: string;
  telefono?: string;
  fax?: string;
  email?: string;
  comune?: string;
  provincia?: string;
  rup?: boolean;
  vivaio?: boolean;
  fito?: boolean;
  tipo?: string; // Concatenazione dei tipi azienda
  bbox?: string;
}

export interface CreateAziendaParams {
  piva: string;
  ragionesociale: string;
  idTecnico: number;
  comune?: string;
  indirizzo?: string;
  cap?: string;
  referente?: string;
  posizione_ref?: string;
  telefono?: string;
  fax?: string;
  email?: string;
  tipoazienda?: string; // JSON array di ID tipi azienda
}

/**
 * Verifica se esiste un'azienda con la partita IVA specificata
 */
export const checkAzienda = async (piva: string): Promise<Azienda | null> => {
  const response = await api.get<{ data: Azienda[] }>('/services/ajax.php', {
    params: { mode: 'azienda', piva },
  });

  if (response.data.data && response.data.data.length > 0) {
    return response.data.data[0];
  }

  return null;
};

/**
 * Crea una nuova azienda
 */
export const createAzienda = async (params: CreateAziendaParams): Promise<{ success: boolean; id_azienda?: number }> => {
  const formData = new FormData();
  formData.append('mode', 'scheda-azienda');
  formData.append('piva', params.piva);
  formData.append('ragionesociale', params.ragionesociale);
  formData.append('idTecnico', params.idTecnico.toString());

  if (params.comune) formData.append('comune', params.comune);
  if (params.indirizzo) formData.append('indirizzo', params.indirizzo);
  if (params.cap) formData.append('cap', params.cap);
  if (params.referente) formData.append('referente', params.referente);
  if (params.posizione_ref) formData.append('posizione_ref', params.posizione_ref);
  if (params.telefono) formData.append('telefono', params.telefono);
  if (params.fax) formData.append('fax', params.fax);
  if (params.email) formData.append('email', params.email);
  if (params.tipoazienda) formData.append('tipoazienda', params.tipoazienda);

  const response = await api.post('/services/ajax-save-form.php', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * Ottiene le aziende associate a un tecnico
 */
export const getAziende = async (idTecnico: number): Promise<Azienda[]> => {
  const response = await api.get<{ data: Azienda[] }>('/services/ajax.php', {
    params: { mode: 'aziende', idTecnico },
  });

  return response.data.data || [];
};

/**
 * Ottiene TUTTE le aziende del sistema (per il form nuova scheda)
 */
export const getAllAziende = async (query?: string, limit: number = 50, start: number = 0): Promise<{ aziende: Azienda[]; total: number }> => {
  const params: any = {
    mode: 'aziendeall2',
    limit,
    start,
  };

  if (query && query.trim() !== '') {
    params.query = query.trim();
  }

  const response = await api.get<{ data: Azienda[]; totaldata?: number }>('/services/ajax.php', {
    params,
  });

  return {
    aziende: response.data.data || [],
    total: response.data.totaldata || 0,
  };
};
