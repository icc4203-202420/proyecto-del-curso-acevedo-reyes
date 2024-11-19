import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Button, Icon } from '@rneui/themed';
import axios from 'axios';
import placeHolder from '../assets/placeholder.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from 'date-fns';

const NGROK_URL = process.env.NGROK_URL;

function ProfileDetails({ route }) {
  const navigation = useNavigation();
  const { userId } = route.params; // Obtener el ID del usuario desde parámetros de navegación

  const [currentUser, setCurrentUser] = useState(null); //el usuario logueado
  const [user, setUser] = useState(null);               //el usuario del perfil que se está viendo
  const [bars, setBars] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendshipDone, setFriendshipDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true); //usado para el usuario logueado (currentUser)
  const [error, setError] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);

  
  

  // se obtiene el usuario actual desde AsyncStorage
  async function getCurrentUser() {
    try {
      const currentUser = await AsyncStorage.getItem('user');
      console.log("URL NGROK>", NGROK_URL)
      console.log("User ID del perfil>", userId)
      console.log("Current User>", Math.round(currentUser));
      setCurrentUser(Math.round(currentUser));
      setUserLoading(false);
      //return Math.round(currentUser);
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        console.log("User Profile>", response.data.user);
        setUser(response.data.user);
        setLoading(false);
      }
      catch (error) {
        setError(error);
        setLoading(false);
      };
    };

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
    getCurrentUser();
    fetchUser();
    fetchBars();
  }, [userId]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/users/${currentUser}/friendships`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        console.log("Friends>", response.data.friends);
        setFriends(response.data.friends || []);
      }
      catch (error) {
        setError(error);
        setLoading(false);
      };
    };
    fetchFriends();
  }, [currentUser]);

  const handleAddFriend = () => {
    if (selectedBar) {
      console.log("Trying to add friend using following URL");
      console.log(`${NGROK_URL}/api/v1/users/${currentUser}/friendships`);
      console.log("Old URL:")
      console.log(`${NGROK_URL}/api/v1/users/:id/friendships`);
      
      axios.post(`${NGROK_URL}/api/v1/users/${currentUser}/friendships`, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        user: currentUser,
        user_id: currentUser,
        friend_id: userId,
        bar_id: selectedBar,
      })
      .then(response => {
        setFriendshipDone(true);
        Alert.alert("Amistad creada con éxito");
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || "Error al crear la amistad";
        Alert.alert(errorMessage);
      });
    } else {
      Alert.alert("Por favor selecciona un bar.");
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;
  //if (error) return <Text style={styles.error}>Failed to load user.</Text>;
  if (!user) return <Text style={styles.error}>User not found.</Text>;

  return (
    <View style={styles.container}>
      
      <View style={styles.profileCard}>
        
        <View style={styles.imageContainer}>
          <Image source={placeHolder} style={styles.profileImage} />
        </View>

        <View style={styles.infoContainer}>
          
          <Text style={styles.userHandle}>
            <Text style={styles.handleIcon}>
              <Icon
                name  = "user-alt"
                type  = "font-awesome-5"
                color = "black"
                size  = {16}
              /> @</Text> {user.handle}
          </Text>
          
          <Text style={styles.userDescription}>
            Nombre y apellido: <Text style={styles.boldText}>{user.first_name} {user.last_name}</Text>
          </Text>
        </View>
      
      </View>

      
      {/* si el usuario logeado no es el del perfil, y ya son amigos, entonces no se puede crear la amistad*/}
      { ( (user.id !== currentUser && friends.some(friend => friend.id === user.id)) || (friendshipDone) ) ? (
        <Text style={styles.friendStatus}>
          ¡Ya son amigos!
        </Text>
      ) : (
        
        <View style={styles.friendSection}>
          
          <Text style={styles.friendPrompt}>
            Añade un bar de un evento en que se hayan conocido
          </Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue = {selectedBar}
              onValueChange = {(itemValue) => setSelectedBar(itemValue)}
              style         = {styles.picker}
            >
              <Picker.Item 
                key     = "placeholder" 
                label   = "Elige un bar" 
                value   = {null}
              />
              
              {bars.map((bar) => (
                <Picker.Item 
                  key   = {bar.id.toString()} 
                  label = {bar.name} 
                  value = {bar.id} 
                />
              ))}
            </Picker>
          </View>

          <Button style={{marginTop: 10}}
            title   = " Añadir Amigo" 
            onPress = {handleAddFriend} 
            icon    = {
              <Icon 
                name  = "user-plus" 
                type  = "font-awesome-5" 
                color = "white" 
                size  = {24} 
              />
            }
          />
    
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    color: 'blue',
  },
  profileCard: {
    flexDirection: 'row',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    flex: 2,
    paddingHorizontal: 10,
  },
  userHandle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  handleIcon: {
    fontSize: 24,
    color: 'black',
  },
  userDescription: {
    fontSize: 14,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  friendSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  friendPrompt: {
    fontSize: 16,
    
    textAlign: 'center',
  },
  pickerContainer: {
    alignItems: 'center',
  },
  picker: {
    width: 350,
    height: 200,
  },
  friendStatus: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default ProfileDetails;
