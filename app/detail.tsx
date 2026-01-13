import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    SectionListData,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { fetchDetailItem, selectDetail } from '../src/store/slices/detailSlice';

interface InfoItem {
  label: string;
  value: string;
}

const DetailScreen: React.FC = () => {
  const { id, name } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { item, loading, error } = useAppSelector(selectDetail);

  useEffect(() => {
    if (id && name) {
      dispatch(fetchDetailItem({ 
        id: String(id), 
        name: decodeURIComponent(String(name))
      }));
    } else if (id) {
      dispatch(fetchDetailItem(String(id)));
    }
  }, [id, name, dispatch]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Caricamento dettagli...</Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
        <Text style={styles.errorText}>{error || 'Elemento non trovato'}</Text>
      </View>
    );
  }

  const typeColor = {
    pest: '#FF6B6B',
    plant: '#4ECDC4',
    disease: '#FFE66D',
  }[item.type.toLowerCase()] || '#999';

  const sections: SectionListData<InfoItem>[] = [
    {
      title: 'Informazioni Generali',
      data: [
        { label: 'Codice', value: item.code },
        { label: 'Tipo', value: item.type },
        ...(item.names && Object.entries(item.names).map(([lang, name]) => ({
          label: `Nome (${lang.toUpperCase()})`,
          value: name,
        })) || []),
      ],
    },
    ...(item.taxonomy ? [{
      title: 'Tassonomia',
      data: Object.entries(item.taxonomy).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: String(value),
      })),
    }] : []),
    ...(item.relations ? [{
      title: 'Relazioni',
      data: Object.entries(item.relations).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: String(value),
      })),
    }] : []),
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { borderLeftColor: typeColor }]}>
        <Text style={styles.code}>{item.code}</Text>
        <View style={styles.titleContainer}>
          <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
            <MaterialIcons 
              name={item.type === 'pest' ? 'bug-report' : item.type === 'disease' ? 'warning' : 'eco'} 
              size={16} 
              color="white" 
            />
          </View>
          <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
        </View>
      </View>

      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.data.map((item, index) => (
              <View 
                key={`${section.title}-${index}`}
                style={[
                  styles.infoRow,
                  index !== section.data.length - 1 && styles.infoRowBorder,
                ]}
              >
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderLeftWidth: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  code: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  sectionContent: {
    paddingHorizontal: 16,
  },
  infoRow: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    flex: 0.4,
  },
  value: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
    flex: 0.6,
    textAlign: 'right',
  },
  spacer: {
    height: 24,
  },
});

export default DetailScreen;
