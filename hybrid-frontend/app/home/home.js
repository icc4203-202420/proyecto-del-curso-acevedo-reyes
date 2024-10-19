import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Button } from 'react-native';
import BeersList from '../beers/BeersList';
import { useNavigation } from '@react-navigation/native';
import { AsyncStorage } from '@react-native-async-storage/async-storage';


const Home = () => {
  const [searchKeywords, setSearchKeywords] = useState('');
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      console.log('User removed from AsyncStorage');
    } 
    catch (e) {
      console.error(e);
    }

    navigation.navigate('LogIn');
  };

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for beers..."
        value={searchKeywords}
        onChangeText={setSearchKeywords} // Cada vez que cambie el texto, actualiza el estado
      />

      {/* Renderiza BeersList y pasa searchKeywords para filtrar en tiempo real */}
      {searchKeywords ? (
        <BeersList searchKeywords={searchKeywords} />
      ) : (
        <Text>No beers to search for yet.</Text>
      )}
      <br /><br /><br /><br /><br /><br /><br />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default Home;
