import React, { useContext, useState } from "react";
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
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Toast from "react-native-root-toast";
import { UserLocationContext } from "@/context/UserLocationContext";
import { buttonColor } from "@/constants/Colors";

const AddRasti = () => {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [locationPicked, setLocationPicked] = useState(null);
  const [showMapView, setShowMapView] = useState(false);
  const { addRasti } = useAuth();
  const [loading, setLoading] = useState(false);

  // user's location
  const { location, setLocation } = useContext(UserLocationContext);

  const userLocation = location && {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

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
    const luodaanToast = Toast.show("Luodaan rastia...", {
      duration: 3000,
      position: 300,
      containerStyle: {
        backgroundColor: "gray",
        borderRadius: 10,
      },
      textStyle: {
        color: "white",
        fontSize: 18,
      },
    });
    setLoading(true);
    const result = await addRasti(name, description, locationPicked);
    if (result.success) {
      setDescription("");
      setName("");
      setLocationPicked(null);
      setLoading(false);
      Toast.hide(luodaanToast);
      Toast.show("Rasti luotu!", {
        duration: 1000,
        position: 300,
        containerStyle: {
          backgroundColor: "green",
          borderRadius: 10,
        },
        textStyle: {
          color: "white",
          fontSize: 20,
        },
      });
      router.back();
      router.replace("/suunnistus/kartta");
    } else {
      Alert.alert("Virhe tallennettaessa rastia", result.error);
      setLoading(false);
    }
  };

  // little map view
  const smallMapView = () => {
    const locPicked = locationPicked && {
      latitude: locationPicked.latitude,
      longitude: locationPicked.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    return (
      <MapView
        style={styles.smallmap}
        initialRegion={locationPicked ? locPicked : userLocation}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapStyle}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {locationPicked && <Marker coordinate={locationPicked} />}
      </MapView>
    );
  };

  // pick location map view
  const pickLocationMapView = () => {
    const locPicked = locationPicked && {
      latitude: locationPicked.latitude,
      longitude: locationPicked.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    return (
      <MapView
        style={styles.map}
        minZoomLevel={5}
        maxZoomLevel={20}
        initialRegion={locationPicked ? locPicked : userLocation}
        onPress={handleMapPress}
        showsMyLocationButton={true}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapStyle}
      >
        {locationPicked && <Marker coordinate={locationPicked} />}
      </MapView>
    );
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
              placeholderTextColor="gray"
            />
            <Text style={styles.textTitle}>Kuvaus*</Text>
            <TextInput
              style={styles.textInputDescription}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              placeholder="Rastin kuvaus"
              placeholderTextColor="gray"
            />
          </View>
        )}
        {!showMapView && (
          <View style={styles.smallMapContainer}>
            <Text style={styles.textTitle}>Sijainti*</Text>
            <TouchableOpacity
              onPress={() => setShowMapView(!showMapView)}
              style={styles.smallMapButton}
            >
              {smallMapView()}
            </TouchableOpacity>
          </View>
        )}
        {showMapView && (
          <View style={styles.locationMapContainer}>
            <Text style={styles.karttaTitle}>
              Valitse sijainti klikkaamalla karttaa
            </Text>
            {pickLocationMapView()}
            <View style={styles.mapButtonContainer}>
              <TouchableOpacity
                style={{
                  ...styles.button,
                  backgroundColor: locationPicked ? buttonColor : "gray",
                  opacity: locationPicked ? 1 : 0.3,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setShowMapView(!showMapView)}
              >
                <Text style={{ ...styles.buttonText, fontSize: 28 }}>
                  Valitse
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!showMapView && (
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
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
    paddingBottom: 20,
  },
  karttaTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: "90%",
    borderBlockColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  locationMapContainer: {
    width: "100%",
    height: "90%",
    padding: 10,
  },
  smallmap: {
    width: "100%",
    height: "90%",
    borderBlockColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  smallMapButton: {
    width: "100%",
    height: "100%",
    marginBottom: 20,
  },
  smallMapContainer: {
    width: "100%",
    height: 130,
    padding: 20,
  },

  mapButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 5,
    marginTop: 10,
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
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 30,
    paddingBottom: 20,
    marginTop: 30,
  },
  button: {
    backgroundColor: buttonColor,
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
    backgroundColor: "white",
  },
  cancelButtonText: {
    color: "gray",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default AddRasti;
