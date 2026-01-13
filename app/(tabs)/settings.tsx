import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { logout, selectAuth } from '../../src/store/slices/authSlice';
import { saveTheme, selectSettings, setTheme } from '../../src/store/slices/settingsSlice';

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { language, theme } = useAppSelector(selectSettings);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const handleThemeChange = (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    dispatch(saveTheme(newTheme));
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.section, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}>
        <Text style={[styles.sectionTitle, { color: tintColor }]}>Profilo Utente</Text>
        <View style={[styles.item, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
          <Text style={[styles.label, { color: textColor }]}>Nome:</Text>
          <Text style={[styles.value, { color: textColor === '#11181C' ? '#999' : '#666' }]}>{user?.name || 'N/A'}</Text>
        </View>
        <View style={[styles.item, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
          <Text style={[styles.label, { color: textColor }]}>Username:</Text>
          <Text style={[styles.value, { color: textColor === '#11181C' ? '#999' : '#666' }]}>{user?.username || 'N/A'}</Text>
        </View>
        <View style={[styles.item, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
          <Text style={[styles.label, { color: textColor }]}>Tipo:</Text>
          <Text style={[styles.value, { color: textColor === '#11181C' ? '#999' : '#666' }]}>{user?.userType || 'N/A'}</Text>
        </View>
        {user?.province && (
          <View style={[styles.item, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
            <Text style={[styles.label, { color: textColor }]}>Provincia:</Text>
            <Text style={[styles.value, { color: textColor === '#11181C' ? '#999' : '#666' }]}>{user.province}</Text>
          </View>
        )}
      </View>

      <View style={[styles.section, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}>
        <Text style={[styles.sectionTitle, { color: tintColor }]}>Lingua</Text>
        <View style={[styles.item, { borderBottomColor: textColor === '#11181C' ? '#eee' : '#333' }]}>
          <Text style={[styles.label, { color: textColor }]}>Lingua:</Text>
          <Text style={[styles.value, { color: textColor === '#11181C' ? '#999' : '#666' }]}>{language}</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: textColor === '#11181C' ? '#fff' : '#1a1a1a' }]}>
        <Text style={[styles.sectionTitle, { color: tintColor }]}>Tema</Text>
        <View style={[styles.item, { borderBottomWidth: 0 }]}>
          <Text style={[styles.label, { color: textColor }]}>Dark mode:</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={handleThemeChange}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme === 'dark' ? '#FF6B6B' : '#d32f2f' }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
  },
  logoutButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
