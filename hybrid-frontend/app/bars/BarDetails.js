import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { Divider, Icon, Image, Card } from '@rneui/themed';
import axios from 'axios';
import { format } from 'date-fns';

const NGROK_URL = process.env.NGROK_URL;

function BarDetails({ route }) {
  const navigation = useNavigation();
  const { barId } = route.params;

  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => format(new Date(dateString), "MMMM d, yyyy 'a las' h:mm a");

  // se obtiene el bar y sus eventos!!
  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/bars/${barId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      })
      .then(response => {
        setBar(response.data.bar);
        return axios.get(`${NGROK_URL}/api/v1/bars/${barId}/events`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
      })
      .then(response => {
        setEvents(response.data.events);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [barId]);

  if (!barId) return <Text style={styles.errorText}>Bar ID no existe.</Text>;
  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.errorText}>Failed to load bar details.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Bar Info */}
      <Text style={styles.title}>
        {bar?.name}
      </Text>

      <Image
        source             = {{ uri: 'https://via.placeholder.com/300x200' }}
        style              = {styles.barImage}
        PlaceholderContent = {<ActivityIndicator />}
      />
      
      {/* Address */}
      <View style={styles.addressContainer}>
        <Icon name="location-pin" type="material" color="black" size={24} />
        <Text style={styles.addressText}>
          {bar?.address.line1}, {bar?.address.line2}, {bar?.address.city}, {bar?.address.country.name}
        </Text>
      </View>

      {/* Divider */}
      <Divider style={styles.divider} />

      {/* Eventos */}
      <View style={styles.eventsContainer}>
        <Text style={styles.eventsHeader}>
          <Icon 
            name  = "bookmark" 
            type  = "material" 
            color = "black" 
            size  = {24} 
          /> 
          Próximos Eventos
        </Text>

        {events.map((event) => (
          <Card key={event.id} containerStyle={styles.eventCard}>
            
            <View style={styles.eventHeader}>
              <Icon 
                name  = "bookmark-border" 
                type  = "material" 
                color = "black" 
                size  = {20} 
              />
              <Text style={styles.eventTitle}>
                Evento {event.name}
              </Text>
            </View>
            
            <View style={styles.eventDateContainer}>
              <Icon 
                name  = "today" 
                type  = "material" 
                color = "black" 
                size  = {20} 
              />
              <Text style={styles.eventDate}>
                {formatDate(event.date)}
              </Text>
            </View>

            <Button
              title   = "Ver más..."
              onPress = {() => navigation.navigate('EventDetails', {eventId: event.id})}
              color   = "#0000ff"
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
            />
            
            
          
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  barImage: {
    width: '100%',
    height: 200,
    marginVertical: 12,
  },
  ratingText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  addressText: {
    fontSize: 16,
    marginLeft: 8,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 20,
    height: 1,
  },
  eventsContainer: {
    marginVertical: 16,
  },
  eventsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  eventCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  eventDate: {
    fontSize: 14,
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
    width: '60%',
  },
});

export default BarDetails;
