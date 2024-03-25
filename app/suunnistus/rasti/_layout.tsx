import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack } from 'expo-router';
import { Alert, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/context/AuthContext';


export default function StackLayout() {
  const { logout } = useAuth();

  return (
    <Stack>
      <Stack.Screen
        name="rastit"
        options={{
          title: 'Rastit',
          headerTransparent: true,
          headerBlurEffect: 'light',
        }}
      ></Stack.Screen>
    </Stack>
  );
}


