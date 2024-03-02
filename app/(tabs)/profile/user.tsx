import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

export default function UserScreen() {
  const { signOut, userData } = useAuth();

  //loading screen
  if (!userData || userData.username === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.info}>Käyttäjänimi: {userData.username} </Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Text style={styles.info}>Rooli: {userData.role} </Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Text style={styles.info}>Kilta: {userData.guild} </Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </View>

      {userData.role === "Suunnistaja" && (
        <TouchableOpacity
          onPress={() => router.push("/profile/createGroup")}
          style={styles.button}
        >
          <Text style={styles.createButtonText}>Luo ryhmä</Text>
        </TouchableOpacity>
      )}
      {userData.role === "Rastinpitäjä" && (
        <TouchableOpacity
          onPress={() => router.push("/profile/createGroup")}
          style={styles.button}
        >
          <Text style={styles.createButtonText}>Luo rasti</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={async () => await signOut()}
        style={styles.button}
      >
        <Text style={styles.logoutText}>Kirjaudu ulos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  userInfoContainer: {
    alignItems: "flex-start",
    marginBottom: 30,
    marginTop: 40,
    height: "50%",
    width: "90%",
    paddingTop: 30,
  },

  info: {
    fontSize: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
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

  createButtonText: {
    textAlign: "center",
    fontSize: 20,
    color: "black",
  },

  logoutText: {
    textAlign: "center",
    fontSize: 20,
    color: "black",
  },
});
