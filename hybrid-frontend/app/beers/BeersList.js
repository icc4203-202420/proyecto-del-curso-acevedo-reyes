import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const NGROK_URL = process.env.NGROK_URL;

const BeersList = ({ searchKeywords }) => {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Hook de navegación

  
  console.log("URL NGROK>", NGROK_URL)
  
  /*
  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/beers`)
      .then(response => {
        setBeers(response.data.beers || []);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);
  */

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/beers`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        console.log("Response>", response);
        setBeers(response.data.beers || []);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    fetchBeers();
  }, []);

  console.log("Beers>", beers)

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchKeywords.toLowerCase())
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading beers</Text>;

  return (
    <View style={styles.container}>
      {filteredBeers.length === 0 ? (
        <Text>No beers found.</Text>
      ) : (
        <FlatList
          data={filteredBeers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.beerItem}
              onPress={() => navigation.navigate('BeerDetail', { beerId: item.id })} // Navegar a BeerDetail
            >
              <Text style={styles.beerName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  beerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  beerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BeersList;
