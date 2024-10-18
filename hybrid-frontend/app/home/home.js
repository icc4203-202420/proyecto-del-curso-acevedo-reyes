import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import BeersList from '../beers/BeersList';

const Home = () => {
  const [searchKeywords, setSearchKeywords] = useState('');

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
