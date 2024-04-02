import { StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, LatLng } from 'react-native-maps';
import { View } from '@/components/Themed';
import MapStyle from '@/constants/MapStyle.json';
import { useAuth } from '@/context/AuthContext';
import initialRegion from '@/constants/oulu';

export default function MapScreen() {
  const { rastit } = useAuth();
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseModal = () => {
    setSelectedMarker(null);
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={initialRegion}
        minZoomLevel={5}
        maxZoomLevel={20}
        showsMyLocationButton={true}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapStyle}
      >
        {rastit.map((rasti, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: rasti.sijainti.latitude,
              longitude: rasti.sijainti.longitude,
            }}
            title={rasti.nimi}
            description={rasti.kuvaus}
            onPress={() => handleMarkerPress(rasti)}
          />
        ))}
      </MapView>

      <Modal visible={selectedMarker !== null} animationType="slide" transparent={true} >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMarker?.nimi}</Text>
            <Text style={styles.modalDescription}>{selectedMarker?.kuvaus}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Sulje</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalDescription: {
    fontSize: 18,
    marginBottom: 20,
  },

  closeButton: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});