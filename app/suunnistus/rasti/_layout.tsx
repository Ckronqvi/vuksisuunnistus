import React from 'react';

import { Stack } from 'expo-router';


export default function StackLayout() {

  return (
    <Stack>
      <Stack.Screen
        name="rastit"
        options={{
          headerShown: false
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="addRasti"
        options={{
          headerShown: false,
        }}  
      ></Stack.Screen>
    </Stack>
  );
}


