import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, Text } from 'react-native';

// la vista del perfil del usuario actual

const UserInfo = () => {
  
  return (
    <SafeAreaView style={styles.container}>
      <Text> hola soy la vista user.. </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UserInfo;

