import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectDetail, fetchDetailItem } from '../store/slices/detailSlice';

const DetailScreen: React.FC<any> = ({ route }) => {
  const dispatch = useAppDispatch();
  const { item, loading, error } = useAppSelector(selectDetail);
  const itemId = route.params?.id;

  useEffect(() => {
    if (itemId) {
      dispatch(fetchDetailItem(itemId));
    }
  }, [itemId, dispatch]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.center}>
        <Text>{error || 'Elemento non trovato'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.title}>{item.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informazioni</Text>
        <Text style={styles.text}>Tipo: {item.type}</Text>
      </View>

      {item.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrizione</Text>
          <Text style={styles.text}>{item.description}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  code: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default DetailScreen;
