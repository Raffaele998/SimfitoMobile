import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '../hooks/use-theme-color';
import { useAppSelector } from '../src/store/hooks';
import { selectAuth } from '../src/store/slices/authSlice';
import { selectSettings } from '../src/store/slices/settingsSlice';

const UserProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAppSelector(selectAuth);
  const { theme } = useAppSelector(selectSettings);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: tintColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dati Utente</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Informazioni Generali */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: tintColor }]}>Informazioni Generali</Text>
          
          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Username:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.username || 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Password:</Text>
              <Text style={[styles.value, { color: textColor }]}>••••••••</Text>
            </View>
          </View>

          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Nome:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.nome || 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Cognome:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.cognome || 'N/A'}</Text>
            </View>
          </View>

          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <View style={styles.fullField}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Codice Fiscale:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.codicefiscale || 'N/A'}</Text>
            </View>
          </View>

          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Sesso:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.sesso?.toLowerCase() === 'm' ? 'Maschile' : user?.sesso?.toLowerCase() === 'f' ? 'Femminile' : 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Comune di Nascita:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.comune_nascita || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Data di Nascita:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.data_nascita ? new Date(user.data_nascita).toLocaleDateString('it-IT') : 'N/A'}</Text>
            </View>
            <View style={styles.field} />
          </View>
        </View>

        {/* Recapiti */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: tintColor }]}>Recapiti</Text>
          
          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Indirizzo:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.residenza_indirizzo || 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Comune di Residenza:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.residenza_comune || 'N/A'}</Text>
            </View>
          </View>

          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Telefono:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.telefono || 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Cellulare:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.mobile || 'N/A'}</Text>
            </View>
          </View>

          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Email:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.email || 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Pagina Web:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.web || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Informazioni Professionali */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: tintColor }]}>Informazioni Professionali</Text>
          
          <View style={[styles.row, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Ente:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.ufficio || 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Capo Ufficio:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.cap_ufficio || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.fullField}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Titolo di Studio:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.titolo || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Tipo Utente */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: tintColor }]}>Tipo Account</Text>
          
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Tipo:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.userType || 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>Provincia:</Text>
              <Text style={[styles.value, { color: textColor }]}>{user?.province || 'N/A'}</Text>
            </View>
          </View>
        </View>
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
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  field: {
    flex: 1,
  },
  fullField: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default UserProfileScreen;
