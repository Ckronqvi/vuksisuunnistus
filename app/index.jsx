import React, { useEffect, useState } from "react";
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import Toast from "react-native-root-toast";
import { Text, View, TextInput } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { Link } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";

const Index = () => {
  const [code, setCode] = useState("");
  const { loginViaPubId, loginViaPrivateId, luotuSuunnistus } = useAuth();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const [image, setImage] = useState([]);

  useEffect(() => {
    let darkImage = require("../assets/images/logo_dark.png");
    let lightImage = require("../assets/images/logo_light.png");

    if (colorScheme === "dark") {
      setImage(darkImage);
    } else {
      setImage(lightImage);
    }
  }, [colorScheme]);

  // make sure image is loaded before rendering
  useEffect(() => {
    if (!image) return;
  }, [image]);

  const handleCodeChange = (text) => {
    setCode(text);
  };

  const handleSubmit = async () => {
    // Check if the code is not empty
    if (code === "" || !(code.length == 4 || code.length == 10)) {
      Toast.show("Tarkiste syöte!", {
        duration: 1100,
        position: 300,
        containerStyle: {
          backgroundColor: "red",
          borderRadius: 10,
        },
        textStyle: {
          color: "white",
          fontSize: 20,
        },
      });
      return;
    }
    setLoading(false);
    // Check if the code is 4 characters long (suunnistajat)
    if (code.length == 4) {
      const response = await loginViaPubId(code);
      if (!response.success) {
        Alert.alert("Virhe", response.error);
      }
    }
    // Check if the code is 10 characters long (rastinpitäjät)
    if (code.length == 10) {
      const response = await loginViaPrivateId(code);
      if (!response.success) {
        Alert.alert("Virhe", response.error);
      }
    }
    setLoading(false);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={image} style={styles.logo} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Syötä koodi"
          onChangeText={handleCodeChange}
          value={code}
          keyoboardType="numeric"
          keyboardAppearance="dark"
          inputMode="numeric"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!loading) {
              handleSubmit();
            }
          }}
        >
          <Text style={styles.buttonText}>Liity suunnistukseen</Text>
        </TouchableOpacity>
        <Text style={styles.textContainer}>
          <Link href="luoSuunnistus" asChild>
            <Pressable>
              {!luotuSuunnistus ? (
                <Text style={styles.registerText}>
                  Järjestäjä? Luo suunnistus.
                </Text>
              ) : (
                <Text style={styles.registerText}>Tarkastele suunnistusta</Text>
              )}
            </Pressable>
          </Link>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 200,
  },

  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#00457a",
    width: "100%",
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 26,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    textAlign: "center",
    marginTop: 40,
    textDecorationLine: "underline",
    color: "#236c87", // semmonen turkoosi
    fontSize: 19,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },
});

export default Index;
