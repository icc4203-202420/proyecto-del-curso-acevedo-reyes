import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Rating, Button } from 'react-native-elements';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NGROK_URL = process.env.NGROK_URL;

const BeerReview = ({ route }) => {
  const { beerId } = route.params;
  const [beer, setBeer] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [userReview, setUserReview] = useState(null);

  const navigation = useNavigation();

  console.log("URL NGROK>", NGROK_URL)
  console.log("Beer ID>", beerId)
  
  //fetchear el usuario (todavia no guardamos el token si jejejej)
  //useEffect(() => {
  //const getUser = async () => {
  async function getUser() {
    try {
      const currentUser = await AsyncStorage.getItem('user');
      setUser(Math.round(currentUser));
      setUserLoading(false);
      return Math.round(currentUser);
    }
    catch (error) {
      console.error(error);
    }
  };

    //getUser();
  //}, []);

  useEffect(() => {
    const fetchBeerReviews = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/beers/${beerId}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        //console.log("Response>", response);
        
        const fetchedBeer = response.data.beer;
        setBeer(fetchedBeer);
        
        const currentUser = await getUser(); //esto no me funciona que horrible!!! asyncStorage deberias esr syncstorage!!
        setUser(currentUser);
        console.log("User>", user);
        //if (!userLoading) {
        
        const userReview = fetchedBeer.reviews.find(review => review.user.id === user);
        setUserReview(userReview);

        const otherReviews = fetchedBeer.reviews.filter(review => review.user.id !== user);
        setReviews(otherReviews || []);
        
        setAvgRating(fetchedBeer.avg_rating || 0);
        setLoading(false);
        
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
  
    fetchBeerReviews();
  }, [beerId]);
  

  console.log("Reviews>", reviews);
  console.log("Avg Rating>", avgRating);
  console.log("User Review>", userReview);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading beer reviews.</Text>;

  /*
  return (
    <View style={styles.container}>
      <Button
        title="Back to Beer Details"
        onPress={() => navigation.goBack()}
        buttonStyle={styles.backButton}
      />

      <Text style={styles.beerName}>{beer.name}</Text>
      <Rating imageSize={20} readonly startingValue={avgRating} />
      <Text style={styles.avgRating}>Rating: {avgRating.toFixed(2)} ({reviews.length} reviews)</Text>

       Reseña del usuario actual
      {userReview && (
        <View style={styles.reviewCard}>
          <Text style={styles.userName}>You (@{userReview.user.handle})</Text>
          <Rating imageSize={20} readonly startingValue={userReview.rating} />
          <Text style={styles.reviewText}>{userReview.text}</Text>
        </View>
      )}

      <FlatList
        data={reviews}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.userName}>@{item.user.handle}</Text>
            <Rating imageSize={20} readonly startingValue={item.rating} />
            <Text style={styles.reviewText}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
  */

  return (
    <View style={styles.container}>
      <Button
        title="Back to Beer Details"
        onPress={() => navigation.goBack()}
        buttonStyle={styles.backButton}
      />
  
      <Text style={styles.beerName}>{beer.name}</Text>
      <Rating imageSize={20} readonly startingValue={avgRating} />
      <Text style={styles.avgRating}>Rating: {avgRating.toFixed(2)} ({reviews.length + (userReview ? 1 : 0)} reviews)</Text>
  
      {userLoading ? (
        <ActivityIndicator />
      ) : (
      <>
        {/* Reseña del usuario actual */}
        {userReview && (
          <View style={styles.reviewCard}>
            <Text style={styles.userName}>Tu (@{userReview.user.handle})</Text>
            <Rating imageSize={20} readonly startingValue={userReview.rating} />
            <Text style={styles.reviewText}>{userReview.text}</Text>
          </View>
        )}
    
        {/* Reseñas de otros usuarios */}
        <FlatList
          initialNumToRender={6}
          data={reviews}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <Text style={styles.userName}>@{item.user.handle}</Text>
              <Rating imageSize={20} readonly startingValue={item.rating} />
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          )}
        />
      </>
      
      )}
      
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  beerName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  avgRating: {
    textAlign: 'center',
    marginBottom: 20,
  },
  reviewCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewText: {
    marginTop: 5,
  },
  backButton: {
    backgroundColor: '#c0874f',
    marginBottom: 20,
  },
});

export default BeerReview;

