import { View, Text, TextInput } from "@/components/Themed";
import { React, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Alert,
} from "react-native";
import { router } from "expo-router";

export default function CreateGroupScreen() {
  const [name, setName] = useState("");

  const handleNameChange = (text) => {
    if (text.length <= 25) {
      setName(text);
    } else {
      Alert.alert("Liian pitkä nimi", "Rajoita syöte 25 merkkiin.", [
        { text: "OK" },
      ]);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Ryhmän nimi"
          value={name}
          autoCapitalize="none"
          onChangeText={handleNameChange}
        />

        <TouchableOpacity
          onPress={async () => await signOut()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Tallenna</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => router.push("/profile/user")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Peruuta</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#d3d3d3",
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
    width: "70%",
    height: 80,
    justifyContent: "center",
    //shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "black",
  },
});
