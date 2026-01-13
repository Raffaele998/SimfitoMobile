import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppSelector } from '../../src/store/hooks';
import { selectSelectedSito } from '../../src/store/slices/sitiSlice';

const SitoDetailScreen: React.FC = () => {
  const router = useRouter();
  const { denominazione } = useLocalSearchParams();
  const selectedSito = useAppSelector(selectSelectedSito);

  const sito = selectedSito;

  if (!sito) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
          <Text style={styles.errorText}>Sito non trovato</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.backButtonText}>Indietro</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {sito.denominazione || 'Dettagli Sito'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sezione Generale */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="info" size={20} color="#1976D2" />
            <Text style={styles.sectionTitle}>Informazioni Generali</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Denominazione</Text>
            <Text style={styles.value}>{sito.denominazione || '-'}</Text>
          </View>

          {sito.sito && (
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Codice Sito</Text>
              <Text style={styles.value}>{sito.sito}</Text>
            </View>
          )}
        </View>

        {/* Sezione Indirizzo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="location-on" size={20} color="#1976D2" />
            <Text style={styles.sectionTitle}>Localizzazione</Text>
          </View>

          {sito.indirizzo && (
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Indirizzo</Text>
              <Text style={styles.value}>{sito.indirizzo}</Text>
            </View>
          )}

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Comune</Text>
            <Text style={styles.value}>{sito.comune || '-'}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Provincia</Text>
            <Text style={styles.value}>{sito.provincia || '-'}</Text>
          </View>

          {sito.region && (
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Regione</Text>
              <Text style={styles.value}>{sito.region}</Text>
            </View>
          )}
        </View>

        {/* Sezione Contatti */}
        {(sito.telono || sito.email) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="phone" size={20} color="#1976D2" />
              <Text style={styles.sectionTitle}>Contatti</Text>
            </View>

            {sito.telono && (
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Telefono</Text>
                <TouchableOpacity>
                  <Text style={styles.valueLink}>{sito.telono}</Text>
                </TouchableOpacity>
              </View>
            )}

            {sito.email && (
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Email</Text>
                <TouchableOpacity>
                  <Text style={styles.valueLink}>{sito.email}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Azioni */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="map" size={20} color="#1976D2" />
            <Text style={styles.actionButtonText}>Mappa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="assignment" size={20} color="#1976D2" />
            <Text style={styles.actionButtonText}>Schede</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoBlock: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  valueLink: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginTop: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#d32f2f',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SitoDetailScreen;
