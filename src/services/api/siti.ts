import api from './client';

export interface Sito {
  id: number;
  gid?: number;
  rag_soc?: string;
  localita?: string;
  denominazione: string;
  comune?: string;
  provincia?: string;
  geometry?: any;
  superficie_ha?: number;
  tipologiasito?: string;
  tipologiasito_id?: number;
  theme_id?: number;
  piva_azienda?: string;
}

export interface CreateSitoParams {
  piva: string;
  denominazione: string;
  tipologiasito_id: number;
  userId: number;
  comune?: string;
  indirizzo?: string;
  superficie?: number;
  quota?: number;
  geometry?: string; // GeoJSON string
}

/**
 * Ottiene i siti di un'azienda
 */
export const getSiti = async (piva: string, query?: string): Promise<Sito[]> => {
  const params: any = { mode: 'siti', piva };
  if (query) {
    params.query = query;
  }

  const response = await api.get<{ data: Sito[] }>('/ajax.php', { params });

  return response.data.data || [];
};

/**
 * Crea un nuovo sito con geometria di default (punto a coordinate 0,0)
 * In produzione, l'utente potrà modificare la geometria dalla versione web
 */
export const createSito = async (params: CreateSitoParams): Promise<{ success: boolean; gid?: number }> => {
  const formData = new FormData();
  formData.append('mode', 'scheda-sito');
  formData.append('piva', params.piva);
  formData.append('denominazione', params.denominazione);
  formData.append('tipologiasito_id', params.tipologiasito_id.toString());
  formData.append('userId', params.userId.toString());

  // Usa geometria fornita o crea un punto di default
  const geometry = params.geometry || JSON.stringify({
    type: 'Point',
    coordinates: [14.25, 40.83], // Centro Campania di default
  });
  formData.append('geometry', geometry);

  formData.append('comune', params.comune || '');
  formData.append('indirizzo', params.indirizzo || '');
  formData.append('superficie', (params.superficie || 0).toString());
  formData.append('quota', (params.quota || 0).toString());

  const response = await api.post('/ajax-save-form.php', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * Ottiene tutti i siti (senza filtro azienda)
 */
export const getAllSiti = async (query?: string): Promise<Sito[]> => {
  const params: any = { mode: 'sitiall' };
  if (query) {
    params.query = query;
  }

  const response = await api.get<{ data: Sito[] }>('/ajax.php', { params });

  return response.data.data || [];
};
