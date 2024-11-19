import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const NGROK_URL = process.env.NGROK_URL;

const BarsList = ({ searchKeywords, isActive }) => {
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Hook de navegación

  console.log("URL NGROK>", NGROK_URL)
  
  useEffect(() => {
    if (isActive) {
      const fetchBars = async () => {
        try {
          const response = await axios.get(`${NGROK_URL}/api/v1/bars`, {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          });
          //console.log("Response>", response);
          setBars(response.data.bars || []);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      }

      fetchBars();
    }
  }, [isActive]);

  console.log("Bars>", bars);

  // Filtrar usuarios en base a las palabras claves de búsqueda
  const filteredBars = bars.filter(bar => 
    bar.name.toLowerCase().includes(searchKeywords.toLowerCase())
  );

  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading bars</Text>;

  return (
    <View style={styles.container}>
      {filteredBars.length === 0 ? (
        <Text style={styles.title}>
          No se encontraron Bares.
        </Text>
      ) : (
        <FlatList
          data         = {filteredBars}
          keyExtractor = {(item) => item.id.toString()}
          renderItem   = {({ item }) => (
            <TouchableOpacity
              style    = {styles.beerItem}
              onPress={() => navigation.navigate('BarDetails', { barId: item.id })} // Navegar a BarDetails
            >
              <Text style={styles.beerName}>
                {item.name}
              </Text>
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
  title : {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    alignSelf: 'center',
  },
});

export default BarsList;