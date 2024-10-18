import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Stack } from 'expo-router'; 
import FixedBottomNav from '../components/FixedBottomNav'; 

function Layout() {

  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", FixedBottomNav)

  return (
    <SafeAreaView style={styles.container}>
      <Stack />

      <Text> ola soy _layout de app</Text>

      <FixedBottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default Layout;


