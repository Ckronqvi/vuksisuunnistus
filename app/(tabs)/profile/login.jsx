import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Alert,
} from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Tarkista syöte", "Täytä kaikki kentät.");
      return;
    }
    setLoading(true);
    const response = await signIn(email, password);
    if (!response.success) {
      Alert.alert("Virhe", response.error);
    }
    setLoading(false);
  };

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
          placeholder="Salasana"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Kirjaudu</Text>
        </TouchableOpacity>

        <Link href="profile\register" asChild>
          <Pressable>
            <Text style={styles.registerText}>
              Eikö sinulla ole tiliä? Rekisteröidy
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
});
