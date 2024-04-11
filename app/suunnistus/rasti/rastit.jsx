import { View, Text } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { buttonColor } from "@/constants/Colors";
import { set } from "firebase/database";
import Toast from "react-native-root-toast";

const Rastit = () => {
  const { rastit, deleteRasti } = useAuth();
  const [rastitData, setRastitData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRastit = async () => {
      try {
        setRastitData(rastit);
      } catch (error) {
        console.error("Error fetching rastit:", error);
      }
    };

    fetchRastit();
  }, [rastit]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.nimi}</Text>
        <Text>{item.kuvaus}</Text>
      </View>
      <View style={styles.itemButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            poistaRasti(item.id, item.nimi);
          }}
        >
          <Ionicons name="trash" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAddRasti = () => {
    router.push("/suunnistus/rasti/addRasti");
  };

  const poistaRasti = async (id, title) => {
    Alert.alert("Poista rasti", `Poistetaanko rasti: ${title}?`, [
      {
        text: "Peruuta",
        style: "cancel",
      },
      {
        text: "Poista",
        onPress: async () => {
          try {
            // delete first from the local list Rastit
            setRastitData((prev) => prev.filter((r) => r.id !== id));
            const toast = Toast.show("Rasti poistettu", {
              duration: 500,
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
            // then delete from the database
            await deleteRasti(id);
          } catch (error) {
            console.error("Error deleting rasti:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rastit</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={rastitData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddRasti}>
        <Text style={styles.addButtonText}>Luo rasti</Text>
      </TouchableOpacity>
    </View>
  );
};

//TODO make this themed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    width: "100%",
    maxHeight: "60%",
    marginBottom: 20,
  },
  flatList: {
    width: "100%",
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTextContainer: {
    flex: 1,
  },
  itemButtonContainer: {
    marginLeft: 10,
  },
  itemTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: buttonColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Rastit;
