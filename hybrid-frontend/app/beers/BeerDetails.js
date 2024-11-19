import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Rating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación

const NGROK_URL = process.env.NGROK_URL;

const BeerDetails = ({ route }) => {
  const { beerId } = route.params; // Obtener la ID de la cerveza de los parámetros de navegación
  const [beer, setBeer] = useState(null);
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log("URL NGROK>", NGROK_URL)

  useEffect(() => {
    const fetchBeer = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/beers/${beerId}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        //console.log("Response>", response);
        setBeer(response.data.beer || []);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    const fetchBars = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/beers/${beerId}/bars`, {
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

    fetchBeer();
    fetchBars();
  }, [beerId]);

  console.log("Beer>", beer);

  const navigation = useNavigation();
  
  const handleSubmit = () => {
    // Aquí se manejaría el envío de datos al backend
    navigation.navigate('BeerReviews', { beerId: beerId})
  };


  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error loading beer details</Text>;

  return (
    <View style={styles.container}>
      {beer ? (
        <>
          <Text style={styles.title}>
            {beer.name}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Icon 
              name="pencil"
              size={24}
              color="black"
              onPress={() => navigation.navigate('ReviewBeer', { beerId: beerId })}
            />

            <Rating 
              imageSize       = {20} 
              readonly
              
              fractions       = "{1}"
              startingValue   = {beer.avg_rating || 0} 
              tintColor       = "#f2f2f2"
            />
          </View>

          <Text style={styles.text}>
            Rating: {(beer.avg_rating ? beer.avg_rating.toFixed(2) : 'N/A')} 
          </Text>

          <Text style={styles.text}>
            Estilo: {beer.style}
          </Text>
          
          <Text style={styles.text}>Porcentaje de Alcohol: {beer.alcohol}</Text>
          {beer.brand.brewery.name && (
            <Text style={styles.text}>Producida por: {beer.brand.brewery.name}</Text>
          )}

          <Text style={styles.text}>
            Bares que sirven esta cerveza:
          </Text>
          {bars.map(bar => (
            <Text style={styles.text}>
              {bar.name}
            </Text>
          ))}
          {!bars.length && (
            <Text style={styles.text}>
              No hay bares que sirvan esta cerveza.
            </Text>
          )}

          <Button title="Reviews de usuarios" onPress={handleSubmit} />
        </>
      ) : (
        <Text>No se encontraron detalles de la cerveza.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default BeerDetails;
