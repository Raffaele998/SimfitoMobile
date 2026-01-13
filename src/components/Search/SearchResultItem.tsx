import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch } from '../../store/hooks';
import { fetchDetailItem } from '../../store/slices/detailSlice';
import type { SearchResult } from '../../store/slices/searchSlice';

interface Props {
  item: SearchResult;
}

const SearchResultItem: React.FC<Props> = ({ item }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handlePress = () => {
    // Pass both id and name to the detail screen
    dispatch(fetchDetailItem({ id: item.id, name: item.name }));
    router.push(`/detail?id=${item.id}&name=${encodeURIComponent(item.name)}`);
  };

  const typeColor = {
    pest: '#FF6B6B',
    plant: '#4ECDC4',
    disease: '#FFE66D',
  }[item.type.toLowerCase()] || '#999';

  const typeIcon = {
    pest: 'bug-report',
    plant: 'eco',
    disease: 'warning',
  }[item.type.toLowerCase()] || 'info';

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.code}>{item.code}</Text>
          <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
            <MaterialIcons 
              name={typeIcon as any} 
              size={12} 
              color="white" 
            />
          </View>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={22} color="#999" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  code: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
  },
});

export default SearchResultItem;
