import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';;
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BeersList from './app/beers/BeersList';
import BeerDetail from './app/beers/BeerDetail';
import BeerReview from './app/beers/BeerReview';
import ReviewBeer from './app/beers/ReviewBeer';
import LogIn from './app/auth/logindex';
import SignUp from './app/auth/regindex';
import Home from './app/home/home';

const Stack = createNativeStackNavigator();
const App = ({})=> {
  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BeersList" component={BeersList} />
        <Stack.Screen name="BeerDetail" component={BeerDetail} />
        <Stack.Screen name="BeerReview" component={BeerReview} />
        <Stack.Screen name="ReviewBeer" component={ReviewBeer} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#91475c',
    padding: 20,
  },
  logo: {
    width: '100%',
    height: 150,
    marginBottom: 0,
    borderRadius: 0,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  descriptionText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#000000',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#c0874f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginTop: 40,
  },
});

export default App;