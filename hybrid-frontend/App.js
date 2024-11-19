import React, { useContext, useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import LogIn from './app/auth/logindex';
import SignUp from './app/auth/regindex';
import Home from './app/home/home';
import Profile from './app/profile';
import BeerDetails from './app/beers/BeerDetails';
import BeerReviews from './app/beers/BeerReviews';
import ReviewBeer from './app/beers/ReviewBeer';
import ProfileDetails from './app/users/ProfileDetails';
import BarDetails from './app/bars/BarDetails';
import EventDetails from './app/events/EventDetails';
import EventPictures from './app/events/EventPictures';

import * as Notifications from 'expo-notifications';
import { FeedProvider } from './contexts/FeedContext';
//import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  //const [currentUserId, setCurrentUserId] = useState(null);
  const navigationRef = useRef(); // Agrega una referencia para la navegación
  
  // Mock para ActionCable en React Native
  if (typeof global.addEventListener !== "function") {
    global.addEventListener = () => {};
  }

  if (typeof global.removeEventListener !== "function") {
    global.removeEventListener = () => {};
  }

  // obtener el token del usuario
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await SecureStore.getItemAsync('token');
      console.log('DESDE APP.js:token', token);
      //setIsLoggedIn(!!token); // true si el token existe, false si es nulo
      if (token) {
        setIsLoggedIn(true);
      }
      else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    };
    checkAuthentication();
  }, []);

  // Configuración de notificaciones
  useEffect(() => {
    // Configuración para manejar la recepción de la notificación
    const receivedListener = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const { title, body, data } = notification.request.content;
        if (title.includes("¡Has agregado un nuevo amigo!")) {
          console.log("Notificación recibida:", title, body);
        }
      }
    );

    // Configuración para manejar cuando el usuario interactúa con la notificación
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const { screen } = response.notification.request.content.data;
      if (screen === 'Home' && navigationRef.current) {
        navigationRef.current.navigate('Home'); // Usar la referencia de navegación para redirigir
      }
      if (screen === 'EventDetails' && navigationRef.current) {
        const { event_id } = response.notification.request.content.data;
        navigationRef.current.navigate('EventDetails', { eventId: event_id });
      }
      if (screen === 'EventPictures' && navigationRef.current) {
        const { event_id } = response.notification.request.content.data;
        navigationRef.current.navigate('EventPictures', { eventId: event_id });
      }

    });

    // Limpieza de listeners al desmontar
    return () => {
      Notifications.removeNotificationSubscription(receivedListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Muestra un indicador de carga mientras se valida el token
  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FeedProvider>
        <NavigationContainer ref={navigationRef}>
          <View style={styles.container}>
            <Stack.Navigator 
              initialRouteName={isLoggedIn ? "Home" : "LogIn"}  
            >
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="BeerDetails" component={BeerDetails} />
              <Stack.Screen name="BeerReviews" component={BeerReviews} />
              <Stack.Screen name="ReviewBeer" component={ReviewBeer} />
              <Stack.Screen name="LogIn" component={LogIn} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
              <Stack.Screen name="BarDetails" component={BarDetails} />
              <Stack.Screen name="EventDetails" component={EventDetails} />
              <Stack.Screen name="EventPictures" component={EventPictures} />
            </Stack.Navigator>
          </View> 
        </NavigationContainer>
      </FeedProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
