import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación

const BeerDetail = ({ route }) => {
  const { beerId } = route.params; // Obtener la ID de la cerveza de los parámetros de navegación
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    // Cargar detalles de la cerveza desde la API
    axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}`)
      .then(response => {
        setBeer(response.data.beer);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [beerId]);
  const navigation = useNavigation();
  const handleSubmit = () => {
    // Aquí se manejaría el envío de datos al backend
    navigation.navigate('BeerReview', { beerId: beerId})
    };


  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error loading beer details</Text>;

  return (
    <View style={styles.container}>
      {beer ? (
        <>
          <Text style={styles.title}>{beer.name}</Text>
          <Text style={styles.text}>Estilo: {beer.style}</Text>
          <Text style={styles.text}>Alcohol: {beer.alcohol}%</Text>
          {beer.brand.brewery.name && (
            <Text style={styles.text}>Producida por: {beer.brand.brewery.name}</Text>
          )}
          <Button title="Review beer" onPress={handleSubmit} />
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
  },
});

export default BeerDetail;
