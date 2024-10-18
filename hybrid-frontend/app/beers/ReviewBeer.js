import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Rating, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import useAxios from 'axios-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  text: Yup.string()
    .required('La reseña es requerida')
    .test('wordCount', 'La reseña debe contener al menos 15 palabras.', (value) => {
      if (value) {
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount >= 15;
      }
      return false;
    }),
  rating: Yup.number().min(1, 'La calificación debe ser al menos 1').max(5, 'La calificación no puede ser mayor a 5').required('La calificación es requerida'),
});
  
const initialValues = {
  text: '',
  rating: 1,
};

const NGROK_URL = process.env.NGROK_URL;

const ReviewBeer = ({ route }) => {
  const { beerId } = route.params;
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [userReview, setUserReview] = useState(null);

  const navigation = useNavigation();

  console.log("URL NGROK>", NGROK_URL)
  console.log("Beer ID>", beerId)
  
  /*
  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/beers/${beerId}`)
      .then(response => {
        const fetchedBeer = response.data.beer;
        setBeer(fetchedBeer);
        setReviews(fetchedBeer.reviews || []);
        setAvgRating(fetchedBeer.avg_rating || 0);

        const userId = 1; // Simulación del user ID
        const userReview = fetchedBeer.reviews.find(review => review.user.id === userId);
        setUserReview(userReview);

        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [beerId]);
  */

  useEffect(() => {
    const fetchBeerReviews = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/beers/${beerId}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        console.log("Response>", response);
        
        const fetchedBeer = response.data.beer;
        setBeer(fetchedBeer);
        setReviews(fetchedBeer.reviews || []);
        setAvgRating(fetchedBeer.avg_rating || 0);

        const userId = 1; // Simulación del user ID
        const userReview = fetchedBeer.reviews.find(review => review.user.id === userId);
        setUserReview(userReview);

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

      {/* Reseña del usuario actual */}
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

export default ReviewBeer;

