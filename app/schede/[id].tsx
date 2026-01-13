import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { fetchAzienda, selectAziende } from '../../src/store/slices/aziendeSlice';
import { selectSchede, setSelectedScheda } from '../../src/store/slices/schedeSlice';

interface InfoSection {
  title: string;
  icon: string;
  data: Array<{ label: string; value: string }>;
}

const SchemataDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, selectedScheda } = useAppSelector(selectSchede);
  const { items: aziende, loading: loadingAzienda } = useAppSelector(selectAziende);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const scheda = useMemo(() => {
    return selectedScheda || items.find((item) => item.idscheda === id);
  }, [selectedScheda, items, id]);

  useEffect(() => {
    if (id) {
      dispatch(setSelectedScheda(String(id)));
    }
  }, [id, dispatch]);

  const handleLoadAzienda = useCallback(() => {
    if (scheda?.partita_iva) {
      dispatch(fetchAzienda({ piva: scheda.partita_iva }));
    }
  }, [scheda?.partita_iva, dispatch]);

  if (!scheda) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <TouchableOpacity
          style={[styles.header, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={tintColor} />
          <Text style={[styles.headerTitle, { color: textColor }]}>Dettagli Scheda</Text>
          <View style={{ width: 24 }} />
        </TouchableOpacity>
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
          <Text style={[styles.errorText, { color: textColor }]}>Scheda non trovata</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (stato: string) => {
    const statusMap: { [key: string]: string } = {
      '0': '#FFC107',
      '1': '#4CAF50',
      '-1': '#F44336',
      '2': '#2196F3',
    };
    return statusMap[stato] || '#999';
  };

  const sections: InfoSection[] = [
    {
      title: 'Informazioni Generali',
      icon: 'description',
      data: [
        { label: 'Protocollo', value: scheda.protocollo },
        { label: 'Data Sopralluogo', value: new Date(scheda.data_sopralluogo).toLocaleDateString('it-IT') },
        { label: 'Stato', value: scheda.statodesc },
        { label: 'Tecnico', value: scheda.tecnici },
      ],
    },
    {
      title: 'Localizzazione',
      icon: 'location-on',
      data: [
        { label: 'Azienda', value: scheda.azienda },
        { label: 'Sito', value: scheda.sito },
        { label: 'Comune', value: scheda.comune },
      ],
    },
    {
      title: 'Dati Rilevamenti',
      icon: 'trending-up',
      data: [
        { label: 'Risultati Positivi', value: scheda.numpositive || '0' },
        { label: 'Catture Totali', value: scheda.totcatture || '0' },
        { label: 'Allegati', value: scheda.allegati === 'true' ? 'Sì' : 'No' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a', borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color={tintColor} />
        <Text style={[styles.headerTitle, { color: textColor }]}>Dettagli Scheda</Text>
        <View style={{ width: 24 }} />
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(scheda.stato) },
            ]}
          />
          <View style={styles.statusContent}>
            <Text style={[styles.statusTitle, { color: textColor }]}>{scheda.protocollo}</Text>
            <Text style={[styles.statusSubtitle, { color: textColor === '#11181C' ? '#999' : '#666' }]}>{scheda.statodesc}</Text>
          </View>
        </View>

        {/* Motivo Card */}
        <View style={[styles.card, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}>
          <MaterialIcons name="info" size={20} color={tintColor} />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: textColor === '#11181C' ? '#666' : '#888' }]}>Motivo della Visita</Text>
            <Text style={[styles.cardValue, { color: textColor }]}>{scheda.motivo}</Text>
          </View>
        </View>

        {/* Sections */}
        {sections.map((section, index) => (
          <View key={index} style={[styles.section, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}>
            <View style={[styles.sectionHeader, { backgroundColor: textColor === '#11181C' ? '#f9f9f9' : '#2a2a2a', borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
              <MaterialIcons name={section.icon as any} size={20} color={tintColor} />
              <Text style={[styles.sectionTitle, { color: tintColor }]}>{section.title}</Text>
            </View>

            {section.data.map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={[
                  styles.sectionItem,
                  itemIndex < section.data.length - 1 && [styles.sectionItemBorder, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }],
                ]}
              >
                <Text style={[styles.itemLabel, { color: textColor === '#11181C' ? '#999' : '#666' }]}>{item.label}</Text>
                <Text style={[styles.itemValue, { color: textColor }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Alert if positives */}
        {scheda.numpositive && parseInt(scheda.numpositive) > 0 && (
          <View style={[styles.alertCard, { backgroundColor: textColor === '#11181C' ? '#FFF3E0' : '#3e2723', borderLeftColor: textColor === '#11181C' ? '#FF6B6B' : '#FFB74D' }]}>
            <MaterialIcons name="warning" size={24} color={textColor === '#11181C' ? '#FF6B6B' : '#FFB74D'} />
            <View style={styles.alertContent}>
              <Text style={[styles.alertTitle, { color: textColor === '#11181C' ? '#FF6B6B' : '#FFB74D' }]}>Risultati Positivi</Text>
              <Text style={[styles.alertMessage, { color: textColor }]}>
                Sono stati rilevati {scheda.numpositive} risultato{scheda.numpositive !== '1' ? 'i' : ''}
                positivo{scheda.numpositive !== '1' ? 'i' : ''}
              </Text>
            </View>
          </View>
        )}

        {/* Azienda Section */}
        {scheda.partita_iva && (
          <View style={[styles.section, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}>
            <View style={[styles.sectionHeader, { backgroundColor: textColor === '#11181C' ? '#f9f9f9' : '#2a2a2a', borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
              <MaterialIcons name="business" size={20} color={tintColor} />
              <Text style={[styles.sectionTitle, { color: tintColor }]}>Azienda</Text>
              {loadingAzienda && <ActivityIndicator color={tintColor} style={styles.sectionSpinner} />}
            </View>

            {aziende.length > 0 ? (
              <>
                <View style={[styles.sectionItem, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
                  <Text style={[styles.itemLabel, { color: textColor === '#11181C' ? '#999' : '#666' }]}>Ragione Sociale</Text>
                  <Text style={[styles.itemValue, { color: textColor }]}>{aziende[0].rag_soc || '-'}</Text>
                </View>
                <View style={[styles.sectionItem, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
                  <Text style={[styles.itemLabel, { color: textColor === '#11181C' ? '#999' : '#666' }]}>Indirizzo</Text>
                  <Text style={[styles.itemValue, { color: textColor }]}>
                    {aziende[0].indirizzo && aziende[0].cap && aziende[0].comune
                      ? `${aziende[0].indirizzo}, ${aziende[0].cap} ${aziende[0].comune}`
                      : '-'}
                  </Text>
                </View>
                <View style={[styles.sectionItem, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
                  <Text style={[styles.itemLabel, { color: textColor === '#11181C' ? '#999' : '#666' }]}>Telefono</Text>
                  <Text style={[styles.itemValue, { color: textColor }]}>{aziende[0].telefono || '-'}</Text>
                </View>
                <View style={styles.sectionItem}>
                  <Text style={[styles.itemLabel, { color: textColor === '#11181C' ? '#999' : '#666' }]}>Email</Text>
                  <Text style={[styles.itemValue, { color: textColor }]}>{aziende[0].email || '-'}</Text>
                </View>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.loadButton, { backgroundColor: tintColor }]}
                onPress={handleLoadAzienda}
              >
                <MaterialIcons name="download" size={18} color="#fff" />
                <Text style={styles.loadButtonText}>Carica Dati Azienda</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Osservazioni Button */}
        <TouchableOpacity
          style={[styles.observationsButton, { backgroundColor: tintColor }]}
          onPress={() => {
            dispatch(setSelectedScheda(String(id)));
            router.push(`/schede/${id}/osservazioni`);
          }}
        >
          <MaterialIcons name="visibility" size={20} color="#fff" />
          <Text style={styles.observationsButtonText}>Visualizza Osservazioni</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 8,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  sectionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sectionItemBorder: {
    borderBottomWidth: 1,
  },
  itemLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  alertCard: {
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderLeftWidth: 4,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 12,
  },
  observationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  observationsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    marginTop: 12,
    color: '#d32f2f',
    fontWeight: '500',
  },
  spacer: {
    height: 24,
  },
});

export default SchemataDetailScreen;
