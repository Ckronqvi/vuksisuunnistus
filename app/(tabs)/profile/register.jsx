import React, { useState } from "react";
import { SelectList } from "@/components/Themed";
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedKilta, setSelectedKilta] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const killat = [
    { key: "1", value: "Atlas" },
    { key: "1", value: "Blanko ry" },
    { key: "2", value: "Kultu" },
    { key: "3", value: "Sigma" },
    { key: "4", value: "Suma" },
    { key: "5", value: "Tiima" },
    { key: "6", value: "Verba" },
  ];

  const handleRegister = async () => { 
    // check that all fields are filled
    if (email === "" || username === "" || password === "" || selectedKilta === "") {
      Alert.alert("Tarkista syöte", "Täytä kaikki kentät.");
      return;
    }
    setLoading(true);
    let response = await signUp(email, username, password, selectedKilta);
    if(!response.success) {
      Alert.alert("Rekisteröinti", response.error);
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Sähköposti"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Käyttäjätunnus"
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Salasana"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <SelectList
          setSelected={(val) => setSelectedKilta(val)}
          data={killat}
          save="value"
          search={false}
          placeholder="Valitse kilta"
          boxStyles={styles.boxStyles}
          dropdownStyles={{borderRadius: 3, marginTop: 0, borderTopWidth: 0}}
          dropdownItemStyles={{ paddingHorizontal: 0, paddingVertical: 2}}
          inputStyles={{color: "gray", fontSize: 16}}
          dropdownTextStyles={styles.dropDownTextStyle}
          maxHeight={150}
        />

        <TouchableOpacity style={styles.button} onPress={() => {
          if (!loading) {
            handleRegister();
          }
        }}>
          <Text style={styles.buttonText}>Rekisteröidy</Text>
        </TouchableOpacity>
        <Link href="profile\login" asChild>
          <Pressable>
            <Text style={styles.registerText}>
              Onko sinulla jo tili? Kirjaudu sisään
            </Text>
          </Pressable>
        </Link>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
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
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#00457a",
    width: "100%",
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 26,
  },
  registerText: {
    marginTop: 30,
    textDecorationLine: "underline",
    color: "#236c87", // semmonen turkoosi
    fontSize: 17,
  },
  boxStyles: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 0,
    alignContent: "center",
    paddingTop: 15,
  },
  dropDownTextStyle: {
    fontSize: 20,
    width: "100%",
    height: 40,
    textAlign: "center",
    paddingTop: 10,
    marginTop: 0,
  }
});
