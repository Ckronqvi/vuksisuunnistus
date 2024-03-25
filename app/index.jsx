import React, { useState } from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  StyleSheet,
  Alert
} from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { Link } from "expo-router";

const Index = () => {
  const [code, setCode] = useState("");
  const { loginViaPubId, loginViaPrivateId } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (text) => {
    setCode(text);
  };

  const handleSubmit = async () => {
    // Check if the code is not empty
    if (code === "" || !(code.length == 4 || code.length == 10)) {
      Alert.alert("Tarkista syöte");
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
      <TextInput
        style={styles.input}
        placeholder="Syötä koodi"
        onChangeText={handleCodeChange}
        value={code}
        keyoboardType="numeric"
        keyboardAppearance="dark"
        inputMode="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={() => {
          if (!loading) {
            handleSubmit();
          }
        }}>
          <Text style={styles.buttonText}>Liity suunnistukseen</Text>
        </TouchableOpacity>
      <Text style={styles.textContainer}>
        <Link href="luoSuunnistus" asChild>
          <Pressable>
            <Text style={styles.registerText}>
              Järjestäjä? Luo suunnistus.
            </Text>
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
      paddingTop: 100,
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
      marginBottom: 40,
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
      marginTop: 40,
      textDecorationLine: "underline",
      color: "#236c87", // semmonen turkoosi
      fontSize: 20,
    },
  });

export default Index;
