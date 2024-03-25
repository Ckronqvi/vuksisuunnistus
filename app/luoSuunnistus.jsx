import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

//TODO: Tätä vois kattella

const luoSuunnistus = () => {

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Public Code"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.copyIcon}>
          <Ionicons name="copy-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Private Code"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.copyIcon}>
          <Ionicons name="copy-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default luoSuunnistus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    color: "#333",
    fontSize: 20,
  },
  copyIcon: {
    padding: 10,
  },
});
