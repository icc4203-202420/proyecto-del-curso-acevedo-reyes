import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BeersList from './app/beers/BeersList';
import BeerDetail from './app/beers/BeerDetail';
import BeerReview from './app/beers/BeerReview';
import ReviewBeer from './app/beers/ReviewBeer';
import LogIn from './app/auth/logindex';
import SignUp from './app/auth/regindex';
import Home from './app/home/home';
import Profile from './app/profile';

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
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;