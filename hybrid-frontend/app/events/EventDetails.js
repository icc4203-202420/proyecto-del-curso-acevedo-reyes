import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Icon, Divider, Button, Card } from '@rneui/themed';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { set } from 'date-fns';

const validationSchema = Yup.object({
});

const initialValues = {
};

const NGROK_URL = process.env.NGROK_URL;

function EventDetails() {
  const [event, setEvent] = useState([]);
  const [bar, setBar] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [friends, setFriends] = useState([]);
  const [getError, setGetError] = useState(null);
  const [getLoading, setGetLoading] = useState(true);
  
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;

  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // obtener usuario actual y su authtoken!
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        console.log("User:", Math.round(user));
        setCurrentUser(Math.round(user));
      } 
      catch (error) {
        console.error("Error en getUser:", error);
      }
      finally {
        setGetLoading(false);
      }
    };

    const getToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        console.log("AuthToken:", token);
        setAuthToken(token);
      }
      catch (error) {
        console.error("Error en getToken:", error);
      }
      finally {
        setGetLoading(false);
      }
    };

    getUser();
    getToken();
  }, [currentUser]);
    
  // obtener evento!!
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/events/${eventId}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        console.log('Evento:', response.data.event);
        setEvent(response.data.event);
        setBar(response.data.event.bar);
        setAttendances(response.data.event.attendances || []);
        setGetLoading(false);
      }
      catch (error) {
        setGetError(error);
        setGetLoading(false);
      };
    };
    
    fetchEvent();
  }, [eventId]);

  // obtener amigos!!
  useEffect(() => {
    const fetchFriends = async () => {
      console.log("Fetch Friends called")
      try {
        console.log("Try subsection of fetch friends")
        const response = await axios.get(`${NGROK_URL}/api/v1/users/${currentUser}/friendships`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        console.log("Response?")
        console.log('Amigos:', response.data.friends);
        setFriends(response.data.friends || []);
        setGetLoading(false);
      }
      catch (error) {
        console.log("Couldn't load friends")
        setGetError(error);
        setGetLoading(false);
      };
    };

    fetchFriends();
  }, [currentUser]);

  // POST de envio de confirmacion de asistencia
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post(`${NGROK_URL}/api/v1/attendances`, {
        attendance: {
          event_id: eventId,
          user_id: currentUser,
          checked_in: true,
        },
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authToken,
          'ngrok-skip-browser-warning': 'true'
        },
      });
    } 
    catch (error) {
      console.error('Error:', error);
    } 
    finally {
      setSubmitting(false);
    }
  };

  //console.log("Bar>>>>:", bar);
  //console.log("Event>>>>:", event);
  //console.log("Friends>>>>:", friends);
  //console.log("CurrentUser>>>>:", currentUser);
  //console.log("AuthToken>>>>:", authToken);

  if (getLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  //if (getError) return <Text>Error al fetchear evento y/o amigos!</Text>;

  return (
    <ScrollView style={styles.container}>
       
       {/* direccion a EventPictures!! */}
       <View style={{ alignItems: 'center' }}>
        <Button
          type    = "clear"
          onPress = {() => navigation.navigate('EventPictures', { eventId: event.id })}
          icon    = {
            <Icon
              name  = "videocam"
              type  = "material"
              color = "black"
              size  = {24}
            />
          }
          title      = "Ver y subir Fotos a la Galería!"
          titleStyle = {{ color: 'black', fontWeight: 'semibold' }}
        />
      </View>

      <Text style={styles.eventTitle}>
        ¡{bar.name} te invita a celebrar!
      </Text>
      
      <Divider style={styles.divider} />

      {/* Confirmar asistencia */}
      {attendances.some(attendance => attendance.user.id === currentUser) ? (
        <Text style={styles.attendanceText}>Gracias por confirmar tu asistencia.</Text>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Button
              title    = {isSubmitting ? "Enviando solicitud..." : "Confirmar Asistencia"}
              onPress  = {handleSubmit}
              disabled = {isSubmitting}
            />
          )}
        </Formik>
      )}

      <Card>
        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.detailsContainer}>
          <Icon name="today" />
          <Text style={styles.detailText}>{formatDate(event.date)}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Icon name="schedule" />
          <Text style={styles.detailText}>Duración: desde {event.start_date || 'indefinida'} hasta {event.end_date || 'indefinida'}</Text>
        </View>
      </Card> 

      <Card>
        <Text style={styles.sectionTitle}>
          <Icon 
            name    = "user-friends" 
            type    = "font-awesome-5" 
            color   = "black" 
            size    = {24} 
          /> Amigos Asistentes
        </Text>

        <View style={styles.attendees}>
          {friends.length > 0 ? (
            friends.some(friend => attendances.some(a => a.user.id === friend.id)) ? (
              attendances.map((attendance) => (
                friends.some(friend => friend.id === attendance.user.id) && (
                  <Text key={attendance.id}>@{attendance.user.handle}</Text>
                )
              ))
            ) : <Text>Ninguno de tus amigos ha confirmado asistencia.</Text>
          ) : (
            <Text>Aún no tienes amigos.</Text>
          )}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>
          <Icon 
            name    = "person" 
            type    = "material" 
            color   = "black" 
            size    = {24} 
          /> Asistentes
        </Text>
        <View style={styles.attendees}>
          {attendances.map((attendance, index) => (
            <Text key={attendance.id}>@{attendance.user.handle}{index < attendances.length - 1 ? ', ' : ''}</Text>
          ))}
        </View>
      </Card>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'lightgray',
  },
  appBarText: {
    fontSize: 18,
    marginLeft: 8,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  divider: {
    marginVertical: 8,
  },
  attendanceText: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
    marginVertical: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  attendees: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default EventDetails;
