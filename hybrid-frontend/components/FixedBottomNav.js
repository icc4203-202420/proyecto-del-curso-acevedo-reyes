/*
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigationState } from '@react-navigation/native';
import Home from '../app/home/home'; // Ruta al componente Home
import Profile from '../app/profile'; // Ruta al componente Profile

const Tab = createBottomTabNavigator();

const FixedBottomNav = () => {
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = 'location-on'; 
          } else if (route.name === "Profile") {
            iconName = 'person'; 
          }

          return <Icon name={iconName} size={size} color={color} />
        },

        tabBarActiveTintColor: 'tomato', // Color cuando el ítem está activo
        tabBarInactiveTintColor: 'gray',  // Color cuando no está activo
      })}
    >
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
};

export default FixedBottomNav;
*/

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Home from '../app/home/home';
import Profile from '../app/profile';

const Tab = createBottomTabNavigator();

const FixedBottomNav = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = 'location-on'; 
          } else if (route.name === "Profile") {
            iconName = 'person'; 
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default FixedBottomNav;