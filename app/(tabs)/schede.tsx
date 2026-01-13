import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { selectAuth } from '../../src/store/slices/authSlice';
import { fetchSchede, nextPage, previousPage, selectSchede, setSelectedScheda } from '../../src/store/slices/schedeSlice';

interface SchemataItemProps {
  item: any;
  onPress: (id: string) => void;
  onObservationsPress: (id: string) => void;
}

const SchemataItem: React.FC<SchemataItemProps> = ({ item, onPress, onObservationsPress }) => {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const getStatusColor = (stato: string) => {
    const statusMap: { [key: string]: string } = {
      '0': '#FFC107', // In attesa - Amber
      '1': '#4CAF50', // Completata - Green
      '-1': '#F44336', // Rigettata - Red
      '2': '#2196F3', // In corso - Blue
    };
    return statusMap[stato] || '#999';
  };

  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}
      onPress={() => onPress(item.idscheda)}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.titleSection}>
            <Text style={[styles.protocollo, { color: tintColor }]}>{item.protocollo}</Text>
            <Text style={[styles.schedeId, { color: textColor === '#11181C' ? '#999' : '#666' }]}>ID: {item.idscheda}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.stato) }]}>
            <Text style={styles.statusText}>{item.statodesc}</Text>
          </View>
        </View>

        <Text style={[styles.motivo, { color: textColor }]} numberOfLines={1}>
          {item.motivo}
        </Text>

        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={14} color={textColor === '#11181C' ? '#666' : '#888'} />
            <Text style={[styles.detailText, { color: textColor === '#11181C' ? '#666' : '#888' }]} numberOfLines={1}>
              {item.sito}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="calendar-today" size={14} color={textColor === '#11181C' ? '#666' : '#888'} />
            <Text style={[styles.detailText, { color: textColor === '#11181C' ? '#666' : '#888' }]}>
              {new Date(item.data_sopralluogo).toLocaleDateString('it-IT')}
            </Text>
          </View>
        </View>

        {item.numpositive && parseInt(item.numpositive) > 0 && (
          <View style={styles.alertBadge}>
            <MaterialIcons name="warning" size={12} color="#fff" />
            <Text style={styles.alertText}>
              {item.numpositive} positivo{item.numpositive !== '1' ? 'i' : ''}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onObservationsPress(item.idscheda)}
        >
          <MaterialIcons name="visibility" size={24} color={tintColor} />
        </TouchableOpacity>
        <MaterialIcons name="chevron-right" size={24} color={textColor === '#11181C' ? '#999' : '#555'} />
      </View>
    </TouchableOpacity>
  );
};

const SchemataScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { items, loading, error, total, currentPage, pageSize } = useAppSelector(selectSchede);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSchede({ userId: user.id.toString(), page: currentPage, pageSize }));
    }
  }, [user?.id, currentPage, dispatch, pageSize]);

  const handleItemPress = (schedeId: string) => {
    dispatch(setSelectedScheda(schedeId));
    router.push(`/schede/${schedeId}`);
  };

  const handleObservationsPress = (schedeId: string) => {
    dispatch(setSelectedScheda(schedeId));
    router.push(`/schede/${schedeId}/osservazioni`);
  };

  const maxPage = Math.ceil(total / pageSize);
  const canGoNext = currentPage < maxPage;
  const canGoPrev = currentPage > 1;

  if (loading && items.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={[styles.loadingText, { color: textColor }]}>Caricamento schede...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <SchemataItem 
                item={item} 
                onPress={handleItemPress}
                onObservationsPress={handleObservationsPress}
              />
            )}
            keyExtractor={(item) => item.idscheda}
            ListHeaderComponent={
          <View style={[styles.header, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a', borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
                <Text style={[styles.headerTitle, { color: textColor }]}>Le Tue Schede</Text>
                <Text style={[styles.headerSubtitle, { color: textColor === '#11181C' ? '#999' : '#666' }]}>
                  {total} scheda{total !== 1 ? 'e' : ''} totali
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
          
          <View style={[styles.paginationContainer, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a', borderTopColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
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
                Pagina {currentPage} di {maxPage}
              </Text>
              <Text style={[styles.pageSubtext, { color: textColor === '#11181C' ? '#999' : '#666' }]}>
                {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} di {total}
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
          <MaterialIcons name="folder-open" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Nessuna scheda trovata</Text>
        </View>
      )}
      
      {/* FAB per creare nuova scheda */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: tintColor }]}
        onPress={() => router.push('/nuova-scheda')}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  itemContainer: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 8,
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
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
    gap: 2,
  },
  protocollo: {
    fontSize: 16,
    fontWeight: '600',
  },
  schedeId: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  motivo: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  itemDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  alertText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: '#999',
    fontSize: 16,
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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default SchemataScreen;
