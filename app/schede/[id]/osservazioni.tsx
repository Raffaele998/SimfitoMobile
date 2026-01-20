import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useThemeColor } from '../../../hooks/use-theme-color';
import { useAppDispatch, useAppSelector } from '../../../src/store/hooks';
import { selectAuth } from '../../../src/store/slices/authSlice';
import { fetchOsservazioni, selectOsservazioni } from '../../../src/store/slices/osservazioniSlice';
import { selectSchede } from '../../../src/store/slices/schedeSlice';

const getPresenzaColor = (presente?: string, risultatoAnalisi?: string): string => {
  if (risultatoAnalisi === 'Positivo' || presente === 'presente') return '#F44336';
  if (risultatoAnalisi === 'Negativo' || presente === 'non presente') return '#4CAF50';
  if (presente === 'da verificare') return '#FFC107';
  return '#9E9E9E';
};

const OsservazioniScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(selectSchede);
  const { user } = useAppSelector(selectAuth);
  const { items: osservazioni, loading, error } = useAppSelector(selectOsservazioni);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const scheda = items.find((item) => item.idscheda === id);

  // Condizioni per poter modificare: solo stato = 0 (in attesa)
  // Tutti i tecnici loggati possono aggiungere osservazioni se la scheda è in attesa
  const schedaStato = scheda?.stato ? Number(scheda.stato) : null;
  const canAddOsservazioni = schedaStato === 0 && user?.id !== undefined;

  useEffect(() => {
    if (user?.id && id) {
      dispatch(fetchOsservazioni({
        userId: user.id.toString(),
        filters: { scheda_id: id }
      }) as any);
    }
  }, [user?.id, id, dispatch]);

  if (!scheda) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.container, { backgroundColor }]}>
          <TouchableOpacity
            style={[styles.header, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a', borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={tintColor} />
            <Text style={[styles.headerTitle, { color: textColor }]}>Osservazioni</Text>
            <View style={{ width: 24 }} />
          </TouchableOpacity>
          <View style={styles.center}>
            <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
            <Text style={[styles.errorText, { color: textColor }]}>Scheda non trovata</Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <TouchableOpacity
          style={[styles.header, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a', borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={tintColor} />
          <Text style={[styles.headerTitle, { color: textColor }]}>Osservazioni</Text>
          <View style={{ width: 24 }} />
      </TouchableOpacity>

      <View style={[styles.schemaCard, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}>
        <View style={styles.schemaHeader}>
          <View>
            <Text style={[styles.schemaTitle, { color: textColor }]}>Scheda: {scheda.protocollo}</Text>
            <Text style={[styles.schemaSubtitle, { color: textColor === '#11181C' ? '#999' : '#666' }]}>ID: {scheda.idscheda}</Text>
            <Text style={[styles.schemaSubtitle, { color: textColor === '#11181C' ? '#999' : '#666' }]}>
              Stato: {scheda.statodesc || (schedaStato === 0 ? 'In attesa' : 'Confermata')}
            </Text>
          </View>
          {canAddOsservazioni && (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: tintColor }]}
              onPress={() => router.push({ pathname: '/nuova-osservazione', params: { idscheda: id } })}
            >
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Nuova</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {schedaStato !== null && schedaStato !== 0 && (
          <View style={[styles.warningBanner, { backgroundColor: textColor === '#11181C' ? '#fff3cd' : '#3a2f2a' }]}>
            <MaterialIcons name="lock" size={18} color={textColor === '#11181C' ? '#856404' : '#ffa726'} />
            <Text style={[styles.warningText, { color: textColor === '#11181C' ? '#856404' : '#ffa726' }]}>
              Scheda confermata: le osservazioni sono in sola lettura
            </Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={tintColor} />
          <Text style={[styles.loadingText, { color: textColor }]}>Caricamento osservazioni...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
          <Text style={[styles.errorText, { color: textColor }]}>{error}</Text>
        </View>
      ) : osservazioni.length > 0 ? (
        <View style={styles.listContainer}>
          {osservazioni.map((obs, index) => (
            <TouchableOpacity
              key={`${obs.idosservazioni}-${obs.parassita}-${index}`}
              style={[styles.obsCard, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a', borderLeftColor: getPresenzaColor(obs.presente, obs.lobaratory_result) }]}
              onPress={() => {
                router.push({
                  pathname: `/osservazioni/${obs.idosservazioni}`,
                  params: {
                    idscheda: id?.toString() || '',
                    statoScheda: schedaStato?.toString() || '0'
                  }
                });
              }}
            >
              <ObsRow label="Ospite" value={obs.ospite || obs.nome_ospite || '-'} textColor={textColor} />
              <ObsRow label="Parassita" value={obs.parassita || obs.nome_parassita || '-'} textColor={textColor} />
              <ObsRow label="Presente" value={obs.presente || '-'} textColor={textColor} valueColor={getPresenzaColor(obs.presente, obs.lobaratory_result)} />
              <ObsRow label="Risultato Analisi" value={obs.lobaratory_result || '-'} textColor={textColor} valueColor={obs.lobaratory_result === 'Positivo' ? '#F44336' : obs.lobaratory_result === 'Negativo' ? '#4CAF50' : undefined} />
              <ObsRow label="Serie Campione" value={obs.codice || '-'} textColor={textColor} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.centerContent}>
          <MaterialIcons name="visibility-off" size={48} color={textColor === '#11181C' ? '#999' : '#666'} />
          <Text style={[styles.emptyText, { color: textColor === '#11181C' ? '#999' : '#666' }]}>
            Nessuna osservazione registrata per questa scheda
          </Text>
        </View>
      )}

      <View style={{ height: 20 }} />
      </ScrollView>
    </>
  );
};

interface ObsRowProps {
  label: string;
  value: string;
  textColor: string;
  valueColor?: string;
}

const ObsRow: React.FC<ObsRowProps> = ({ label, value, textColor, valueColor }) => (
  <View style={styles.obsRow}>
    <Text style={[styles.obsLabel, { color: textColor === '#11181C' ? '#666' : '#888' }]}>{label}</Text>
    <Text style={[styles.obsValue, { color: valueColor || textColor }]} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  schemaCard: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  schemaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  schemaTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  schemaSubtitle: {
    fontSize: 12,
    marginBottom: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    marginTop: 12,
    borderRadius: 6,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  obsCard: {
    borderLeftWidth: 4,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  obsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  obsLabel: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  obsValue: {
    fontSize: 13,
    flex: 1.5,
    textAlign: 'right',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default OsservazioniScreen;
