import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useSegments, useRouter, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/components/useColorScheme';
import { UserLocationContext } from '../context/UserLocationContext';
import { AuthContextProvider } from '../context/AuthContext';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthContextProvider>
      <RootLayoutNav />
    </AuthContextProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

    const {isLoggedIn} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
      if (typeof isLoggedIn == 'undefined') {
          router.replace('/'); //TODO: Tähän lataus ruutu tai joku sellanen...
      }
      // check if user is in user segment
      const isInUserPage = (segments.includes('suunnistus'));
      if (isLoggedIn && !isInUserPage) {
          router.replace('suunnistus');
      } else if (!isLoggedIn) {
          router.replace('/');
      }
  }, [isLoggedIn]);

  return (
    
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserLocationContext.Provider value={{ location, setLocation }}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="suunnistus" options={{ headerShown: false }} />
            <Stack.Screen name="luoSuunnistus" options={{headerShown: false}} />
          </Stack>
      </UserLocationContext.Provider>
    </ThemeProvider>
    
  );
}

