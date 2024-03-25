import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, View } from '@/components/Themed';
import MapStyle from '@/constants/MapStyle.json';
import { useAuth } from '@/context/AuthContext';


// Oulu Linnanmaa
const initialRegion = {
  latitude: 65.0608,
  longitude: 25.4694,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const {logout} = useAuth();

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={initialRegion}
        minZoomLevel={10}
        maxZoomLevel={20}
        showsMyLocationButton={true}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  map: {
    width: '100%',
    height: '100%',
  }
});
