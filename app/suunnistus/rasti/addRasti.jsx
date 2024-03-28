import React, { useState } from "react";
import {
  Button,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { View, Text, TextInput } from "@/components/Themed";
import MapStyle from "@/constants/MapStyle.json";
import initialRegion from "../../../constants/oulu";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const AddRasti = () => {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [locationPicked, setLocationPicked] = useState(null);
  const [showMapView, setShowMapView] = useState(false);
  const { addRasti } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setLocationPicked(coordinate);
  };

  const router = useRouter();

  const handleSave = async () => {
    if (!description || !name) {
      Alert.alert("Täytä kaikki kentät!");
      return;
    }
    if (!locationPicked) {
      Alert.alert("Valitse sijainti!");
      return;
    }
    setLoading(true);
    const result = await addRasti(name, description, locationPicked);
    if (result.success) {
      setDescription("");
      setName("");
      setLocationPicked(null);
      setLoading(false);
      router.push("/suunnistus/rasti/rastit");
    } else {
      Alert.alert("Virhe tallennettaessa rastia", result.error);
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {!showMapView && (
          <View style={styles.textContainer}>
            <Text style={styles.textTitle}>Nimi*</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Rastin nimi"
            />
            <Text style={styles.textTitle}>Kuvaus*</Text>
            <TextInput
              style={styles.textInputDescription}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              placeholder="Rastin kuvaus"
            />
          </View>
        )}
        {(locationPicked && !showMapView) && (
          <MapView
          style={styles.smallmap}
          initialRegion={{
            latitude: locationPicked.latitude,
            longitude: locationPicked.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          scrollEnabled={false}
          provider={PROVIDER_GOOGLE}
          customMapStyle={MapStyle}
        >
          <Marker coordinate={locationPicked}></Marker>
        </MapView>
        )}
        {showMapView && (
          <MapView
            style={styles.map}
            minZoomLevel={10}
            maxZoomLevel={20}
            initialRegion={initialRegion}
            onPress={handleMapPress}
            showsMyLocationButton={true}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            customMapStyle={MapStyle}
          >
            {locationPicked && <Marker coordinate={locationPicked} />}
          </MapView>
        )}
        <Button
          title={
            showMapView
              ? "Valitse"
              : locationPicked
              ? "Muokkaa"
              : "Valitse sijainti"
          }
          onPress={() => setShowMapView(!showMapView)}
        />
        {!showMapView && (
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.push("/suunnistus/rasti/rastit")}
            >
              <Text style={styles.cancelButtonText}>Peruuta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (!loading) {
                  handleSave();
                }
              }}
            >
              <Text style={styles.buttonText}>Tallenna</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 50,
  },
  map: {
    flex: 1,
    width: "100%",
    maxHeight: "100%",
  },
  smallmap: {
    width: "90%",
    height: "20%",
    marginBottom: 20,
    borderBlockColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  textContainer: {
    width: "100%",
    padding: 20,
  },
  textTitle: {
    fontWeight: "regular",
    marginBottom: 5,
    fontSize: 20,
    color: "gray",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 50,
    width: "100%",
    fontSize: 20,
  },
  textInputDescription: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 100,
    width: "100%",
    textAlignVertical: "top",
    fontSize: 18,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 30,
    paddingBottom: 50,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 10,
    borderBlockColor: "gray",
    borderWidth: 1,
  },
  cancelButtonText: {
    color: "gray",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default AddRasti;
