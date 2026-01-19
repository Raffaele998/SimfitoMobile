import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useThemeColor } from '../hooks/use-theme-color';
import apiClient from '../src/services/api/client';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { fetchOsservazioni } from '../src/store/slices/osservazioniSlice';
import { selectSettings } from '../src/store/slices/settingsSlice';

const NuovaOsservazioneScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { idscheda } = useLocalSearchParams();
  const { theme } = useAppSelector(selectSettings);
  
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(false);
  const [searchingHost, setSearchingHost] = useState(false);
  const [searchingPest, setSearchingPest] = useState(false);
  
  const [showHostModal, setShowHostModal] = useState(false);
  const [showPestModal, setShowPestModal] = useState(false);
  
  const [hostTab, setHostTab] = useState<'rend' | 'eppo' | 'ord'>('rend');
  const [hostQuery, setHostQuery] = useState('');
  const [pestQuery, setPestQuery] = useState('');
  const [hostResults, setHostResults] = useState<any[]>([]);
  const [pestResults, setPestResults] = useState<any[]>([]);
  
  const [selectedHost, setSelectedHost] = useState<any>(null);
  const [selectedPest, setSelectedPest] = useState<any>(null);

  // Carica automaticamente gli host quando cambia il tab
  useEffect(() => {
    loadHosts(hostTab);
  }, [hostTab]);

  const loadHosts = async (tab: 'rend' | 'eppo' | 'ord') => {
    setSearchingHost(true);
    try {
      const modeMap = {
        rend: 'host_rend',
        eppo: 'plant',
        ord: 'host_ord',
      };
      
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: modeMap[tab],
          query: '',
          start: 0,
          limit: 100,
        },
      });
      
      if (response.data.data) {
        setHostResults(response.data.data);
      }
    } catch (error) {
      console.error('Errore caricamento ospiti:', error);
    } finally {
      setSearchingHost(false);
    }
  };

  const searchHosts = async (query: string, tab: 'rend' | 'eppo' | 'ord') => {
    
    setSearchingHost(true);
    try {
      // Endpoint diversi per ogni tab
      const modeMap = {
        rend: 'host_rend',
        eppo: 'plant',
        ord: 'host_ord',
      };
      
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: modeMap[tab],
          query: query,
          start: 0,
          limit: 20,
        },
      });
      
      if (response.data.data) {
        setHostResults(response.data.data);
      }
    } catch (error) {
      console.error('Errore ricerca ospiti:', error);
    } finally {
      setSearchingHost(false);
    }
  };

  const searchPests = async (query: string) => {
    if (query.length < 3) {
      setPestResults([]);
      return;
    }
    
    setSearchingPest(true);
    try {
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: 'parassitinew',
          query: query,
          limit: 20,
        },
      });
      
      if (response.data.data) {
        setPestResults(response.data.data);
      }
    } catch (error) {
      console.error('Errore ricerca parassiti:', error);
    } finally {
      setSearchingPest(false);
    }
  };

  const searchPestsForHost = async (hostCodeid: string, hostBcode: string) => {
    setSearchingPest(true);
    try {
      // Mappa dei mode in base al tab selezionato
      const modeMap = {
        'rend': 'rndPests',  // DB Rendicontazione - tabella simfito.rendicontati
        'eppo': 'pests',     // DB EPPO - query ricorsiva su t_baylink + r_attack
        'ord': 'ordPests',   // DB Regionale - tabella simfito.ordinari
      };
      
      const response = await apiClient.get('/services/ajax.php', {
        params: {
          mode: modeMap[hostTab],
          codeid: hostCodeid,
          bcode: hostBcode,
          limit: 100,
        },
      });
      
      if (response.data.data) {
        setPestResults(response.data.data);
      }
    } catch (error) {
      console.error('Errore ricerca parassiti per host:', error);
    } finally {
      setSearchingPest(false);
    }
  };

  const handleSave = async () => {
    if (!selectedHost || !selectedPest) {
      Alert.alert('Errore', 'Seleziona sia ospite che parassita');
      return;
    }

    setLoading(true);
    try {
      // pest_id è il codeid del parassita (diverso nome a seconda dell'endpoint)
      const pestCodeid = selectedPest.pest_id || selectedPest.codeid;
      
      const response = await apiClient.post(
        '/services/ajax-save-form.php',
        `mode=pestobs&idscheda=${idscheda}&host=${selectedHost.codeid}&id_pest=${pestCodeid}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.success || response.data.succes !== false) {
        // Aggiorna la cache delle osservazioni per questa scheda
        await dispatch(fetchOsservazioni({ 
          userId: '1', 
          filters: { scheda_id: Number(idscheda) } 
        }));
        router.back();
      } else {
        Alert.alert('Errore', response.data.errors?.reason || 'Impossibile salvare l\'osservazione');
      }
    } catch (error) {
      console.error('Errore salvataggio:', error);
      Alert.alert('Errore', 'Impossibile salvare l\'osservazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor }]}>
        {/* Header */}
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
          <Text style={[styles.headerTitle, { color: textColor }]}>
            Nuova Osservazione
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={[styles.infoCard, { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}>
            <MaterialIcons name="info" size={20} color={tintColor} />
            <Text style={[styles.infoText, { color: textColor }]}>
              Scheda: {idscheda}
            </Text>
          </View>

          {/* Ricerca Ospite */}
          <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff', borderColor }]}>
            <Text style={[styles.label, { color: textColor }]}>Pianta Ospite *</Text>
            
            {/* Tab per i database */}
            {!selectedHost && (
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    hostTab === 'rend' && styles.tabActive,
                    { borderColor, backgroundColor: hostTab === 'rend' ? tintColor : 'transparent' }
                  ]}
                  onPress={() => setHostTab('rend')}
                >
                  <Text style={[styles.tabText, { color: hostTab === 'rend' ? '#fff' : textColor }]}>
                    DB Rendicontazione
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.tab,
                    hostTab === 'eppo' && styles.tabActive,
                    { borderColor, backgroundColor: hostTab === 'eppo' ? tintColor : 'transparent' }
                  ]}
                  onPress={() => setHostTab('eppo')}
                >
                  <Text style={[styles.tabText, { color: hostTab === 'eppo' ? '#fff' : textColor }]}>
                    DB EPPO
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.tab,
                    hostTab === 'ord' && styles.tabActive,
                    { borderColor, backgroundColor: hostTab === 'ord' ? tintColor : 'transparent' }
                  ]}
                  onPress={() => setHostTab('ord')}
                >
                  <Text style={[styles.tabText, { color: hostTab === 'ord' ? '#fff' : textColor }]}>
                    DB Regionale
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {selectedHost ? (
              <View style={[styles.selectedItem, { backgroundColor: isDark ? '#2a2a2a' : '#e3f2fd' }]}>
                <View style={styles.selectedContent}>
                  <Text style={[styles.selectedCode, { color: tintColor }]}>{selectedHost.b_code}</Text>
                  <Text style={[styles.selectedName, { color: textColor }]}>{selectedHost.name}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                  setSelectedHost(null);
                  setPestResults([]);
                  setSelectedPest(null);
                }}>
                  <MaterialIcons name="close" size={24} color="#d32f2f" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.pickerButton, { borderColor, backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}
                onPress={() => setShowHostModal(true)}
              >
                <Text style={[styles.pickerText, { color: isDark ? '#999' : '#666' }]}>
                  Seleziona pianta ospite...
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={isDark ? '#999' : '#666'} />
              </TouchableOpacity>
            )}
          </View>

          {/* Ricerca Parassita */}
          <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff', borderColor }]}>
            <Text style={[styles.label, { color: textColor }]}>Parassita *</Text>
            {selectedPest ? (
              <View style={[styles.selectedItem, { backgroundColor: isDark ? '#2a2a2a' : '#e3f2fd' }]}>
                <View style={styles.selectedContent}>
                  <Text style={[styles.selectedCode, { color: tintColor }]}>{selectedPest.baycode_pest || selectedPest.b_code}</Text>
                  <Text style={[styles.selectedName, { color: textColor }]}>{selectedPest.pest_name || selectedPest.fullname}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedPest(null)}>
                  <MaterialIcons name="close" size={24} color="#d32f2f" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.pickerButton, { borderColor, backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}
                onPress={() => {
                  if (!selectedHost) {
                    Alert.alert('Attenzione', 'Seleziona prima la pianta ospite');
                    return;
                  }
                  setShowPestModal(true);
                }}
                disabled={!selectedHost}
              >
                <Text style={[styles.pickerText, { color: !selectedHost ? '#ccc' : (isDark ? '#999' : '#666') }]}>
                  {!selectedHost ? 'Seleziona prima l\'ospite' : 'Seleziona parassita...'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={!selectedHost ? '#ccc' : (isDark ? '#999' : '#666')} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Modale Selezione Host */}
        {showHostModal && (
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              activeOpacity={1} 
              onPress={() => setShowHostModal(false)}
            />
            <View style={[styles.modalContent, { backgroundColor }]}>
              <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
                <Text style={[styles.modalTitle, { color: textColor }]}>Seleziona Pianta Ospite</Text>
                <TouchableOpacity onPress={() => setShowHostModal(false)}>
                  <MaterialIcons name="close" size={24} color={textColor} />
                </TouchableOpacity>
              </View>

              {/* Tab per i database */}
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    hostTab === 'rend' && styles.tabActive,
                    { borderColor, backgroundColor: hostTab === 'rend' ? tintColor : 'transparent' }
                  ]}
                  onPress={() => setHostTab('rend')}
                >
                  <Text style={[styles.tabText, { color: hostTab === 'rend' ? '#fff' : textColor }]}>
                    Rendicontazione
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.tab,
                    hostTab === 'eppo' && styles.tabActive,
                    { borderColor, backgroundColor: hostTab === 'eppo' ? tintColor : 'transparent' }
                  ]}
                  onPress={() => setHostTab('eppo')}
                >
                  <Text style={[styles.tabText, { color: hostTab === 'eppo' ? '#fff' : textColor }]}>
                    EPPO
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.tab,
                    hostTab === 'ord' && styles.tabActive,
                    { borderColor, backgroundColor: hostTab === 'ord' ? tintColor : 'transparent' }
                  ]}
                  onPress={() => setHostTab('ord')}
                >
                  <Text style={[styles.tabText, { color: hostTab === 'ord' ? '#fff' : textColor }]}>
                    Regionale
                  </Text>
                </TouchableOpacity>
              </View>

              {searchingHost ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={tintColor} />
                  <Text style={[styles.loadingText, { color: textColor }]}>Caricamento ospiti...</Text>
                </View>
              ) : (
                <ScrollView style={styles.modalList}>
                  {hostResults.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.modalItem, { borderBottomColor: borderColor }]}
                      onPress={() => {
                        setSelectedHost(item);
                        setShowHostModal(false);
                        searchPestsForHost(item.codeid, item.b_code);
                      }}
                    >
                      <Text style={[styles.resultCode, { color: tintColor }]}>{item.b_code}</Text>
                      <Text style={[styles.resultName, { color: textColor }]}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        )}

        {/* Modale Selezione Parassita */}
        {showPestModal && (
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              activeOpacity={1} 
              onPress={() => setShowPestModal(false)}
            />
            <View style={[styles.modalContent, { backgroundColor }]}>
              <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
                <Text style={[styles.modalTitle, { color: textColor }]}>Seleziona Parassita</Text>
                <TouchableOpacity onPress={() => setShowPestModal(false)}>
                  <MaterialIcons name="close" size={24} color={textColor} />
                </TouchableOpacity>
              </View>

              {searchingPest ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={tintColor} />
                  <Text style={[styles.loadingText, { color: textColor }]}>Caricamento parassiti...</Text>
                </View>
              ) : pestResults.length === 0 ? (
                <View style={styles.loadingContainer}>
                  <MaterialIcons name="info" size={48} color={isDark ? '#666' : '#ccc'} />
                  <Text style={[styles.loadingText, { color: textColor }]}>Nessun parassita trovato per questo ospite</Text>
                </View>
              ) : (
                <ScrollView style={styles.modalList}>
                  {pestResults.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.modalItem, { borderBottomColor: borderColor }]}
                      onPress={() => {
                        setSelectedPest(item);
                        setShowPestModal(false);
                      }}
                    >
                      <Text style={[styles.resultCode, { color: tintColor }]}>{item.baycode_pest || item.b_code}</Text>
                      <Text style={[styles.resultName, { color: textColor }]}>{item.pest_name || item.fullname}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        )}

        {/* Pulsanti */}
        <View style={[styles.footer, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderTopColor: borderColor }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor }]}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={[styles.cancelButtonText, { color: textColor }]}>Annulla</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: tintColor },
              (!selectedHost || !selectedPest || loading) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!selectedHost || !selectedPest || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="check" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Salva</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
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
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  results: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  resultCode: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultName: {
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabActive: {
    // backgroundColor handled inline
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  selectedContent: {
    flex: 1,
  },
  selectedCode: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedName: {
    fontSize: 14,
  },
  spacer: {
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  pickerText: {
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContent: {
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
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
  modalList: {
    flex: 1,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
});

export default NuovaOsservazioneScreen;
