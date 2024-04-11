import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Slot, Stack, Tabs } from 'expo-router';
import { Alert, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { BlurView } from 'expo-blur';


function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}



function handleLogout(logout: () => Promise<void>) {
  Alert.alert(
    'Kirjaudu ulos?',
    '',
    [
      {
        text: 'Peruuta',
        style: 'cancel'
      },
      {
        text: 'Kyllä',
        onPress: async () => {
          await logout();
        }
      }
    ]
  );
}

// default function that decides which layout to use
export default function Layout() {
  const { privateCode } = useAuth();
  if (typeof privateCode == 'undefined') {
    return <Slot />;
  } 
  if (privateCode) {
    return <AdminTabLayout />;
  } else {
    return <UserLayout />;
  }
}
 
// suunnistaja layout
export function UserLayout() {
  const colorScheme = useColorScheme();
  const { logout } = useAuth();

  return (
    <Stack>
      <Stack.Screen
        name="kartta"
        options={{
          title: 'Vuksisuunnistus',
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerBackground() {
            return (
              <BlurView intensity={150} style={{ flex: 1 }} />
            );
            
          },
          headerRight: () => (
            <Pressable
              style={{ marginRight: 10 }}
              onPress={() => handleLogout(logout)}>
              <FontAwesome name="sign-out" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            </Pressable>
          ),
        }}
      ></Stack.Screen>
    </Stack>
  );
}

// layout for admins
export function AdminTabLayout() {
  const colorScheme = useColorScheme();
  const { logout } = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="kartta"
        options={{
          headerShown: true,
          headerTitle: 'Vuksisuunnistus',
          headerTransparent: true,
          title: 'Kartta',
          headerTitleAlign: 'center',
          headerBackground() {
            return (
              <BlurView intensity={150} style={{ flex: 1 }} />
            );
            
          },
          headerRight: () => (
            <Pressable
              style={{ marginRight: 20 }}
              onPress={() => handleLogout(logout)}>
              <FontAwesome name="sign-out" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            </Pressable>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rasti"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="thumb-tack" color={color} />,        
        }}
      />
    </Tabs>
  );
}

