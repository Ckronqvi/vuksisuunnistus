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
            <Text style={styles.textTitle}>Nimi:</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.textTitle}>Kuvaus:</Text>
            <TextInput
              style={styles.textInputDescription}
              value={description}
              onChangeText={setDescription}
              multiline={true}
            />
          </View>
        )}
        {locationPicked && (
          <View style={styles.textContainer}>
            <Text style={styles.textTitle}>Valittu sijainti:</Text>
            <Text>{`Latitude: ${locationPicked.latitude}, Longitude: ${locationPicked.longitude}`}</Text>
          </View>
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
              style={styles.button}
              onPress={() => router.push("/suunnistus/rasti/rastit")}
            >
              <Text style={styles.buttonText}>Peruuta</Text>
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
    maxHeight: "80%",
  },
  textContainer: {
    width: "100%",
    padding: 20,
  },
  textTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  textInputDescription: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 100,
    width: "100%",
    textAlignVertical: "top",
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddRasti;
