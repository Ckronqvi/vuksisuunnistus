import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import { Text, TextInput } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
import { useColorScheme } from "../components/useColorScheme";

const LuoSuunnistus = () => {
  const { createSuunnistus, luotuSuunnistus, endSuunnistus } = useAuth();
  const [publicCode, setPublicCode] = useState("");
  const [privateCode, setPrivateCode] = useState("");
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme();
  useEffect(() => {
    if (luotuSuunnistus) {
      setPublicCode(luotuSuunnistus.pubCode.toString());
      setPrivateCode(luotuSuunnistus.privateCode.toString());
    } else {
      setPublicCode("");
      setPrivateCode("");
    }
  }, [luotuSuunnistus]);
  
  useEffect(() => {
    if (loading) {
      // show Toast
      Toast.show("Luodaan suunnistusta...", {
        duration: 2000,
        position: 300,
        containerStyle: {
          backgroundColor: "#236c87",
          borderRadius: 10,
        },
        textStyle: {
          color: "white",
          fontSize: 20,
        },
      });
    }
  }, [loading]);

  const handleCreateSuunnistus = async () => {
    setLoading(true);
    const response = await createSuunnistus();
    if (response.success) {
      Toast.show("Suunnistus luotu!", {
        duration: 1500,
        position: 360,
        containerStyle: {
          backgroundColor: "#236c87",
          borderRadius: 10,
        },
        textStyle: {
          color: "white",
          fontSize: 20,
        },
      });
    } else {
      Alert.alert("Virhe", response.error);
    }
    setLoading(false);
  };

  const copyToClipboard = async (code) => {
    await Clipboard.setStringAsync(code);
    Toast.show("Kopioitu", {
      duration: 200,
      position: 370,
      containerStyle: {
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: 10,
      },
      textStyle: {
        color: "white",
        fontSize: 20,
      },
    });
  };

  const end = async () => {
    await endSuunnistus();
  };

  return (
    loading ? <ActivityIndicator size="large" color="#236c87" style={styles.spinner} /> :
    <View style={styles.container}>
      <View style={styles.codeBox}>
        <Text style={styles.codeTitle}>Jaa suunnistajille:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.codeInput}
            value={publicCode}
            editable={false}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              copyToClipboard(publicCode);
            }}
          >
            <Ionicons
              name="clipboard"
              size={30}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.codeBox}>
        <Text style={styles.codeTitle}>Jaa rastinpitäjille:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.codeInputWarning}
            value={privateCode}
            editable={false}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              copyToClipboard(privateCode);
            }}
          >
            <Ionicons name="clipboard" size={30} color="#f23d3d" />
          </TouchableOpacity>
        </View>
      </View>
      {publicCode !== "" && (
        <TouchableOpacity
          style={styles.buttonEnd}
          onPress={loading ? null : end}
        >
          <Text style={styles.buttonText}>Lopeta suunnistus</Text>
        </TouchableOpacity>
      )}
      {publicCode === "" && (
        <TouchableOpacity
          style={styles.button}
          onPress={loading ? null : handleCreateSuunnistus}
        >
          <Text style={styles.buttonText}>Luo Suunnistus</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LuoSuunnistus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    flex: 1,
  },
  codeBox: {
    marginBottom: 20,
    marginTop: 50,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  codeTitle: {
    fontSize: 24,
    marginBottom: 5,
    width: "80%",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#212121",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  codeInput: {
    flex: 1,
    height: 50,
    paddingLeft: 30,
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 10,
  },
  codeInputWarning: {
    flex: 1,
    height: 50,
    paddingLeft: 30,
    color: "#f23d3d",
    fontSize: 30,
    textAlign: "center",
    letterSpacing: 2,
  },
  iconContainer: {
    paddingRight: 10,
  },
  button: {
    marginTop: 100,
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: "#236c87",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  buttonEnd: {
    marginTop: 100,
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: "#f23d3d",
  },
});
