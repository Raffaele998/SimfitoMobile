import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import apiClient from '../../src/services/api/client';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { fetchOsservazioni } from '../../src/store/slices/osservazioniSlice';
import { selectSettings } from '../../src/store/slices/settingsSlice';

interface OsservazioneDettaglio {
  idosservazioni: number;
  ospite: string;
  parassita: string;
  presente: string;
  rilevato: number;
  sospetti: string;
  campione: number;
  fase_fenologica: string;
  id_fase_fenologica?: number;
  unit_tot?: number;
  unit_chk?: number;
  peso_tot?: number;
  peso_chk?: number;
  lotti_tot?: number;
  lotti_chk?: number;
  lotti_camp?: number;
  tipologia_id?: number;
  tipologiacontrollata_descrizione?: string;
  provenienza?: string;
  sup_vis?: string;
  sup_infest?: string;
  piante_infest?: string;
  n_abbattute?: number;
  completa: string;
  tempo?: number;
  elementicampione?: number;
  codice?: string;
  tipocampione_id?: number;
}

interface TipologiaControllata {
  id: number;
  descrizione: string;
}

interface FaseFenologica {
  id_fase_fenologica: number;
  fase_fenologica: string;
  info?: string;
}

interface CampioneCodice {
  id: number;
  codice: string;
  descrizione: string;
  nuovo: boolean;
  elementicampione?: number;
  tipocampione_id?: number;
}

interface TipoCampione {
  tipocampione_id: number;
  tipocampione_description: string;
}

const OsservazioneDetailScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id, idscheda, statoScheda } = useLocalSearchParams();
  const { theme } = useAppSelector(selectSettings);
  const userId = useAppSelector((state) => state.auth.user?.id);
  
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [osservazione, setOsservazione] = useState<OsservazioneDettaglio | null>(null);
  
  // Form fields
  const [rilevato, setRilevato] = useState<number>(0);
  const [tipologiaId, setTipologiaId] = useState<number | undefined>();
  const [faseFenologica, setFaseFenologica] = useState<string>('');
  const [supTot, setSupTot] = useState<string>('');
  const [unitTot, setUnitTot] = useState<string>('');
  const [unitChk, setUnitChk] = useState<string>('');
  const [pesoTot, setPesoTot] = useState<string>('');
  const [pesoChk, setPesoChk] = useState<string>('');
  const [lottiTot, setLottiTot] = useState<string>('');
  const [lottiChk, setLottiChk] = useState<string>('');
  const [lottiCamp, setLottiCamp] = useState<string>('');
  const [supInfest, setSupInfest] = useState<string>('');
  const [pianteInfest, setPianteInfest] = useState<string>('');
  const [nAbbattute, setNAbbattute] = useState<string>('');
  const [serieCampione, setSerieCampione] = useState<boolean>(false);
  const [codiceCampione, setCodiceCampione] = useState<string>('');
  const [elementiSerie, setElementiSerie] = useState<string>('');
  const [tipoCampioneId, setTipoCampioneId] = useState<number | undefined>();
  const [provenienza, setProvenienza] = useState<string>('');
  
  // Dropdowns data
  const [tipologie, setTipologie] = useState<TipologiaControllata[]>([]);
  const [fasiFenologiche, setFasiFenologiche] = useState<FaseFenologica[]>([]);
  const [faseFenologicaId, setFaseFenologicaId] = useState<number | undefined>();
  const [faseFenologicaCustom, setFaseFenologicaCustom] = useState<boolean>(false);
  const [codiciCampione, setCodiciCampione] = useState<CampioneCodice[]>([]);
  const [tipiCampione, setTipiCampione] = useState<TipoCampione[]>([]);
  
  // Verifica stato scheda: solo stato=0 permette modifiche
  const statoSchedaNum = statoScheda ? parseInt(statoScheda as string) : 0;
  const canEdit = statoSchedaNum === 0;

  // Debug logging
  useEffect(() => {
    console.log('=== OSSERVAZIONE DETAIL ===');
    console.log('ID:', id);
    console.log('ID Scheda:', idscheda);
    console.log('Stato Scheda (param):', statoScheda);
    console.log('Stato Scheda (num):', statoSchedaNum);
    console.log('Can Edit:', canEdit);
  }, [id, idscheda, statoScheda, statoSchedaNum, canEdit]);

  const loadOsservazione = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/services/ajax.php?mode=osservazioni&idscheda=${idscheda}`);
      
      if (response.data?.success && response.data?.data) {
        // Confronta come stringa per sicurezza
        const obs = response.data.data.find((o: any) => 
          String(o.idosservazioni) === String(id)
        );
        if (obs) {
          console.log('=== CARICAMENTO OSSERVAZIONE ===');
          console.log('obs.fase_fenologica:', obs.fase_fenologica, 'type:', typeof obs.fase_fenologica);
          console.log('obs.id_fase_fenologica:', obs.id_fase_fenologica, 'type:', typeof obs.id_fase_fenologica);
          
          setOsservazione(obs);
          setRilevato(obs.rilevato ?? 0);
          setTipologiaId(obs.tipologia_id);
          setFaseFenologica(obs.fase_fenologica ?? '');
          // Converti esplicitamente in numero
          const idFase = obs.id_fase_fenologica ? parseInt(String(obs.id_fase_fenologica)) : undefined;
          setFaseFenologicaId(idFase);
          // Se c'è testo ma non id, è custom
          setFaseFenologicaCustom(!idFase && !!obs.fase_fenologica);
          setSupTot(obs.sup_vis !== 'nan' ? obs.sup_vis : '');
          setSupInfest(obs.sup_infest !== 'nan' ? obs.sup_infest : '');
          setUnitTot(obs.unit_tot?.toString() ?? '');
          setUnitChk(obs.unit_chk?.toString() ?? '');
          setPesoTot(obs.peso_tot?.toString() ?? '');
          setPesoChk(obs.peso_chk?.toString() ?? '');
          setLottiTot(obs.lotti_tot?.toString() ?? '');
          setLottiChk(obs.lotti_chk?.toString() ?? '');
          setLottiCamp(obs.lotti_camp?.toString() ?? '');
          setPianteInfest(obs.piante_infest !== 'nan' ? obs.piante_infest : '');
          setNAbbattute(obs.n_abbattute?.toString() ?? '');
          setProvenienza(obs.provenienza ?? '');
          // Serie campione
          setSerieCampione(obs.campione === 1 || obs.campione === '1' || obs.campione === true);
          setCodiceCampione(obs.codice ?? '');
          setElementiSerie(obs.elementicampione?.toString() ?? '');
          setTipoCampioneId(obs.tipocampione_id);
        } else {
          console.log('Osservazione non trovata. ID cercato:', id);
          console.log('Osservazioni disponibili:', response.data.data.map((o: any) => o.idosservazioni));
        }
      }
    } catch (error: any) {
      console.error('Errore caricamento osservazione:', error);
      Alert.alert('Errore', 'Impossibile caricare i dati dell\'osservazione');
    } finally {
      setLoading(false);
    }
  };

  const loadTipologie = async () => {
    try {
      const response = await apiClient.get('/services/ajax.php?mode=tipologiacontrollata');
      if (response.data?.success && response.data?.data) {
        setTipologie(response.data.data);
      }
    } catch (error) {
      console.error('Errore caricamento tipologie:', error);
    }
  };

  const loadCodiciCampione = async () => {
    try {
      if (!userId || !idscheda) return;
      
      const response = await apiClient.get(`/services/ajax.php?mode=codici_new&idtecnico=${userId}&idscheda=${idscheda}`);
      if (response.data?.success && response.data?.data) {
        setCodiciCampione(response.data.data);
        // Se nuovo campione, seleziona automaticamente il primo (quello generato)
        if (response.data.data.length > 0 && !codiceCampione) {
          setCodiceCampione(response.data.data[0].codice);
        }
      }
    } catch (error) {
      console.error('Errore caricamento codici campione:', error);
    }
  };

  const loadTipiCampione = async () => {
    try {
      const response = await apiClient.get('/services/ajax.php?mode=tipocampione');
      if (response.data?.success && response.data?.data) {
        setTipiCampione(response.data.data);
      }
    } catch (error) {
      console.error('Errore caricamento tipi campione:', error);
    }
  };

  const loadFasiFenologiche = async () => {
    try {
      const response = await apiClient.get(`/services/ajax.php?mode=fasifenologiche&idobs=${id}`);
      if (response.data?.success && response.data?.data) {
        console.log('=== FASI FENOLOGICHE CARICATE ===');
        console.log('Count:', response.data.data.length);
        if (response.data.data.length > 0) {
          console.log('Prima fase:', JSON.stringify(response.data.data[0]));
        }
        setFasiFenologiche(response.data.data);
      }
    } catch (error) {
      console.error('Errore caricamento fasi fenologiche:', error);
    }
  };

  useEffect(() => {
    loadOsservazione();
    loadTipologie();
    loadFasiFenologiche();
    loadTipiCampione();
  }, [id, idscheda]);

  // Carica codici campione quando viene attivato il flag serie campione
  useEffect(() => {
    if (serieCampione) {
      loadCodiciCampione();
    }
  }, [serieCampione, idscheda]);

  const handleSave = async () => {
    // Validazione campi obbligatori
    if (rilevato === undefined || rilevato === null) {
      Alert.alert('Attenzione', 'Il campo "Parassita Presente" è obbligatorio');
      return;
    }

    try {
      setSaving(true);

      // Debug logging
      console.log('=== DEBUG FASE FENOLOGICA ===');
      console.log('faseFenologicaCustom:', faseFenologicaCustom);
      console.log('faseFenologicaId:', faseFenologicaId, 'type:', typeof faseFenologicaId);
      console.log('faseFenologica:', faseFenologica);

      const formData = new FormData();
      formData.append('mode', 'obsupdate_new');
      formData.append('idosservazioni', id as string);
      formData.append('idscheda', idscheda as string);
      formData.append('rilevato', rilevato.toString());
      formData.append('completata', 'true');
      
      // Campi opzionali
      if (tipologiaId) formData.append('tipologia_id', tipologiaId.toString());
      
      // Fase fenologica: se custom usa il testo, altrimenti carica da id
      if (faseFenologicaCustom) {
        formData.append('fase_fenologica', faseFenologica);
        formData.append('id_fase_fenologica', '0');
        console.log('→ Modalità CUSTOM: fase_fenologica=', faseFenologica, ', id=0');
      } else if (faseFenologicaId) {
        const fase = fasiFenologiche.find(f => f.id_fase_fenologica === faseFenologicaId);
        formData.append('fase_fenologica', fase?.fase_fenologica || '');
        formData.append('id_fase_fenologica', faseFenologicaId.toString());
        console.log('→ Modalità DROPDOWN: fase_fenologica=', fase?.fase_fenologica, ', id=', faseFenologicaId.toString());
      } else {
        formData.append('fase_fenologica', '');
        formData.append('id_fase_fenologica', '0');
        console.log('→ Modalità VUOTA: fase_fenologica=\'\', id=0');
      }
      if (unitTot) formData.append('unit_tot', unitTot);
      if (unitChk) formData.append('unit_chk', unitChk);
      if (pesoTot) formData.append('peso_tot', pesoTot);
      if (pesoChk) formData.append('peso_chk', pesoChk);
      if (lottiTot) formData.append('lotti_tot', lottiTot);
      if (lottiChk) formData.append('lotti_chk', lottiChk);
      if (lottiCamp) formData.append('lotti_camp', lottiCamp);
      
      // Campi sempre presenti ma possono essere vuoti
      formData.append('sospetti', '');
      formData.append('organi', '');
      formData.append('varieta', '');
      formData.append('eta', '');
      formData.append('data_impianto', '');
      formData.append('appezzamento', '0');
      formData.append('coltura_prec', '');
      formData.append('id_intensity', '0');
      formData.append('sup_vis', supTot || '');
      formData.append('sup_infest', supInfest || '');
      formData.append('piante_infest', pianteInfest || '');
      formData.append('n_osservate', '');
      formData.append('piante_camp_vis', '');
      formData.append('provenienza', provenienza || '');
      formData.append('campione', serieCampione ? 'on' : 'off');
      if (serieCampione) {
        // Crea sempre un nuovo campione (il backend gestirà l'UPDATE se esiste già)
        formData.append('nuovocampione', 'true');
        formData.append('elementicampione', elementiSerie || '0');
        formData.append('codice', codiceCampione || '');
        formData.append('tipocampione_id', tipoCampioneId?.toString() || '');
        formData.append('laboratorio', '');
      } else {
        formData.append('elementicampione', '');
      }
      formData.append('geometry', '');
      formData.append('tempo', osservazione?.tempo?.toString() ?? '');

      const response = await apiClient.post('/services/ajax-save-form.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        // Ricarica le osservazioni
        dispatch(fetchOsservazioni({ 
          userId: '0',
          filters: { scheda_id: parseInt(idscheda as string) }
        }));
        
        // Mostra messaggio di successo
        setShowSuccessMessage(true);
        
        // Torna indietro dopo 1.5 secondi
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        Alert.alert('Errore', 'Impossibile salvare l\'osservazione');
      }
    } catch (error: any) {
      console.error('Errore salvataggio:', error);
      Alert.alert('Errore', error.response?.data?.message || 'Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={tintColor} style={styles.loader} />
      </View>
    );
  }

  if (!osservazione) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={[styles.errorText, { color: textColor }]}>Osservazione non trovata</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: 'Dettaglio Osservazione',
          headerStyle: { backgroundColor: tintColor },
          headerTintColor: '#fff',
          headerRight: () => canEdit ? (
            <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveButton}>
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="checkmark" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          ) : null,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Intestazione Osservazione */}
        <View style={[styles.headerCard, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {osservazione.ospite}
          </Text>
          <Text style={[styles.headerSubtitle, { color: tintColor }]}>
            {osservazione.parassita}
          </Text>
        </View>

        {/* Alert se scheda confermata (non modificabile) */}
        {!canEdit && (
          <View style={[styles.alertCard, { backgroundColor: isDark ? '#3a2f2a' : '#fff3cd' }]}>
            <Ionicons name="lock-closed" size={20} color="#ff9800" />
            <Text style={[styles.alertText, { color: isDark ? '#ffa726' : '#856404' }]}>
              Scheda confermata: i campi sono in sola lettura
            </Text>
          </View>
        )}

        {/* Parassita Presente */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <View style={styles.labelWithRequired}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Parassita Presente</Text>
            <Text style={styles.requiredStar}> *</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={rilevato}
              onValueChange={setRilevato}
              style={[styles.picker, { color: textColor }]}
              dropdownIconColor={textColor}
              enabled={canEdit}
            >
              <Picker.Item key="0" label="Non presente" value={0} />
              <Picker.Item key="1" label="Presente" value={1} />
              <Picker.Item key="2" label="Da verificare" value={2} />
            </Picker>
          </View>
        </View>

        {/* Tipologia Controllata */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Tipologia Controllata</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipologiaId ?? 0}
              onValueChange={setTipologiaId}
              style={[styles.picker, { color: textColor }]}
              dropdownIconColor={textColor}
              enabled={canEdit}
            >
              <Picker.Item key="empty" label="Seleziona..." value={0} />
              {tipologie.map((tip) => (
                <Picker.Item key={tip.id} label={tip.descrizione} value={tip.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Fase Fenologica */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Fase Fenologica</Text>
          
          {/* Switch per modalità custom */}
          <View style={styles.switchRow}>
            <Text style={[styles.label, { color: textColor }]}>Inserimento manuale</Text>
            <Switch
              value={faseFenologicaCustom}
              onValueChange={setFaseFenologicaCustom}
              trackColor={{ false: '#767577', true: tintColor }}
              thumbColor={faseFenologicaCustom ? '#fff' : '#f4f3f4'}
              disabled={!canEdit}
            />
          </View>
          
          {faseFenologicaCustom ? (
            <TextInput
              style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
              value={faseFenologica}
              onChangeText={setFaseFenologica}
              placeholder="Es: Frutti completamente sviluppati"
              placeholderTextColor={isDark ? '#888' : '#999'}
              multiline
              numberOfLines={2}
              editable={canEdit}
            />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={faseFenologicaId ?? 0}
                onValueChange={(value) => {
                  console.log('Picker onValueChange - value:', value, 'type:', typeof value);
                  // Converti in numero se necessario
                  const numValue = Number(value);
                  if (!isNaN(numValue)) {
                    setFaseFenologicaId(numValue);
                    const fase = fasiFenologiche.find(f => Number(f.id_fase_fenologica) === numValue);
                    if (fase) {
                      console.log('Fase trovata:', fase.fase_fenologica);
                      setFaseFenologica(fase.fase_fenologica);
                    } else {
                      console.log('Fase NON trovata per id:', numValue);
                    }
                  }
                }}
                style={[styles.picker, { color: textColor }]}
                dropdownIconColor={textColor}
                enabled={canEdit}
              >
                <Picker.Item key="empty" label="Seleziona..." value={0} />
                {fasiFenologiche.map((fase) => (
                  <Picker.Item 
                    key={fase.id_fase_fenologica} 
                    label={fase.fase_fenologica + (fase.info ? ` - ${fase.info}` : '')} 
                    value={Number(fase.id_fase_fenologica)} 
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* Superficie */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Superficie</Text>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: textColor }]}>Sup. Totale sito [m²]</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
                value={supTot}
                onChangeText={setSupTot}
                keyboardType="numeric"
                placeholder="0"
                editable={canEdit}
                placeholderTextColor={isDark ? '#888' : '#999'}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: textColor }]}>Sup. infestata [m²]</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
                value={supInfest}
                onChangeText={setSupInfest}
                keyboardType="numeric"
                placeholder="0"
                editable={canEdit}
                placeholderTextColor={isDark ? '#888' : '#999'}
              />
            </View>
          </View>
        </View>

        {/* Piante infeste */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Piante infeste</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
            value={pianteInfest}
            onChangeText={setPianteInfest}
            keyboardType="numeric"
            placeholder="0"
            editable={canEdit}
            placeholderTextColor={isDark ? '#888' : '#999'}
          />
        </View>

        {/* Unità */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Unità</Text>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: textColor }]}>Unità totali</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
                value={unitTot}
                onChangeText={setUnitTot}
                keyboardType="numeric"
                placeholder="0"
                editable={canEdit}
                placeholderTextColor={isDark ? '#888' : '#999'}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: textColor }]}>Unità controllate</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
                value={unitChk}
                onChangeText={setUnitChk}
                keyboardType="numeric"
                placeholder="0"
                editable={canEdit}
                placeholderTextColor={isDark ? '#888' : '#999'}
              />
            </View>
          </View>
        </View>

        {/* Peso [kg] */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Peso [kg]</Text>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: textColor }]}>Peso totale</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
                value={pesoTot}
                onChangeText={setPesoTot}
                keyboardType="decimal-pad"
                placeholder="0"
                editable={canEdit}
                placeholderTextColor={isDark ? '#888' : '#999'}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: textColor }]}>Peso controllato</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
                value={pesoChk}
                onChangeText={setPesoChk}
                keyboardType="decimal-pad"
                placeholder="0"
                editable={canEdit}
                placeholderTextColor={isDark ? '#888' : '#999'}
              />
            </View>
          </View>
        </View>

        {/* Lotti */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Lotti</Text>
          <View style={styles.row}>
            <View style={styles.thirdField}>
              <Text style={[styles.label, { color: textColor }]}>Lotti totali</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
                value={lottiTot}
                onChangeText={setLottiTot}
                keyboardType="numeric"
                placeholder="0"
                editable={canEdit}
                placeholderTextColor={isDark ? '#888' : '#999'}
              />
            </View>
            <View style={styles.thirdField}>
              <Text style={[styles.label, { color: textColor }]}>Lotti controllati</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
                value={lottiChk}
                onChangeText={setLottiChk}
                keyboardType="numeric"
                placeholder="0"
                editable={canEdit}
                placeholderTextColor={isDark ? '#888' : '#999'}
              />
            </View>
            <View style={styles.thirdField}>
              <Text style={[styles.label, { color: textColor }]}>Lotti campione</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
                value={lottiCamp}
                onChangeText={setLottiCamp}
                keyboardType="numeric"
                placeholder="0"
                editable={canEdit}
                placeholderTextColor={isDark ? '#888' : '#999'}
              />
            </View>
          </View>
        </View>


        {/* Numero piante abbattute */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Numero piante abbattute (sola lettura)</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd', backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]}
            value={nAbbattute}
            keyboardType="numeric"
            placeholder="0"
            editable={false}
            placeholderTextColor={isDark ? '#888' : '#999'}
          />
        </View>

        {/* Serie campione */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
          <View style={styles.switchRow}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Serie campione</Text>
            <Switch
              value={serieCampione}
              onValueChange={setSerieCampione}
              trackColor={{ false: '#767577', true: tintColor }}
              thumbColor={serieCampione ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          {serieCampione && (
            <>
              <View style={styles.fieldSpacing}>
                <Text style={[styles.label, { color: textColor }]}>Codice campione</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={codiceCampione}
                    onValueChange={(value) => {
                      setCodiceCampione(value);
                      // Carica automaticamente dati del campione esistente
                      const campione = codiciCampione.find(c => c.codice === value);
                      if (campione && !campione.nuovo) {
                        if (campione.elementicampione) setElementiSerie(campione.elementicampione.toString());
                        if (campione.tipocampione_id) setTipoCampioneId(campione.tipocampione_id);
                      }
                    }}
                    style={[styles.picker, { color: textColor }]}
                    dropdownIconColor={textColor}
                    enabled={canEdit}
                  >
                    <Picker.Item label="Seleziona codice..." value="" />
                    {codiciCampione.map((item) => (
                      <Picker.Item
                        key={item.codice}
                        label={item.descrizione}
                        value={item.codice}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.fieldSpacing}>
                <Text style={[styles.label, { color: textColor }]}>Elementi della serie (numero)</Text>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ddd' }]}
                  value={elementiSerie}
                  onChangeText={setElementiSerie}
                  placeholder="1"
                  keyboardType="numeric"
                  editable={canEdit}
                  placeholderTextColor={isDark ? '#888' : '#999'}
                />
              </View>

              <View style={styles.fieldSpacing}>
                <Text style={[styles.label, { color: textColor }]}>Tipo serie campione</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={tipoCampioneId}
                    onValueChange={(value) => setTipoCampioneId(value)}
                    style={[styles.picker, { color: textColor }]}
                    dropdownIconColor={textColor}
                    enabled={canEdit}
                  >
                    <Picker.Item label="Seleziona tipo..." value={undefined} />
                    {tipiCampione.map((item) => (
                      <Picker.Item
                        key={item.tipocampione_id}
                        label={item.tipocampione_description}
                        value={item.tipocampione_id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Pulsanti Azione Fissi */}
      <View style={[styles.actionButtonsContainer, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: isDark ? '#444' : '#ddd' }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={tintColor} />
          <Text style={[styles.backButtonText, { color: tintColor }]}>Indietro</Text>
        </TouchableOpacity>
        
        {canEdit && (
          <TouchableOpacity
            style={[styles.saveButtonFixed, { backgroundColor: tintColor }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.saveButtonText}>Salva</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Messaggio di successo */}
      {showSuccessMessage && (
        <View style={styles.successToast}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.successToastText}>Osservazione salvata con successo!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  saveButton: {
    marginRight: 16,
    padding: 8,
  },
  headerCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  labelWithRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requiredStar: {
    color: '#f44336',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  thirdField: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldSpacing: {
    marginTop: 12,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonFixed: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successToast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  successToastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OsservazioneDetailScreen;
