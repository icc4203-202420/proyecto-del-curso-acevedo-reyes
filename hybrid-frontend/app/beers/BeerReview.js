import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Rating, Button } from 'react-native-elements';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const BeerReview = ({ route }) => {
  const { beerId } = route.params;
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [userReview, setUserReview] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}`)
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

export default BeerReview;

