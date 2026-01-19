import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { fetchOsservazioni, selectOsservazioni } from '../../src/store/slices/osservazioniSlice';
import { selectSettings } from '../../src/store/slices/settingsSlice';

interface OsservazioniListProps {
  idscheda: number;
  stato: number; // 0 = in attesa, 2/-1 = confermata
  canEdit?: boolean; // permessi utente
}

const OsservazioniList: React.FC<OsservazioniListProps> = ({ idscheda, stato, canEdit = false }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items: osservazioni, loading } = useAppSelector(selectOsservazioni);
  const { theme } = useAppSelector(selectSettings);
  
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const isDark = theme === 'dark';

  // Condizioni per poter modificare: stato = 0 (in attesa) E utente con permessi
  const canAddOsservazioni = stato === 0 && canEdit;

  useEffect(() => {
    // Carica osservazioni per questa scheda
    dispatch(fetchOsservazioni({ 
      userId: '0', // dummy, filtrato dopo
      filters: { scheda_id: idscheda } 
    }));
  }, [idscheda, dispatch]);

  const handleAddOsservazione = () => {
    // Naviga alla schermata di creazione osservazione
    router.push({
      pathname: '/nuova-osservazione',
      params: { idscheda }
    });
  };

  const renderOsservazione = ({ item }: { item: any }) => {
    const getRilevatoColor = (rilevato: number) => {
      if (rilevato === 0) return '#f44336'; // non presente - rosso
      if (rilevato === 1) return '#4caf50'; // presente - verde
      return '#ff9800'; // da verificare - arancione
    };

    const getRilevatoText = (rilevato: number) => {
      if (rilevato === 0) return 'Non presente';
      if (rilevato === 1) return 'Presente';
      return 'Da verificare';
    };

    return (
      <TouchableOpacity
        style={[
          styles.osservazioneCard,
          { 
            backgroundColor: isDark ? '#1e1e1e' : '#fff',
            borderColor: borderColor,
          }
        ]}
        onPress={() => {
          // Naviga al dettaglio osservazione
          router.push({
            pathname: `/osservazioni/${item.idosservazioni}`,
            params: { canEdit: canAddOsservazioni }
          });
        }}
      >
        <View style={styles.osservazioneHeader}>
          <View style={styles.osservazioneTitle}>
            <MaterialIcons name="visibility" size={20} color={tintColor} />
            <Text style={[styles.osservazioneTitleText, { color: textColor }]}>
              Osservazione #{item.idosservazioni}
            </Text>
          </View>
          {item.rilevato !== undefined && (
            <View style={[styles.rilevatoBadge, { backgroundColor: getRilevatoColor(item.rilevato) }]}>
              <Text style={styles.rilevatoText}>{getRilevatoText(item.rilevato)}</Text>
            </View>
          )}
        </View>

        <View style={styles.osservazioneBody}>
          {item.ospite && (
            <View style={styles.infoRow}>
              <MaterialIcons name="eco" size={16} color={isDark ? '#888' : '#666'} />
              <Text style={[styles.infoLabel, { color: isDark ? '#888' : '#666' }]}>Ospite:</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{item.ospite}</Text>
            </View>
          )}
          
          {item.parassita && (
            <View style={styles.infoRow}>
              <MaterialIcons name="bug-report" size={16} color={isDark ? '#888' : '#666'} />
              <Text style={[styles.infoLabel, { color: isDark ? '#888' : '#666' }]}>Parassita:</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{item.parassita}</Text>
            </View>
          )}

          {item.nome_intensity && (
            <View style={styles.infoRow}>
              <MaterialIcons name="show-chart" size={16} color={isDark ? '#888' : '#666'} />
              <Text style={[styles.infoLabel, { color: isDark ? '#888' : '#666' }]}>Intensità:</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{item.nome_intensity}</Text>
            </View>
          )}

          {item.nome_grado && (
            <View style={styles.infoRow}>
              <MaterialIcons name="assessment" size={16} color={isDark ? '#888' : '#666'} />
              <Text style={[styles.infoLabel, { color: isDark ? '#888' : '#666' }]}>Grado:</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{item.nome_grado}</Text>
            </View>
          )}

          {item.campione && (
            <View style={styles.campioneBadge}>
              <MaterialIcons name="science" size={14} color="#2196f3" />
              <Text style={styles.campioneText}>Campione prelevato</Text>
            </View>
          )}

          {item.completa === 'false' && (
            <View style={[styles.incompletaBadge, { backgroundColor: isDark ? '#3a2f2a' : '#fff3cd' }]}>
              <MaterialIcons name="warning" size={14} color="#ff9800" />
              <Text style={[styles.incompletaText, { color: isDark ? '#ffa726' : '#856404' }]}>
                Incompleta
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <MaterialIcons name="list-alt" size={24} color={tintColor} />
          <Text style={[styles.headerText, { color: textColor }]}>
            Osservazioni ({osservazioni.length})
          </Text>
        </View>
        
        {canAddOsservazioni && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: tintColor }]}
            onPress={handleAddOsservazione}
          >
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Aggiungi</Text>
          </TouchableOpacity>
        )}
      </View>

      {stato !== 0 && (
        <View style={[styles.warningBanner, { backgroundColor: isDark ? '#3a2f2a' : '#fff3cd' }]}>
          <MaterialIcons name="lock" size={18} color={isDark ? '#ffa726' : '#856404'} />
          <Text style={[styles.warningText, { color: isDark ? '#ffa726' : '#856404' }]}>
            Scheda confermata: le osservazioni sono in sola lettura
          </Text>
        </View>
      )}

      <FlatList
        data={osservazioni}
        renderItem={renderOsservazione}
        keyExtractor={(item) => item.idosservazioni}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="visibility-off" size={48} color={isDark ? '#555' : '#ccc'} />
            <Text style={[styles.emptyText, { color: isDark ? '#666' : '#999' }]}>
              Nessuna osservazione presente
            </Text>
            {canAddOsservazioni && (
              <Text style={[styles.emptyHint, { color: isDark ? '#888' : '#666' }]}>
                Tocca "Aggiungi" per creare la prima osservazione
              </Text>
            )}
          </View>
        }
        contentContainerStyle={osservazioni.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 6,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
  },
  osservazioneCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  osservazioneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  osservazioneTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  osservazioneTitleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rilevatoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rilevatoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  osservazioneBody: {
    padding: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  campioneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  campioneText: {
    color: '#2196f3',
    fontSize: 12,
    fontWeight: '500',
  },
  incompletaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  incompletaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default OsservazioniList;
