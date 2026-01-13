import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchSearchResults,
  setQuery,
  selectSearch,
} from '../store/slices/searchSlice';
import SearchResultItem from '../components/Search/SearchResultItem';
import { debounce } from '../utils/debounce';

const SearchScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { results, loading, error, query } = useAppSelector(selectSearch);

  const performSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim().length > 2) {
        dispatch(fetchSearchResults({ query: searchQuery }));
      }
    }, 500),
    [dispatch]
  );

  const handleSearch = (text: string) => {
    dispatch(setQuery(text));
    performSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Cerca pest, pianta, malattia..."
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor="#999"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading && <ActivityIndicator size="large" color="#1976D2" />}

      <FlatList
        data={results}
        renderItem={({ item }) => <SearchResultItem item={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <Text style={styles.empty}>Nessun risultato trovato</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    color: '#999',
  },
});

export default SearchScreen;
