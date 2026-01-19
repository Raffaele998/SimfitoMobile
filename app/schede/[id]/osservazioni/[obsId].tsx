import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../../../hooks/use-theme-color';
import { useAppDispatch, useAppSelector } from '../../../../src/store/hooks';
import { selectAuth } from '../../../../src/store/slices/authSlice';
import { fetchOsservazioni, selectOsservazioni } from '../../../../src/store/slices/osservazioniSlice';
import { fetchTrappole, selectTrappole } from '../../../../src/store/slices/trappolSlice';

const ObservazioneDetailScreen: React.FC = () => {
  const { id, obsId } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { items: osservazioni, loading: loadingOsservazioni } = useAppSelector(selectOsservazioni);
  const { items: trappole, loading: loadingTrappole } = useAppSelector(selectTrappole);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  // Carica osservazioni se non presenti
  useEffect(() => {
    if (user?.id && id && osservazioni.length === 0) {
      dispatch(fetchOsservazioni({
        userId: user.id.toString(),
        filters: { scheda_id: id }
      }) as any);
    }
  }, [user?.id, id, osservazioni.length, dispatch]);

  const osservazione = useMemo(() => {
    return osservazioni.find((item) => item.idosservazioni === obsId);
  }, [osservazioni, obsId]);

  useEffect(() => {
    if (osservazione?.gid && osservazione?.idosservazioni) {
      dispatch(fetchTrappole({ gid: osservazione.gid, idosservazione: osservazione.idosservazioni }));
    }
  }, [osservazione?.gid, osservazione?.idosservazioni, dispatch]);

  if (loadingOsservazioni) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <Text style={[styles.loadingText, { color: textColor }]}>Caricamento...</Text>
        </View>
      </View>
    );
  }

  if (!osservazione) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <TouchableOpacity
          style={[styles.header, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a', borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={tintColor} />
          <Text style={[styles.headerTitle, { color: textColor }]}>Dettagli Osservazione</Text>
          <View style={{ width: 24 }} />
        </TouchableOpacity>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
          <Text style={[styles.errorText, { color: textColor }]}>Osservazione non trovata</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a', borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color={tintColor} />
        <Text style={[styles.headerTitle, { color: textColor }]}>Dettagli Osservazione</Text>
        <View style={{ width: 24 }} />
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Osservazione Info Card */}
        <View style={[styles.card, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}>
          <View style={styles.cardRow}>
            <Text style={[styles.cardLabel, { color: textColor === '#11181C' ? '#999' : '#666' }]}>Data</Text>
            <Text style={[styles.cardValue, { color: textColor }]}>{osservazione.data || '-'}</Text>
          </View>
          <View style={[styles.cardDivider, { backgroundColor: textColor === '#11181C' ? '#eee' : '#333' }]} />
          <View style={styles.cardRow}>
            <Text style={[styles.cardLabel, { color: textColor === '#11181C' ? '#999' : '#666' }]}>Sito</Text>
            <Text style={[styles.cardValue, { color: textColor }]}>{osservazione.sito || '-'}</Text>
          </View>
          <View style={[styles.cardDivider, { backgroundColor: textColor === '#11181C' ? '#eee' : '#333' }]} />
          <View style={styles.cardRow}>
            <Text style={[styles.cardLabel, { color: textColor === '#11181C' ? '#999' : '#666' }]}>Parassita</Text>
            <Text style={[styles.cardValue, { color: textColor }]}>{osservazione.parassita || '-'}</Text>
          </View>
        </View>

        {/* Trappole Section */}
        <View style={[styles.section, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}>
          <View style={[styles.sectionHeader, { backgroundColor: textColor === '#11181C' ? '#f9f9f9' : '#2a2a2a', borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
            <MaterialIcons name="location-on" size={20} color={tintColor} />
            <Text style={[styles.sectionTitle, { color: tintColor }]}>Trappole ({trappole.length})</Text>
            {loadingTrappole && <ActivityIndicator color={tintColor} style={styles.sectionSpinner} />}
          </View>

          {loadingTrappole && trappole.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={tintColor} />
              <Text style={[styles.loadingText, { color: textColor }]}>Caricamento trappole...</Text>
            </View>
          ) : trappole.length > 0 ? (
            trappole.map((trappola, index) => (
              <View
                key={index}
                style={[
                  styles.trappolCard,
                  {
                    backgroundColor: textColor === '#11181C' ? '#f9f9f9' : '#2a2a2a',
                    borderLeftColor: tintColor,
                  },
                  index < trappole.length - 1 && [styles.trappolCardBorder, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }],
                ]}
              >
                <View style={styles.trappolHeader}>
                  <Text style={[styles.trappolCode, { color: textColor }]}>{trappola.codtrappola}</Text>
                  <View style={[styles.captureBadge, { backgroundColor: tintColor }]}>
                    <Text style={styles.captureBadgeText}>{trappola.num_catture || 0}</Text>
                  </View>
                </View>
                {trappola.data_cattura && (
                  <Text style={[styles.trappolDetail, { color: textColor === '#11181C' ? '#999' : '#888' }]}>
                    Data: {trappola.data_cattura}
                  </Text>
                )}
                {trappola.specie && (
                  <Text style={[styles.trappolDetail, { color: textColor === '#11181C' ? '#999' : '#888' }]}>
                    Specie: {trappola.specie}
                  </Text>
                )}
                {trappola.note && (
                  <Text style={[styles.trappolNote, { color: textColor }]}>
                    {trappola.note}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { paddingVertical: 24 }]}>
              <MaterialIcons name="info" size={32} color={textColor === '#11181C' ? '#ccc' : '#666'} />
              <Text style={[styles.emptyStateText, { color: textColor === '#11181C' ? '#999' : '#888' }]}>
                Nessuna trappola trovata
              </Text>
            </View>
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
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
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  card: {
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardDivider: {
    height: 1,
    marginVertical: 4,
  },
  section: {
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sectionSpinner: {
    marginLeft: 'auto',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  trappolCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderLeftWidth: 3,
  },
  trappolCardBorder: {
    borderBottomWidth: 1,
  },
  trappolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trappolCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  captureBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  trappolDetail: {
    fontSize: 12,
    marginTop: 4,
  },
  trappolNote: {
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  spacer: {
    height: 24,
  },
});

export default ObservazioneDetailScreen;
