import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed'; // Usar íconos de @rneui o cualquier otro paquete de íconos
import { useNavigationState } from '@react-navigation/native';
import Home from '../app/home/home'; // Ruta al componente Home
import Profile from '../app/profile'; // Ruta al componente Profile

const Tab = createBottomTabNavigator();

const FixedBottomNav = () => {
  
  //const currentRoute = useNavigationState(state => state.routes[state.index].name);
  //const noNavRoutes = ['LogIn', 'SignUp']; // Rutas que no deben tener la barra de navegación inferior

  //if (noNavRoutes.includes(currentRoute)) {
  //  return null; // No muestra la barra de navegación inferior en las rutas de noNavRoutes
  //}
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home'; 
          } else if (route.name === 'Profile') {
            iconName = 'person'; 
          }

          return <Icon name={iconName} type="material" size={size} color={color} />;
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
