import React, { useEffect, useState } from "react";
import { subscribeToFeed } from "./SubscribeToFeed";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigation = useNavigation();
  
  // obtener usuario!!
  useEffect(() => {
    async function getCurrentUserId() {
      try {
        const currentUserId = await AsyncStorage.getItem('user');
        console.log("Obtained Current User>", Math.round(currentUserId));
        setCurrentUserId(Math.round(currentUserId));
      }
      catch (error) {
        console.error(error);
      }
    };

    getCurrentUserId();
  }, []);

  // subscribirse al feed
  useEffect(() => {
    if (!currentUserId) return; // no hacer nada si no hay usuario
    
    const unsubscribe = subscribeToFeed(currentUserId, (message) => {
      console.log("Received message from FeedChannel>", message);
      setFeedItems((prevItems) => [message, ...prevItems]);
    });

    return unsubscribe;
  }, [currentUserId]);

  // renderizar cada elemento del feed
  const renderFeedItem = ({ item }) => (
    <View style={styles.feedItem}>
      
      <Text style={styles.title}>
        {item.user_handle} evaluó una cerveza
      </Text>
      
      <Text style={styles.detail}>
        Cerveza: {item.beer_name}
      </Text>
      
      <Text style={styles.detail}>
        Calificación: {item.review_rating}/5
      </Text>
      
      <Button
        title   = "Ver Cerveza"
        onPress = {() => {
          navigation.navigate('BeerDetail', { beerId: item.beer_id });
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>
        Mi Feed!!
      </Text>
      
      <FlatList
        data                  = {feedItems}
        keyExtractor          = {(item) => item.review_id.toString()}
        renderItem            = {renderFeedItem}
        contentContainerStyle = {styles.list}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  feedItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
});

export default Feed;
