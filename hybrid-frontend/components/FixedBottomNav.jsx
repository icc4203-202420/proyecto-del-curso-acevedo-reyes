/*
import React, { useState } from 'react';
import { View } from 'react-native';
import { BottomNavigation, BottomNavigationAction } from '@rneui/themed';
import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';

const FixedBottomNav = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        value={activeIndex}
        onChange={(newIndex) => setActiveIndex(newIndex)}
        style={{ backgroundColor: '#fff' }}
      >
        <BottomNavigationAction
          label="Profile"
          icon={<Icon name="person-outline" />}
          onPress={() => router.push('/user')}
        />
        <BottomNavigationAction
          label="Location"
          icon={<Icon name="location-on" />}
          onPress={() => router.push('/')}
        />
        <BottomNavigationAction
          label="Bookmarks"
          icon={<Icon name="bookmark-border" />}
          onPress={() => router.push('/')}
        />
      </BottomNavigation>
    </View>
  );
};

export default FixedBottomNav;

*/

// BottomNavigation no existe en rneui/themed asi q saque algo
// parecido de react-navegation/native

// hay otra tambien de react-navegation-paper creo?? quizas eso
// funcione mejor, pero el problea principal con esto es q

//1.- Tab.Screen no tiene componente onPress, asi q no podriamos hacer
//    que se rediriga a algunaa vista; solo se puede invocar componente

//2.- incluso aunq invoque componente, no me funco !!!! kms

import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserInfo from "../app/user/index"

const Tab = createBottomTabNavigator();

export default function FixedBottomNav() {
  
  console.log("USERINFO>", UserInfo)
  
  return (
    
      <Tab.Navigator>
        <Tab.Screen 
          name="User"
          component={UserInfo}
          lazy={false} // Desactiva lazy loading
        />
        
        <Tab.Screen 
          name="Location"
          component={UserInfo} //por mientras
          lazy={false}
        />
      
      </Tab.Navigator>
    
  );
}