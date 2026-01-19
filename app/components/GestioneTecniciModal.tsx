import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { selectAuth } from '../../src/store/slices/authSlice';
import { selectSettings } from '../../src/store/slices/settingsSlice';
import {
    associaTecnico,
    fetchAllTecnici,
    fetchSchedaTecnici,
    rimuoviTecnico,
    selectTecnici,
} from '../../src/store/slices/tecniciSlice';

interface GestioneTecniciModalProps {
  visible: boolean;
  onClose: () => void;
  idscheda: number;
}

const GestioneTecniciModal: React.FC<GestioneTecniciModalProps> = ({
  visible,
  onClose,
  idscheda,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { theme } = useAppSelector(selectSettings);
  const { allTecnici, schedaTecnici, loading } = useAppSelector(selectTecnici);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const isDark = theme === 'dark';

  const [showAddModal, setShowAddModal] = useState(false);

  // Verifica permessi utente (Amministratori 0-1 e Ispettori 2+ possono gestire tecnici)
  const canManageTecnici = user?.type !== undefined && Number(user.type) <= 2;

  useEffect(() => {
    if (visible) {
      dispatch(fetchSchedaTecnici(idscheda));
      if (canManageTecnici) {
        dispatch(fetchAllTecnici());
      }
    }
  }, [visible, idscheda, dispatch, canManageTecnici]);

  const handleAssociaTecnico = async (id_tecnico: number) => {
    try {
      await dispatch(associaTecnico({ idscheda, id_tecnico })).unwrap();
      Alert.alert('Successo', 'Tecnico associato con successo');
      dispatch(fetchSchedaTecnici(idscheda));
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Errore', 'Impossibile associare il tecnico');
    }
  };

  const handleRimuoviTecnico = async (id_tecnico: number | string, nome: string) => {
    console.log('handleRimuoviTecnico chiamato con:', { idscheda, id_tecnico, nome });
    
    // Converti id_tecnico a numero se è una stringa
    const tecnicoId = typeof id_tecnico === 'string' ? parseInt(id_tecnico, 10) : id_tecnico;
    
    console.log('Tentativo rimozione tecnico:', { idscheda, id_tecnico: tecnicoId });
    try {
      const result = await dispatch(rimuoviTecnico({ idscheda, id_tecnico: tecnicoId })).unwrap();
      console.log('Tecnico rimosso con successo:', result);
      Alert.alert('Successo', 'Tecnico rimosso con successo');
      dispatch(fetchSchedaTecnici(idscheda));
    } catch (error) {
      console.error('Errore rimozione tecnico:', error);
      Alert.alert('Errore', 'Impossibile rimuovere il tecnico');
    }
  };

  // Tecnici disponibili da aggiungere (non già associati)
  const tecniciDisponibili = allTecnici.filter(
    (t) => !schedaTecnici.some((st) => st.id_tecnico === t.id_tecnico)
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: tintColor }]}>
            <Text style={styles.headerTitle}>Tecnici Associati</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Lista tecnici associati */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={tintColor} />
            </View>
          ) : (
            <>
              <FlatList
                data={schedaTecnici}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={[styles.tecnicoItem, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
                    <View style={styles.tecnicoInfo}>
                      <MaterialIcons name="person" size={24} color={tintColor} />
                      <View style={styles.tecnicoText}>
                        <Text style={[styles.tecnicoNome, { color: textColor }]}>
                          {item.nome_tecnico || `${item.nome} ${item.cognome}`}
                        </Text>
                        {item.tipotecnico && (
                          <Text style={[styles.tecnicoTipo, { color: isDark ? '#888' : '#666' }]}>
                            {item.tipotecnico}
                          </Text>
                        )}
                      </View>
                    </View>
                    {canManageTecnici && (
                      <TouchableOpacity
                        onPress={() => handleRimuoviTecnico(item.id_tecnico, item.nome_tecnico || `${item.nome} ${item.cognome}`)}
                        style={styles.removeButton}
                      >
                        <MaterialIcons name="remove-circle" size={24} color="#d32f2f" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <MaterialIcons name="people-outline" size={48} color={isDark ? '#555' : '#ccc'} />
                    <Text style={[styles.emptyText, { color: isDark ? '#666' : '#999' }]}>
                      Nessun tecnico associato
                    </Text>
                  </View>
                }
                contentContainerStyle={schedaTecnici.length === 0 ? styles.emptyList : undefined}
              />

              {/* Pulsante aggiungi tecnico */}
              {canManageTecnici && (
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: tintColor }]}
                  onPress={() => setShowAddModal(true)}
                >
                  <MaterialIcons name="add" size={24} color="#fff" />
                  <Text style={styles.addButtonText}>Aggiungi Tecnico</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* Modal per aggiungere tecnico */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.addModalContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
            <View style={[styles.header, { backgroundColor: tintColor }]}>
              <Text style={styles.headerTitle}>Seleziona Tecnico</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={tecniciDisponibili}
              keyExtractor={(item) => item.id_tecnico.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.tecnicoSelectItem, { borderBottomColor: isDark ? '#333' : '#eee' }]}
                  onPress={() => handleAssociaTecnico(item.id_tecnico)}
                >
                  <MaterialIcons name="person-add" size={24} color={tintColor} />
                  <Text style={[styles.tecnicoSelectNome, { color: textColor }]}>
                    {item.nome}
                  </Text>
                  <MaterialIcons name="chevron-right" size={24} color={isDark ? '#555' : '#ccc'} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: isDark ? '#666' : '#999' }]}>
                    Nessun tecnico disponibile
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  addModalContainer: {
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tecnicoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  tecnicoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tecnicoText: {
    marginLeft: 12,
    flex: 1,
  },
  tecnicoNome: {
    fontSize: 16,
    fontWeight: '500',
  },
  tecnicoTipo: {
    fontSize: 12,
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tecnicoSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  tecnicoSelectNome: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
});

export default GestioneTecniciModal;
