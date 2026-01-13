import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { selectAuth } from '../../src/store/slices/authSlice';
import { selectSettings } from '../../src/store/slices/settingsSlice';
import { fetchSiti, nextPage, previousPage, selectSiti, setFilters, setSelectedSito } from '../../src/store/slices/sitiSlice';

interface SitoItemProps {
  item: any;
  onPress: (sito: any) => void;
}

const SitoItem: React.FC<SitoItemProps> = ({ item, onPress }) => {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const { theme } = useAppSelector(selectSettings);
  
  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }]}
      onPress={() => onPress(item)}
    >
      <View style={styles.itemIcon}>
        <MaterialIcons name="location-on" size={24} color={tintColor} />
      </View>

      <View style={styles.itemContent}>
        <Text style={[styles.denominazione, { color: textColor }]} numberOfLines={1}>
          {item.denominazione || 'Sito non identificato'}
        </Text>

        {item.indirizzo && (
          <View style={styles.infoRow}>
            <MaterialIcons name="home" size={12} color={theme === 'dark' ? '#888' : '#666'} />
            <Text style={[styles.infoText, { color: theme === 'dark' ? '#888' : '#666' }]} numberOfLines={1}>
              {item.indirizzo}
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <MaterialIcons name="public" size={12} color={theme === 'dark' ? '#888' : '#666'} />
          <Text style={[styles.infoText, { color: theme === 'dark' ? '#888' : '#666' }]} numberOfLines={1}>
            {item.comune} ({item.provincia})
          </Text>
        </View>

        {item.region && (
          <View style={styles.infoRow}>
            <MaterialIcons name="map" size={12} color={theme === 'dark' ? '#888' : '#666'} />
            <Text style={[styles.infoText, { color: theme === 'dark' ? '#888' : '#666' }]} numberOfLines={1}>
              {item.region}
            </Text>
          </View>
        )}
      </View>

      <MaterialIcons name="chevron-right" size={24} color={theme === 'dark' ? '#555' : '#999'} />
    </TouchableOpacity>
  );
};

const SitiScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { items, loading, error, pagination, filters } = useAppSelector(selectSiti);
  const { theme } = useAppSelector(selectSettings);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    if (user?.id) {
      dispatch(
        fetchSiti({
          userId: user.id.toString(),
          searchText: filters.searchText,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
        }) as any
      );
    }
  }, [user?.id, dispatch, filters.searchText, pagination.currentPage, pagination.pageSize]);

  const handleItemPress = (sito: any) => {
    dispatch(setSelectedSito(sito));
    router.push({
      pathname: '/siti/[id]',
      params: { id: sito.id, denominazione: sito.denominazione },
    });
  };

  const handleSearchChange = (text: string) => {
    dispatch(setFilters({ searchText: text }));
  };

  const maxPage = Math.ceil(pagination.total / pagination.pageSize) || 1;
  const canGoNext = pagination.currentPage < maxPage;
  const canGoPrev = pagination.currentPage > 1;

  if (loading && items.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={[styles.loadingText, { color: textColor }]}>Caricamento siti...</Text>
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
        <View style={[styles.searchContainer, { backgroundColor: textColor === '#11181C' ? '#f0f0f0' : '#2a2a2a' }]}>
          <MaterialIcons name="search" size={20} color={textColor === '#11181C' ? '#666' : '#888'} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Cerca siti..."
            placeholderTextColor={textColor === '#11181C' ? '#999' : '#666'}
            value={filters.searchText}
            onChangeText={handleSearchChange}
          />
          {filters.searchText && <TouchableOpacity onPress={() => dispatch(setFilters({ searchText: '' }))}>
            <MaterialIcons name="close" size={20} color={textColor === '#11181C' ? '#666' : '#888'} />
          </TouchableOpacity>}
        </View>
      </View>

      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <SitoItem item={item} onPress={handleItemPress} />
            )}
            keyExtractor={(item) => item.id?.toString() || ''}
            ListHeaderComponent={
              <View style={[styles.header, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff', borderBottomColor: theme === 'dark' ? '#333' : '#eee' }]}>
                <Text style={[styles.headerTitle, { color: textColor }]}>I Tuoi Siti</Text>
                <Text style={[styles.headerSubtitle, { color: theme === 'dark' ? '#666' : '#999' }]}>
                  {pagination.total} sito{pagination.total !== 1 ? 'i' : ''} totali
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, !canGoPrev && styles.paginationButtonDisabled]}
              onPress={() => dispatch(previousPage())}
              disabled={!canGoPrev}
            >
              <MaterialIcons name="chevron-left" size={24} color={canGoPrev ? '#1976D2' : '#ccc'} />
              <Text style={[styles.paginationButtonText, !canGoPrev && styles.paginationButtonTextDisabled]}>
                Precedente
              </Text>
            </TouchableOpacity>

            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                Pagina {pagination.currentPage} di {maxPage}
              </Text>
              <Text style={styles.pageSubtext}>
                {(pagination.currentPage - 1) * pagination.pageSize + 1}-{Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} di {pagination.total}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.paginationButton, !canGoNext && styles.paginationButtonDisabled]}
              onPress={() => dispatch(nextPage())}
              disabled={!canGoNext}
            >
              <Text style={[styles.paginationButtonText, !canGoNext && styles.paginationButtonTextDisabled]}>
                Successiva
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={canGoNext ? '#1976D2' : '#ccc'} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="location-off" size={48} color="#ccc" />
          <Text style={styles.emptyText}>
            {items.length === 0 ? 'Nessun sito disponibile' : 'Nessun risultato'}
          </Text>
          {filters.searchText && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => dispatch(setFilters({ searchText: '' }))}
            >
              <Text style={styles.clearButtonText}>Cancella filtri</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    marginTop: 12,
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  listHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  listHeaderSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  itemContainer: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  denominazione: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  clearButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#1976D2',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    gap: 4,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
  },
  paginationButtonTextDisabled: {
    color: '#ccc',
  },
  pageIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  pageSubtext: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});

export default SitiScreen;
