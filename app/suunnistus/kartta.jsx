import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useContext } from "react";
import MapView, { PROVIDER_GOOGLE, Marker, LatLng } from "react-native-maps";
import { View } from "@/components/Themed";
import MapStyle from "@/constants/MapStyle.json";
import { useAuth } from "@/context/AuthContext";
import { UserLocationContext } from "@/context/UserLocationContext";

export default function MapScreen() {
  const { rastit } = useAuth();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { location, setLocation } = useContext(UserLocationContext);

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseModal = () => {
    setSelectedMarker(null);
  };

  const userCoordinates = location && {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        minZoomLevel={5}
        maxZoomLevel={20}
        showsMyLocationButton={true}
        mapPadding={{ top: 100, right: 0, bottom: 0, left: 0 }}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapStyle}
        initialRegion={userCoordinates}
        moveOnMarkerPress={false}
      >
        {rastit.map((rasti, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: rasti.sijainti.latitude,
              longitude: rasti.sijainti.longitude,
            }}
            onPress={() => handleMarkerPress(rasti)}
          />
        ))}
      </MapView>
      <Modal
        visible={selectedMarker !== null}
        animationType="slide"
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedMarker?.nimi}</Text>
                <Text style={styles.modalDescription}>
                  {selectedMarker?.kuvaus}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.closeButtonText}>Sulje</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    marginTop: "auto",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  modalDescription: {
    fontSize: 18,
    marginBottom: 20,
  },

  closeButton: {
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },

  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
