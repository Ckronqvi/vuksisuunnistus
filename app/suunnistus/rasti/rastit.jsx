import { View, Text } from '@/components/Themed'
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import {useAuth} from '@/context/AuthContext'
import {useRouter} from 'expo-router'

const Rastit = () => {
  const { getRastit, addRasti, rastit } = useAuth();
  const [rastitData, setRastitData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRastit = async () => {
      try {
        setRastitData(rastit);
      } catch (error) {
        console.error('Error fetching rastit:', error);
      }
    };

    fetchRastit();
  }, [rastit]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.nimi}</Text>
      <Text>{item.kuvaus}</Text>
      <Text>{`Latitude: ${item.sijainti.latitude}, Longitude: ${item.sijainti.longitude}`}</Text>
    </View>
  );

  const handleAddRasti = () => {
    router.replace('/suunnistus/rasti/addRasti');
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
        <Text style={styles.addButtonText}>Lisää rasti</Text>
      </TouchableOpacity>
    </View>
  );
};

//TODO make this themed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    maxHeight: '60%',
    marginBottom: 20,
  },
  flatList: {
    width: '100%',
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 30,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Rastit;