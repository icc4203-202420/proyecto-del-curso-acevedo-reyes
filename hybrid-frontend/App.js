/*
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import FixedBottomNav from './components/FixedBottomNav';
import LogIn from './app/auth/logindex';
import SignUp from './app/auth/regindex';
import Home from './app/home/home';
import Profile from './app/profile';
import BeerDetail from './app/beers/BeerDetail';
import BeerReview from './app/beers/BeerReview';
import ReviewBeer from './app/beers/ReviewBeer';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await SecureStore.getItemAsync('token');
      console.log('DESDE APP.js:token', token);
      setIsLoggedIn(!!token); // true si el token existe, false si es nulo
    };
    checkAuthentication();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <View style={styles.container}>
          
          <Stack.Navigator 
            initialRouteName={isLoggedIn ? "Home" : "LogIn"}  
          >
            {isLoggedIn ? (
              // Pantallas para usuarios autenticados con `FixedBottomNav`
              <Stack.Group>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="BeerDetail" component={BeerDetail} />
                <Stack.Screen name="BeerReview" component={BeerReview} />
                <Stack.Screen name="ReviewBeer" component={ReviewBeer} />
                
              </Stack.Group>
            ) : (
              // Pantallas de autenticación sin `FixedBottomNav`
              <Stack.Group>
                <Stack.Screen name="LogIn" component={LogIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
              </Stack.Group>
            )}

          </Stack.Navigator>

          
          
        </View> 
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
*/

import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import LogIn from './app/auth/logindex';
import SignUp from './app/auth/regindex';
import Home from './app/home/home';
import Profile from './app/profile';
import BeerDetail from './app/beers/BeerDetail';
import BeerReview from './app/beers/BeerReview';
import ReviewBeer from './app/beers/ReviewBeer';
import ProfileDetails from './app/users/ProfileDetails';
import BarDetails from './app/bars/BarDetails';
import EventDetails from './app/events/EventDetails';

import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigationRef = useRef(); // Agrega una referencia para la navegación

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await SecureStore.getItemAsync('token');
      console.log('DESDE APP.js:token', token);
      setIsLoggedIn(!!token); // true si el token existe, false si es nulo
    };
    checkAuthentication();
  }, []);

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
    });

    // Limpieza de listeners al desmontar
    return () => {
      Notifications.removeNotificationSubscription(receivedListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <View style={styles.container}>
          <Stack.Navigator 
            initialRouteName={isLoggedIn ? "Home" : "LogIn"}  
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="BeerDetail" component={BeerDetail} />
            <Stack.Screen name="BeerReview" component={BeerReview} />
            <Stack.Screen name="ReviewBeer" component={ReviewBeer} />
            <Stack.Screen name="LogIn" component={LogIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
            <Stack.Screen name="BarDetails" component={BarDetails} />
            <Stack.Screen name="EventDetails" component={EventDetails} />
          </Stack.Navigator>
        </View> 
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
