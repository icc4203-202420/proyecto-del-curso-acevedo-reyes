import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Card, Divider, Icon } from '@rneui/themed';
//import Icon from 'react-native-vector-icons/Entypo';
import { Rating } from 'react-native-elements';
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

  //console.log("Beer>", beer);

  const navigation = useNavigation();
  
  const handleSubmit = () => {
    // Aquí se manejaría el envío de datos al backend
    navigation.navigate('BeerReviews', { beerId: beerId})
  };


  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error loading beer details</Text>;

  if (!beer) {
    return (
      <View style={styles.container}>
        <Text style={styles.noBeerText}>No se encontraron detalles de la cerveza.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <Card containerStyle={styles.card}>
        <Card.Title style={{fontSize: 20, fontWeight: 'bold'}}>
          {beer.name}
        </Card.Title>
        
        <Card.Divider />
        
        <View style={styles.ratingContainer}>
          <Icon style={{marginRight: 10}}
            name="pencil"
            type="font-awesome"
            size={28}
            color="black"
            onPress={() => navigation.navigate('ReviewBeer', { beerId: beerId })}
          />
          <Rating
            imageSize     = {30}
            readonly
            fractions     = {1}
            startingValue = {beer.avg_rating || 0}
          />
        </View>
        <Text style={styles.ratingText}>
          Rating promedio: {beer.avg_rating ? beer.avg_rating.toFixed(2) : 'N/A'}
        </Text>
      </Card>

      {/* Beer */}
      <Card containerStyle={styles.card}>
        <Text style={styles.detailText}>Estilo: {beer.style}</Text>
        <Divider />
        <Text style={styles.detailText}>Porcentaje de Alcohol: {beer.alcohol}</Text>
        <Divider />
        {beer.brand.brewery.name && (
          <Text style={styles.detailText}>Producida por: {beer.brand.brewery.name}</Text>
        )}
      </Card>

      {/* Bars */}
      <Card containerStyle={styles.card}>
        <Card.Title>Bares que sirven esta cerveza</Card.Title>
        <Card.Divider />
        {bars.length > 0 ? (
          bars.map((bar, index) => (
            <Text key={index} style={styles.barText}>
              {bar.name}
            </Text>
          ))
        ) : (
          <Text style={styles.noBarsText}>No hay bares que sirvan esta cerveza.</Text>
        )}
      </Card>

      {/* BeerReviews */}
      <Button
        title="Ver Reviews de Usuarios"
        onPress={handleSubmit}
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  card: {
    borderRadius: 10,
    elevation: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ratingText: {
    marginTop: 5,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  barText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  noBarsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  noBeerText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
});

export default BeerDetails;
