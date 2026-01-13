import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1976D2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tabs.Screen
        name="schede"
        options={{
          title: 'Le Mie Schede',
          tabBarLabel: 'Schede',
          tabBarIcon: ({ color }) => <MaterialIcons name="description" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="siti"
        options={{
          title: 'Siti',
          tabBarLabel: 'Siti',
          tabBarIcon: ({ color }) => <MaterialIcons name="location-on" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Impostazioni',
          tabBarLabel: 'Impostazioni',
          tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
