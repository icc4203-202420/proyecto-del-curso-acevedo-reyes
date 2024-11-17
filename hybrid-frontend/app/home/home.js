import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, Button } from 'react-native';
//import BeersList from '../beers/BeersList';
import SearchTabs from '../../components/SearchTabs';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import Feed from '../../components/Feed';

// falta hacer que en logout se elimine el push token actual... horribble..

const Home = () => {
  const [searchKeywords, setSearchKeywords] = useState('');
  const navigation = useNavigation();

  const [showSearchTabs, setShowSearchTabs] = useState(false);
  const inputRef = React.createRef(null);

  const handleTextChange = (text) => {
    setSearchKeywords(text);
    if (text.length > 0) {
      setShowSearchTabs(true);
    } else {
      setShowSearchTabs(false);
    }
  };

  useEffect(() => {
    if (showSearchTabs && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearchTabs]);

  async function handleLogout() {
    try {
      //await AsyncStorage.getItem('user');
      //console.log('User retrieved from AsyncStorage');
      await AsyncStorage.removeItem('user');
      console.log('User removed from AsyncStorage');
    } 
    catch (e) {
      console.error(e);
    }
    try {
      await SecureStore.deleteItemAsync('token');
      console.log('Token removed from SecureStore');
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
        ref={inputRef}
        style={styles.searchBar}
        placeholder="Busca por nombre!"
        value={searchKeywords}
        onChangeText={handleTextChange}
      />

      {showSearchTabs ? (
        <SearchTabs searchKeywords={searchKeywords} />
      ) : (
        <>
          <Button title="Logout" onPress={handleLogout} />
          <Feed />
        </>
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
