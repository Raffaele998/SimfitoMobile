import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { selectAuth } from '../src/store/slices/authSlice';
import { selectAziende, verifyOrCreateAzienda } from '../src/store/slices/aziendeSlice';
import { createScheda, fetchSchede } from '../src/store/slices/schedeSlice';
import { createSito, fetchSitiByAzienda, selectSiti } from '../src/store/slices/sitiSlice';
import { fetchThemes, selectThemes } from '../src/store/slices/themesSlice';
import { fetchTipologiaSito, selectTipologiaSito } from '../src/store/slices/tipologiaSitoSlice';

const NuovaSchedaScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { items: themes, loading: loadingThemes } = useAppSelector(selectThemes);
  const { items: tipologie, loading: loadingTipologie } = useAppSelector(selectTipologiaSito);
  const { currentAzienda, loading: loadingAzienda } = useAppSelector(selectAziende);
  const { items: siti, loading: loadingSiti } = useAppSelector(selectSiti);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const [step, setStep] = useState(1); // 1=azienda, 2=sito, 3=scheda

  // Step 1: Azienda
  const [partitaIva, setPartitaIva] = useState('');
  const [ragioneSociale, setRagioneSociale] = useState('');
  
  // Step 2: Sito
  const [sitoMode, setSitoMode] = useState<'select' | 'create'>('select'); // Seleziona esistente o crea nuovo
  const [selectedSito, setSelectedSito] = useState<number | null>(null);
  const [nomeSito, setNomeSito] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedThemeLabel, setSelectedThemeLabel] = useState('');
  const [selectedTipologia, setSelectedTipologia] = useState('');
  const [selectedTipologiaLabel, setSelectedTipologiaLabel] = useState('');
  const [showThemesModal, setShowThemesModal] = useState(false);
  const [showTipologieModal, setShowTipologieModal] = useState(false);
  const [showSitiModal, setShowSitiModal] = useState(false);
  
  // Step 3: Scheda
  const [dataInput, setDataInput] = useState('');
  const [protocollo, setProtocollo] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchThemes());
    // Imposta la data di oggi come default
    const oggi = new Date();
    const day = oggi.getDate().toString().padStart(2, '0');
    const month = (oggi.getMonth() + 1).toString().padStart(2, '0');
    const year = oggi.getFullYear();
    setDataInput(`${day}/${month}/${year}`);
  }, [dispatch]);

  useEffect(() => {
    if (selectedTheme) {
      dispatch(fetchTipologiaSito({ theme: parseInt(selectedTheme) }));
    }
  }, [selectedTheme, dispatch]);

  const handleSelectTheme = (id: number, label: string) => {
    setSelectedTheme(id.toString());
    setSelectedThemeLabel(label);
    setSelectedTipologia('');
    setSelectedTipologiaLabel('');
    setShowThemesModal(false);
  };

  const handleSelectTipologia = (id: number, label: string) => {
    setSelectedTipologia(id.toString());
    setSelectedTipologiaLabel(label);
    setShowTipologieModal(false);
  };

  const validateDate = (text: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(text)) return false;
    
    const [, day, month, year] = text.match(regex)!;
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    if (y < 2000 || y > 2100) return false;
    
    return true;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!partitaIva || !ragioneSociale) {
        Alert.alert('Errore', 'Inserisci Partita IVA e Ragione Sociale');
        return;
      }

      if (!user?.id) {
        Alert.alert('Errore', 'Utente non autenticato');
        return;
      }

      try {
        // Verifica se l'azienda esiste, altrimenti la crea
        await dispatch(
          verifyOrCreateAzienda({
            piva: partitaIva,
            ragionesociale: ragioneSociale,
            idTecnico: user.id,
          })
        ).unwrap();

        // Carica i siti dell'azienda
        await dispatch(fetchSitiByAzienda({ piva: partitaIva })).unwrap();

        setStep(2);
      } catch (error: any) {
        Alert.alert('Errore', error || 'Errore nella gestione dell\'azienda');
      }
    } else if (step === 2) {
      if (sitoMode === 'select' && !selectedSito) {
        Alert.alert('Errore', 'Seleziona un sito esistente o crea un nuovo sito');
        return;
      }

      if (sitoMode === 'create') {
        if (!nomeSito || !selectedTheme || !selectedTipologia) {
          Alert.alert('Errore', 'Compila tutti i campi per creare il sito');
          return;
        }

        if (!user?.id || !currentAzienda) {
          Alert.alert('Errore', 'Dati azienda mancanti');
          return;
        }

        try {
          // Crea il sito
          const gid = await dispatch(
            createSito({
              piva: currentAzienda.partita_iva,
              denominazione: nomeSito,
              tipologiasito_id: parseInt(selectedTipologia),
              userId: user.id,
            })
          ).unwrap();

          setSelectedSito(gid as number);
        } catch (error: any) {
          Alert.alert('Errore', error || 'Errore nella creazione del sito');
          return;
        }
      }

      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!dataInput || !validateDate(dataInput)) {
      Alert.alert('Errore', 'Inserisci una data valida nel formato GG/MM/AAAA');
      return;
    }

    if (!user?.id) {
      Alert.alert('Errore', 'Utente non autenticato');
      return;
    }

    if (!selectedSito) {
      Alert.alert('Errore', 'Sito non selezionato');
      return;
    }

    setSubmitting(true);

    try {
      await dispatch(
        createScheda({
          idTecnico: user.id.toString(),
          motivo: '1', // Tipo visita: 1 = Controllo ordinario
          data: dataInput,
          id_sito: selectedSito.toString(),
          protocollo,
          note,
        })
      ).unwrap();

      Alert.alert('Successo', 'Scheda creata con successo', [
        {
          text: 'OK',
          onPress: () => {
            dispatch(fetchSchede({ userId: user.id.toString(), page: 1, pageSize: 50 }));
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Errore', error || 'Errore nella creazione della scheda');
    } finally {
      setSubmitting(false);
    }
  };

  const isDark = textColor === '#ECEDEE';

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
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={tintColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Nuova Scheda</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressSteps}>
              {[1, 2, 3].map((s) => (
                <View key={s} style={styles.progressStepContainer}>
                  <View
                    style={[
                      styles.progressStep,
                      {
                        backgroundColor: step >= s ? tintColor : (isDark ? '#333' : '#ddd'),
                      },
                    ]}
                  >
                    <Text style={styles.progressStepText}>{s}</Text>
                  </View>
                  {s < 3 && <View style={[styles.progressLine, { backgroundColor: step > s ? tintColor : (isDark ? '#333' : '#ddd') }]} />}
                </View>
              ))}
            </View>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, { color: textColor, opacity: step === 1 ? 1 : 0.5 }]}>Azienda</Text>
              <Text style={[styles.progressLabel, { color: textColor, opacity: step === 2 ? 1 : 0.5 }]}>Sito</Text>
              <Text style={[styles.progressLabel, { color: textColor, opacity: step === 3 ? 1 : 0.5 }]}>Scheda</Text>
            </View>
          </View>

          {/* Step 1: Azienda */}
          {step === 1 && (
            <View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: textColor }]}>Partita IVA *</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                      borderColor: isDark ? '#444' : '#ddd',
                      color: textColor,
                    },
                  ]}
                  value={partitaIva}
                  onChangeText={setPartitaIva}
                  placeholder="Inserisci Partita IVA"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  keyboardType="numeric"
                  maxLength={11}
                />
              </View>
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
                  placeholder="Inserisci Ragione Sociale"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
              </View>
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: tintColor }]}
                onPress={handleNextStep}
                disabled={loadingAzienda}
              >
                {loadingAzienda ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.nextButtonText}>Avanti</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Sito */}
{step === 2 && (
  <View>
    {/* Toggle tra seleziona/crea */}
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor: sitoMode === 'select' ? tintColor : (isDark ? '#2a2a2a' : '#f5f5f5'),
            borderColor: isDark ? '#444' : '#ddd',
          },
        ]}
        onPress={() => setSitoMode('select')}
      >
        <Text
          style={[
            styles.toggleButtonText,
            { color: sitoMode === 'select' ? '#fff' : textColor },
          ]}
        >
          Seleziona Sito
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor: sitoMode === 'create' ? tintColor : (isDark ? '#2a2a2a' : '#f5f5f5'),
            borderColor: isDark ? '#444' : '#ddd',
          },
        ]}
        onPress={() => setSitoMode('create')}
      >
        <Text
          style={[
            styles.toggleButtonText,
            { color: sitoMode === 'create' ? '#fff' : textColor },
          ]}
        >
          Nuovo Sito
        </Text>
      </TouchableOpacity>
    </View>

    {sitoMode === 'select' ? (
      <View style={styles.field}>
        <Text style={[styles.label, { color: textColor }]}>Sito *</Text>
        <TouchableOpacity
          style={[
            styles.selectButton,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
              borderColor: isDark ? '#444' : '#ddd',
            },
          ]}
          onPress={() => setShowSitiModal(true)}
          disabled={loadingSiti || siti.length === 0}
        >
          {loadingSiti ? (
            <ActivityIndicator color={tintColor} />
          ) : (
            <>
              <Text
                style={[
                  styles.selectText,
                  { color: selectedSito ? textColor : (isDark ? '#666' : '#999') },
                ]}
              >
                {selectedSito
                  ? siti.find((s: any) => s.id === selectedSito || s.gid === selectedSito)?.denominazione || 'Sito selezionato'
                  : siti.length > 0
                  ? 'Seleziona sito...'
                  : 'Nessun sito disponibile'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={tintColor} />
            </>
          )}
        </TouchableOpacity>
        {siti.length === 0 && !loadingSiti && (
          <Text style={[styles.helpText, { color: isDark ? '#666' : '#999' }]}>
            Nessun sito trovato per questa azienda. Crea un nuovo sito.
          </Text>
        )}
      </View>
    ) : (
      <>
        <View style={styles.field}>
          <Text style={[styles.label, { color: textColor }]}>Nome Sito *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                borderColor: isDark ? '#444' : '#ddd',
                color: textColor,
              },
            ]}
            value={nomeSito}
            onChangeText={setNomeSito}
            placeholder="Inserisci nome sito"
            placeholderTextColor={isDark ? '#666' : '#999'}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: textColor }]}>Tema *</Text>
          <TouchableOpacity
            style={[
              styles.selectButton,
              {
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                borderColor: isDark ? '#444' : '#ddd',
              },
            ]}
            onPress={() => setShowThemesModal(true)}
            disabled={loadingThemes}
          >
            {loadingThemes ? (
              <ActivityIndicator color={tintColor} />
            ) : (
              <>
                <Text
                  style={[
                    styles.selectText,
                    { color: selectedThemeLabel ? textColor : (isDark ? '#666' : '#999') },
                  ]}
                >
                  {selectedThemeLabel || 'Seleziona tema...'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={tintColor} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: textColor }]}>Tipologia Sito *</Text>
          <TouchableOpacity
            style={[
              styles.selectButton,
              {
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                borderColor: isDark ? '#444' : '#ddd',
              },
            ]}
            onPress={() => setShowTipologieModal(true)}
            disabled={!selectedTheme || loadingTipologie}
          >
            {loadingTipologie ? (
              <ActivityIndicator color={tintColor} />
            ) : (
              <>
                <Text
                  style={[
                    styles.selectText,
                    { color: selectedTipologiaLabel ? textColor : (isDark ? '#666' : '#999') },
                  ]}
                >
                  {selectedTipologiaLabel || 'Seleziona tipologia...'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={tintColor} />
              </>
            )}
          </TouchableOpacity>
          {!selectedTheme && (
            <Text style={[styles.helpText, { color: isDark ? '#666' : '#999' }]}>
              Seleziona prima un tema
            </Text>
          )}
        </View>
      </>
    )}

    <View style={styles.buttonRow}>
      <TouchableOpacity
        style={[styles.backButton, { borderColor: isDark ? '#444' : '#ddd' }]}
        onPress={() => setStep(1)}
      >
        <MaterialIcons name="arrow-back" size={20} color={textColor} />
        <Text style={[styles.backButtonText, { color: textColor }]}>Indietro</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: tintColor, flex: 1 }]}
        onPress={handleNextStep}
        disabled={loadingSiti}
      >
        {loadingSiti ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.nextButtonText}>Avanti</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </View>
  </View>
)}

          {/* Step 3: Scheda */}
          {step === 3 && (
            <View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: textColor }]}>Data Sopralluogo *</Text>
                <View style={styles.dateInputContainer}>
                  <MaterialIcons name="event" size={20} color={tintColor} style={styles.dateIcon} />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                        borderColor: isDark ? '#444' : '#ddd',
                        color: textColor,
                        flex: 1,
                      },
                    ]}
                    value={dataInput}
                    onChangeText={setDataInput}
                    placeholder="GG/MM/AAAA"
                    placeholderTextColor={isDark ? '#666' : '#999'}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                <Text style={[styles.helpText, { color: isDark ? '#666' : '#999' }]}>
                  Formato: GG/MM/AAAA (es. 15/01/2026)
                </Text>
              </View>

              {/* Protocollo */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: textColor }]}>Protocollo</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                      borderColor: isDark ? '#444' : '#ddd',
                      color: textColor,
                    },
                  ]}
                  value={protocollo}
                  onChangeText={setProtocollo}
                  placeholder="Numero protocollo"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
              </View>

              {/* Note */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: textColor }]}>Note</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                      borderColor: isDark ? '#444' : '#ddd',
                      color: textColor,
                    },
                  ]}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Note aggiuntive..."
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Submit Button */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.backButton, { borderColor: isDark ? '#444' : '#ddd' }]}
                  onPress={() => setStep(2)}
                >
                  <MaterialIcons name="arrow-back" size={20} color={textColor} />
                  <Text style={[styles.backButtonText, { color: textColor }]}>Indietro</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: tintColor, flex: 1 },
                    submitting && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <MaterialIcons name="check" size={20} color="#fff" />
                      <Text style={styles.submitButtonText}>Crea Scheda</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal per selezione tema */}
      <Modal
        visible={showThemesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowThemesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: isDark ? '#333' : '#eee' },
              ]}
            >
              <Text style={[styles.modalTitle, { color: textColor }]}>
                Seleziona Tema
              </Text>
              <TouchableOpacity onPress={() => setShowThemesModal(false)}>
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={themes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor:
                        selectedTheme === item.id.toString()
                          ? (isDark ? '#2a2a2a' : '#f0f0f0')
                          : 'transparent',
                      borderBottomColor: isDark ? '#333' : '#eee',
                    },
                  ]}
                  onPress={() => handleSelectTheme(item.id, item.theme)}
                >
                  <Text style={[styles.modalItemText, { color: textColor }]}>
                    {item.theme}
                  </Text>
                  {selectedTheme === item.id.toString() && (
                    <MaterialIcons name="check" size={20} color={tintColor} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal per selezione tipologia */}
      <Modal
        visible={showTipologieModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTipologieModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: isDark ? '#333' : '#eee' },
              ]}
            >
              <Text style={[styles.modalTitle, { color: textColor }]}>
                Seleziona Tipologia
              </Text>
              <TouchableOpacity onPress={() => setShowTipologieModal(false)}>
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={tipologie}
              keyExtractor={(item) => item.tipologiasito_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor:
                        selectedTipologia === item.tipologiasito_id.toString()
                          ? (isDark ? '#2a2a2a' : '#f0f0f0')
                          : 'transparent',
                      borderBottomColor: isDark ? '#333' : '#eee',
                    },
                  ]}
                  onPress={() => handleSelectTipologia(item.tipologiasito_id, item.tipologiasito)}
                >
                  <Text style={[styles.modalItemText, { color: textColor }]}>
                    {item.tipologiasito}
                  </Text>
                  {selectedTipologia === item.tipologiasito_id.toString() && (
                    <MaterialIcons name="check" size={20} color={tintColor} />
                  )}
                </TouchableOpacity>
              )}
            />

            {/* Modal per selezione siti */}
<Modal
  visible={showSitiModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowSitiModal(false)}
>
  <View style={styles.modalOverlay}>
    <View
      style={[
        styles.modalContent,
        { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
      ]}
    >
      <View
        style={[
          styles.modalHeader,
          { borderBottomColor: isDark ? '#333' : '#eee' },
        ]}
      >
        <Text style={[styles.modalTitle, { color: textColor }]}>
          Seleziona Sito
        </Text>
        <TouchableOpacity onPress={() => setShowSitiModal(false)}>
          <MaterialIcons name="close" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={siti}
        keyExtractor={(item: any) => (item.id || item.gid).toString()}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={[
              styles.modalItem,
              {
                backgroundColor:
                  selectedSito === item.id || selectedSito === item.gid
                    ? (isDark ? '#2a2a2a' : '#f0f0f0')
                    : 'transparent',
                borderBottomColor: isDark ? '#333' : '#eee',
              },
            ]}
            onPress={() => {
              setSelectedSito(item.id || item.gid);
              setShowSitiModal(false);
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalItemText, { color: textColor }]}>
                {item.denominazione || item.denominaz}
              </Text>
              {item.comune && (
                <Text style={{ fontSize: 12, color: isDark ? '#999' : '#666', marginTop: 4 }}>
                  {item.comune}
                </Text>
              )}
            </View>
            {(selectedSito === item.id || selectedSito === item.gid) && (
              <MaterialIcons name="check" size={20} color={tintColor} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  </View>
</Modal>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  selectText: {
    fontSize: 16,
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateIcon: {
    marginLeft: 4,
  },
  helpText: {
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 100,
  },
  progressContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  progressLine: {
    height: 2,
    width: 40,
    marginHorizontal: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    flex: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NuovaSchedaScreen;
