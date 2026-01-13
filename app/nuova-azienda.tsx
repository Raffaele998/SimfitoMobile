import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '../hooks/use-theme-color';
import { checkAzienda, createAzienda } from '../src/services/api/aziende';
import { Comune, getComuni, getProvince, getTipoAzienda, Provincia, TipoAzienda } from '../src/services/api/tipologie';
import { useAppSelector } from '../src/store/hooks';
import { selectAuth } from '../src/store/slices/authSlice';

const NuovaAziendaScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAppSelector(selectAuth);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const isDark = textColor === '#ECEDEE';

  const [piva, setPiva] = useState('');
  const [ragioneSociale, setRagioneSociale] = useState('');
  const [selectedTipi, setSelectedTipi] = useState<number[]>([]);
  const [indirizzo, setIndirizzo] = useState('');
  const [cap, setCap] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedProvinciaLabel, setSelectedProvinciaLabel] = useState('');
  const [selectedComune, setSelectedComune] = useState('');
  const [selectedComuneLabel, setSelectedComuneLabel] = useState('');
  const [referente, setReferente] = useState('');
  const [posizioneRef, setPosizioneRef] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fax, setFax] = useState('');
  const [email, setEmail] = useState('');

  const [tipiAzienda, setTipiAzienda] = useState<TipoAzienda[]>([]);
  const [province, setProvince] = useState<Provincia[]>([]);
  const [comuni, setComuni] = useState<Comune[]>([]);

  const [loadingTipi, setLoadingTipi] = useState(false);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingComuni, setLoadingComuni] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showTipiModal, setShowTipiModal] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showComuniModal, setShowComuniModal] = useState(false);

  useEffect(() => {
    loadTipiAzienda();
    loadProvince();
  }, []);

  useEffect(() => {
    if (selectedProvincia) {
      loadComuni(selectedProvincia);
    }
  }, [selectedProvincia]);

  const loadTipiAzienda = async () => {
    setLoadingTipi(true);
    try {
      const data = await getTipoAzienda();
      setTipiAzienda(data);
    } catch (error) {
      Alert.alert('Errore', 'Impossibile caricare i tipi azienda');
    } finally {
      setLoadingTipi(false);
    }
  };

  const loadProvince = async () => {
    setLoadingProvince(true);
    try {
      const data = await getProvince();
      setProvince(data);
    } catch (error) {
      Alert.alert('Errore', 'Impossibile caricare le province');
    } finally {
      setLoadingProvince(false);
    }
  };

  const loadComuni = async (provincia: string) => {
    setLoadingComuni(true);
    try {
      const data = await getComuni(provincia);
      setComuni(data);
    } catch (error) {
      Alert.alert('Errore', 'Impossibile caricare i comuni');
    } finally {
      setLoadingComuni(false);
    }
  };

  const validatePiva = (value: string): boolean => {
    const pivaRegex = /^([0-9]{11}|[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1})$/;
    return pivaRegex.test(value);
  };

  const handleSubmit = async () => {
    // Validazione
    if (!piva || !ragioneSociale || selectedTipi.length === 0 || !selectedProvincia || !selectedComune) {
      Alert.alert('Errore', 'Compilare tutti i campi obbligatori');
      return;
    }

    if (!validatePiva(piva)) {
      Alert.alert('Errore', 'Partita IVA/Codice Fiscale non valido');
      return;
    }

    setSubmitting(true);

    try {
      // Verifica se l'azienda esiste già
      const existing = await checkAzienda(piva);
      if (existing) {
        Alert.alert(
          'Azienda esistente',
          `Azienda già registrata:\nP.IVA/CF: ${existing.partita_iva}\nRagione Sociale: ${existing.rag_soc}`
        );
        setSubmitting(false);
        return;
      }

      // Crea l'azienda
      const result = await createAzienda({
        piva,
        ragionesociale: ragioneSociale,
        idTecnico: Number(user?.id),
        comune: selectedComune,
        indirizzo,
        cap,
        referente,
        posizione_ref: posizioneRef,
        telefono,
        fax,
        email,
        tipoazienda: JSON.stringify(selectedTipi),
      });

      if (result.success) {
        Alert.alert('Successo', 'Azienda creata con successo', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert('Errore', 'Errore nella creazione dell\'azienda');
      }
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore nella creazione dell\'azienda');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const toggleTipo = (id: number) => {
    setSelectedTipi(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const getTipiLabel = () => {
    if (selectedTipi.length === 0) return 'Seleziona tipi...';
    return selectedTipi
      .map(id => tipiAzienda.find(t => t.id === id)?.descrizione)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? '#1a1a1a' : '#fff',
            borderBottomColor: isDark ? '#333' : '#eee',
          },
        ]}
      >
        <TouchableOpacity onPress={handleClose}>
          <MaterialIcons name="close" size={24} color={tintColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Nuova Azienda</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Partita IVA/C.F. */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: textColor }]}>Partita IVA/C.F. *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                  borderColor: isDark ? '#444' : '#ddd',
                  color: textColor,
                },
              ]}
              value={piva}
              onChangeText={setPiva}
              placeholder="Inserisci P.IVA o Codice Fiscale"
              placeholderTextColor={isDark ? '#666' : '#999'}
              autoCapitalize="characters"
            />
          </View>

          {/* Ragione Sociale */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: textColor }]}>Ragione Sociale *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                  borderColor: isDark ? '#444' : '#ddd',
                  color: textColor,
                },
              ]}
              value={ragioneSociale}
              onChangeText={setRagioneSociale}
              placeholder="Inserisci ragione sociale"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
          </View>

          {/* Tipo */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: textColor }]}>Tipo *</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                  borderColor: isDark ? '#444' : '#ddd',
                },
              ]}
              onPress={() => setShowTipiModal(true)}
              disabled={loadingTipi}
            >
              {loadingTipi ? (
                <ActivityIndicator color={tintColor} />
              ) : (
                <>
                  <Text
                    style={[
                      styles.selectText,
                      { color: selectedTipi.length > 0 ? textColor : (isDark ? '#666' : '#999') },
                    ]}
                    numberOfLines={1}
                  >
                    {getTipiLabel()}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color={tintColor} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Sezione Indirizzo */}
          <View style={[styles.section, { borderColor: isDark ? '#333' : '#eee' }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Indirizzo</Text>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 2 }]}>
                <Text style={[styles.label, { color: textColor }]}>Via</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                      borderColor: isDark ? '#444' : '#ddd',
                      color: textColor,
                    },
                  ]}
                  value={indirizzo}
                  onChangeText={setIndirizzo}
                  placeholder="Via, piazza, ecc."
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: textColor }]}>C.A.P.</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                      borderColor: isDark ? '#444' : '#ddd',
                      color: textColor,
                    },
                  ]}
                  value={cap}
                  onChangeText={setCap}
                  placeholder="00000"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: textColor }]}>Provincia *</Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  {
                    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                    borderColor: isDark ? '#444' : '#ddd',
                  },
                ]}
                onPress={() => setShowProvinceModal(true)}
                disabled={loadingProvince}
              >
                {loadingProvince ? (
                  <ActivityIndicator color={tintColor} />
                ) : (
                  <>
                    <Text
                      style={[
                        styles.selectText,
                        { color: selectedProvinciaLabel ? textColor : (isDark ? '#666' : '#999') },
                      ]}
                    >
                      {selectedProvinciaLabel || 'Seleziona provincia...'}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color={tintColor} />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: textColor }]}>Comune *</Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  {
                    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                    borderColor: isDark ? '#444' : '#ddd',
                  },
                ]}
                onPress={() => setShowComuniModal(true)}
                disabled={!selectedProvincia || loadingComuni}
              >
                {loadingComuni ? (
                  <ActivityIndicator color={tintColor} />
                ) : (
                  <>
                    <Text
                      style={[
                        styles.selectText,
                        { color: selectedComuneLabel ? textColor : (isDark ? '#666' : '#999') },
                      ]}
                    >
                      {selectedComuneLabel || 'Seleziona comune...'}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color={tintColor} />
                  </>
                )}
              </TouchableOpacity>
              {!selectedProvincia && (
                <Text style={[styles.helpText, { color: isDark ? '#666' : '#999' }]}>
                  Seleziona prima una provincia
                </Text>
              )}
            </View>
          </View>

          {/* Sezione Dettagli */}
          <View style={[styles.section, { borderColor: isDark ? '#333' : '#eee' }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Dettagli</Text>

            <View style={styles.field}>
              <Text style={[styles.label, { color: textColor }]}>Referente</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                    borderColor: isDark ? '#444' : '#ddd',
                    color: textColor,
                  },
                ]}
                value={referente}
                onChangeText={setReferente}
                placeholder="Nome referente"
                placeholderTextColor={isDark ? '#666' : '#999'}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: textColor }]}>Posizione Referente</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                    borderColor: isDark ? '#444' : '#ddd',
                    color: textColor,
                  },
                ]}
                value={posizioneRef}
                onChangeText={setPosizioneRef}
                placeholder="Ruolo/posizione"
                placeholderTextColor={isDark ? '#666' : '#999'}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: textColor }]}>Telefono</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                      borderColor: isDark ? '#444' : '#ddd',
                      color: textColor,
                    },
                  ]}
                  value={telefono}
                  onChangeText={setTelefono}
                  placeholder="Telefono"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: textColor }]}>Fax</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                      borderColor: isDark ? '#444' : '#ddd',
                      color: textColor,
                    },
                  ]}
                  value={fax}
                  onChangeText={setFax}
                  placeholder="Fax"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: textColor }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                    borderColor: isDark ? '#444' : '#ddd',
                    color: textColor,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor={isDark ? '#666' : '#999'}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: tintColor },
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Crea Azienda</Text>
                <MaterialIcons name="check" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Tipi Azienda */}
      <Modal
        visible={showTipiModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTipiModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Seleziona Tipi</Text>
              <TouchableOpacity onPress={() => setShowTipiModal(false)}>
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {tipiAzienda.map((tipo) => (
                <TouchableOpacity
                  key={tipo.id}
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor: selectedTipi.includes(tipo.id)
                        ? (isDark ? '#2a2a2a' : '#f0f0f0')
                        : 'transparent',
                      borderBottomColor: isDark ? '#333' : '#eee',
                    },
                  ]}
                  onPress={() => toggleTipo(tipo.id)}
                >
                  <Text style={[styles.modalItemText, { color: textColor }]}>
                    {tipo.descrizione}
                  </Text>
                  {selectedTipi.includes(tipo.id) && (
                    <MaterialIcons name="check" size={20} color={tintColor} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Province */}
      <Modal
        visible={showProvinceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProvinceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Seleziona Provincia</Text>
              <TouchableOpacity onPress={() => setShowProvinceModal(false)}>
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {province.map((prov) => (
                <TouchableOpacity
                  key={prov.id}
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor:
                        selectedProvincia === prov.sigla
                          ? (isDark ? '#2a2a2a' : '#f0f0f0')
                          : 'transparent',
                      borderBottomColor: isDark ? '#333' : '#eee',
                    },
                  ]}
                  onPress={() => {
                    setSelectedProvincia(prov.sigla);
                    setSelectedProvinciaLabel(`${prov.sigla} - ${prov.denominazione}`);
                    setSelectedComune('');
                    setSelectedComuneLabel('');
                    setShowProvinceModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: textColor }]}>
                    {prov.sigla} - {prov.denominazione}
                  </Text>
                  {selectedProvincia === prov.sigla && (
                    <MaterialIcons name="check" size={20} color={tintColor} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Comuni */}
      <Modal
        visible={showComuniModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowComuniModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Seleziona Comune</Text>
              <TouchableOpacity onPress={() => setShowComuniModal(false)}>
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {comuni.map((com) => (
                <TouchableOpacity
                  key={com.istat}
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor:
                        selectedComune === com.istat
                          ? (isDark ? '#2a2a2a' : '#f0f0f0')
                          : 'transparent',
                      borderBottomColor: isDark ? '#333' : '#eee',
                    },
                  ]}
                  onPress={() => {
                    setSelectedComune(com.istat);
                    setSelectedComuneLabel(com.nome);
                    setShowComuniModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: textColor }]}>
                    {com.nome}
                  </Text>
                  {selectedComune === com.istat && (
                    <MaterialIcons name="check" size={20} color={tintColor} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  selectText: {
    fontSize: 16,
    flex: 1,
  },
  helpText: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '70%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default NuovaAziendaScreen;
