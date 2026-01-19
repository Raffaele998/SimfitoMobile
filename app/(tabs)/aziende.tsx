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
import { fetchAllAziende, nextPage, previousPage, selectAziende, setFilters } from '../../src/store/slices/aziendeSlice';

interface AziendaItemProps {
  item: any;
  onPress: (id: number) => void;
}

const AziendaItem: React.FC<AziendaItemProps> = ({ item, onPress }) => {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}
      onPress={() => onPress(item.id_azienda)}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={[styles.ragioneSociale, { color: textColor }]} numberOfLines={2}>
            {item.rag_soc}
          </Text>
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="badge" size={14} color={textColor === '#11181C' ? '#666' : '#888'} />
            <Text style={[styles.detailText, { color: textColor === '#11181C' ? '#666' : '#888' }]}>
              P.IVA: {item.partita_iva}
            </Text>
          </View>

          {item.comune && (
            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={14} color={textColor === '#11181C' ? '#666' : '#888'} />
              <Text style={[styles.detailText, { color: textColor === '#11181C' ? '#666' : '#888' }]} numberOfLines={1}>
                {item.provincia ? `${item.comune} (${item.provincia})` : item.comune}
              </Text>
            </View>
          )}

          {item.tipo && (
            <View style={styles.detailRow}>
              <MaterialIcons name="category" size={14} color={textColor === '#11181C' ? '#666' : '#888'} />
              <Text style={[styles.detailText, { color: textColor === '#11181C' ? '#666' : '#888' }]} numberOfLines={1}>
                {item.tipo}
              </Text>
            </View>
          )}
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={24} color={textColor === '#11181C' ? '#999' : '#555'} />
    </TouchableOpacity>
  );
};

const AziendeScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { allItems: aziende, loadingAll: loading, pagination, filters } = useAppSelector(selectAziende);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const isDark = textColor === '#ECEDEE';

  // Tutti possono creare aziende (come nella web app)
  const canCreateAziende = true;

  useEffect(() => {
    dispatch(fetchAllAziende({
      searchText: filters.searchText,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
    }));
  }, [dispatch, filters.searchText, pagination.currentPage, pagination.pageSize]);

  const handleItemPress = (id: number) => {
    // TODO: Navigare al dettaglio azienda
    console.log('Azienda selezionata:', id);
  };

  const handleSearchChange = (text: string) => {
    dispatch(setFilters({ searchText: text }));
  };

  const maxPage = Math.ceil(pagination.total / pagination.pageSize) || 1;
  const canGoNext = pagination.currentPage < maxPage;
  const canGoPrev = pagination.currentPage > 1;

  const handleRefresh = () => {
    if (user?.id) {
      dispatch(fetchAllAziende({
        searchText: filters.searchText,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      }));
    }
  };

  if (loading && aziende.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={[styles.loadingText, { color: textColor }]}>Caricamento aziende...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Barra di ricerca */}
      <View style={[styles.searchBar, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderBottomColor: isDark ? '#333' : '#eee' }]}>
        <MaterialIcons name="search" size={20} color={isDark ? '#666' : '#999'} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          value={filters.searchText}
          onChangeText={handleSearchChange}
          placeholder="Cerca azienda..."
          placeholderTextColor={isDark ? '#666' : '#999'}
        />
        {filters.searchText.length > 0 && (
          <TouchableOpacity onPress={() => dispatch(setFilters({ searchText: '' }))}>
            <MaterialIcons name="clear" size={20} color={isDark ? '#666' : '#999'} />
          </TouchableOpacity>
        )}
      </View>

      {aziende.length > 0 ? (
        <>
          <FlatList
            data={aziende}
            renderItem={({ item }) => (
              <AziendaItem 
                item={item} 
                onPress={handleItemPress}
              />
            )}
            keyExtractor={(item, index) => `${item.id_azienda || item.partita_iva}-${index}`}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <View>
                  <Text style={[styles.listHeaderText, { color: textColor === '#11181C' ? '#666' : '#888' }]}>
                    {pagination.total} {pagination.total === 1 ? 'azienda' : 'aziende'} totali
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleRefresh}
                  disabled={loading}
                  style={styles.refreshButton}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={tintColor} />
                  ) : (
                    <MaterialIcons name="refresh" size={24} color={tintColor} />
                  )}
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />

          {/* Controlli di paginazione */}
          <View style={[styles.paginationContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderTopColor: isDark ? '#333' : '#eee' }]}>
            <TouchableOpacity
              style={[styles.paginationButton, !canGoPrev && styles.paginationButtonDisabled]}
              onPress={() => dispatch(previousPage())}
              disabled={!canGoPrev}
            >
              <MaterialIcons name="chevron-left" size={24} color={canGoPrev ? tintColor : '#ccc'} />
              <Text style={[styles.paginationButtonText, !canGoPrev && styles.paginationButtonTextDisabled, { color: canGoPrev ? tintColor : '#ccc' }]}>
                Precedente
              </Text>
            </TouchableOpacity>

            <View style={styles.pageIndicator}>
              <Text style={[styles.pageText, { color: textColor }]}>
                Pagina {pagination.currentPage} di {maxPage}
              </Text>
              <Text style={[styles.pageSubtext, { color: isDark ? '#666' : '#999' }]}>
                {(pagination.currentPage - 1) * pagination.pageSize + 1}-{Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} di {pagination.total}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.paginationButton, !canGoNext && styles.paginationButtonDisabled]}
              onPress={() => dispatch(nextPage())}
              disabled={!canGoNext}
            >
              <Text style={[styles.paginationButtonText, !canGoNext && styles.paginationButtonTextDisabled, { color: canGoNext ? tintColor : '#ccc' }]}>
                Successiva
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={canGoNext ? tintColor : '#ccc'} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="business" size={48} color="#ccc" />
          <Text style={styles.emptyText}>
            {filters.searchText ? 'Nessuna azienda trovata' : 'Nessuna azienda disponibile'}
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
      
      {/* FAB per creare nuova azienda */}
      {canCreateAziende && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: tintColor }]}
          onPress={() => router.push('/nuova-azienda')}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  refreshButton: {
    padding: 4,
  },
  listHeaderText: {
    fontSize: 13,
    fontWeight: '500',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    marginBottom: 8,
  },
  ragioneSociale: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  clearButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1976D2',
    borderRadius: 8,
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
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
    flex: 1,
  },
  paginationButtonDisabled: {
    backgroundColor: '#f5f5f5',
  },
  paginationButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paginationButtonTextDisabled: {
    color: '#ccc',
  },
  pageIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pageSubtext: {
    fontSize: 11,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
});

export default AziendeScreen;
