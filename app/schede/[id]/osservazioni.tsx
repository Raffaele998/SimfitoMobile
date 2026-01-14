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
        <Text style={[styles.schemaTitle, { color: textColor }]}>Scheda: {scheda.protocollo}</Text>
        <Text style={[styles.schemaSubtitle, { color: textColor === '#11181C' ? '#999' : '#666' }]}>ID: {scheda.idscheda}</Text>
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
            <View
              key={`${obs.idosservazioni}-${obs.parassita}-${index}`}
              style={[styles.obsCard, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a', borderLeftColor: getPresenzaColor(obs.presente, obs.lobaratory_result) }]}
            >
              <ObsRow label="Ospite" value={obs.ospite || obs.nome_ospite || '-'} textColor={textColor} />
              <ObsRow label="Parassita" value={obs.parassita || obs.nome_parassita || '-'} textColor={textColor} />
              <ObsRow label="Presente" value={obs.presente || '-'} textColor={textColor} valueColor={getPresenzaColor(obs.presente, obs.lobaratory_result)} />
              <ObsRow label="Risultato Analisi" value={obs.lobaratory_result || '-'} textColor={textColor} valueColor={obs.lobaratory_result === 'Positivo' ? '#F44336' : obs.lobaratory_result === 'Negativo' ? '#4CAF50' : undefined} />
              <ObsRow label="Serie Campione" value={obs.codice || '-'} textColor={textColor} />
            </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  schemaTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  schemaSubtitle: {
    fontSize: 12,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
