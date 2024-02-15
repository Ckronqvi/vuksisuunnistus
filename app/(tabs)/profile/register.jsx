import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable
} from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import {Link} from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
          placeholder="käyttäjätunnus"
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
        <TouchableOpacity style={styles.button}>
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
};

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
    backgroundColor: "blue",
    width: "100%",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  registerText: {
    marginTop: 30,
    textDecorationLine: "underline",
    color: "blue",
    fontSize: 16,
  },
});

