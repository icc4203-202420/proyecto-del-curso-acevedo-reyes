import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const NGROK_URL = process.env.NGROK_URL;

const ProfilesList = ({ searchKeywords, isActive }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Hook de navegación

  console.log("URL NGROK>", NGROK_URL)
  
  useEffect(() => {
    if (isActive) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${NGROK_URL}/api/v1/users`, {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          });
          //console.log("Response>", response);
          setUsers(response.data.users || []);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      }

      fetchUsers();
    }
  }, [isActive]);

  console.log("Users>", users);

  // Filtrar usuarios en base a las palabras claves de búsqueda
  const filteredUsers = users.filter(user => 
    user.handle.toLowerCase().includes(searchKeywords.toLowerCase())
  );

  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading users</Text>;

  return (
    <View style={styles.container}>
      {filteredUsers.length === 0 ? (
        <Text>No Users found.</Text>
      ) : (
        <FlatList
          data         = {filteredUsers}
          keyExtractor = {(item) => item.id.toString()}
          renderItem   = {({ item }) => (
            <TouchableOpacity
              style    = {styles.beerItem}
              onPress={() => navigation.navigate('ProfileDetails', { userId: item.id })} // Navegar a ProfileDetail
            >
              <Text style={styles.beerName}>
                {item.handle}
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
});

export default ProfilesList;