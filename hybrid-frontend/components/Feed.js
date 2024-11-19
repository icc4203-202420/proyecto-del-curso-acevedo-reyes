import React, { useContext, useEffect, useState } from "react";
//import { subscribeToFeed } from "./SubscribeToFeed";
import { View, Text, Image, StyleSheet, FlatList, Modal, TouchableOpacity } from "react-native";
import { Button, Input, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
//import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FeedContext } from "../contexts/FeedContext";

const Feed = () => {
  //const [feedItems, setFeedItems] = useState([]);
  const { feedItems } = useContext(FeedContext);
  const [filteredItems, setFilteredItems] = useState([]);
  //const [currentUserId, setCurrentUserId] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    friend: '',
    bar: '',
    country: '',
    beer: '',
    type: '',
  });
  const navigation = useNavigation();

  useEffect(() => {
    setFilteredItems(feedItems);
  }, [feedItems]);

  // Obtener usuario actual
  //useEffect(() => {
  //  async function getCurrentUserId() {
  //    try {
  //      const currentUserId = await AsyncStorage.getItem('user');
  //      setCurrentUserId(Math.round(currentUserId));
  //    } catch (error) {
  //      console.error(error);
  //    }
  //  }

  //  getCurrentUserId();
  //}, []);

  // Suscribirse al feed
  //useEffect(() => {
  //  if (!currentUserId) return;

  //  const unsubscribe = subscribeToFeed(currentUserId, (message) => {
  //    console.log("Received message from FeedChannel>", message);
  //    setFeedItems((prevItems) => [message, ...prevItems]);
  //   setFilteredItems((prevItems) => [message, ...prevItems]);
  //  });

  //  return unsubscribe;
  //}, [currentUserId]);

  // Aplicar filtros
  const applyFilter = () => {
    setFilterModalVisible(false);

    const { friend, bar, country, beer, type } = filterCriteria;

    const filtered = feedItems.filter((item) => {
      const matchesFriend = friend ? item.user_handle?.toLowerCase().includes(friend.toLowerCase()) : true;
      const matchesBar = bar ? item.bar_name?.toLowerCase().includes(bar.toLowerCase()) : true;
      const matchesCountry = country ? item.bar_country?.toLowerCase().includes(country.toLowerCase()) : true;
      const matchesBeer = beer ? item.beer_name?.toLowerCase().includes(beer.toLowerCase()) : true;
      const matchesType = type ? (type === "event" ? item.event_id : item.review_id) : true;

      return matchesFriend && matchesBar && matchesCountry && matchesBeer && matchesType;
    });

    setFilteredItems(filtered);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilterCriteria({ friend: '', bar: '', country: '', beer: '', type: '' });
    setFilteredItems(feedItems); // Reinicia la lista al original
  };
  
  const renderFeedItem = ({ item }) => {

    const showDate = new Date(item.review_created_at || item.picture_created_at);
    
    return (
    <View style={styles.feedItem}>
      {item.review_id ? (
        // Evaluación de cerveza
        <>
          <Text style={styles.title}>
            {item.user_handle} evaluó una cerveza
          </Text>

          <Text style={styles.time}>
            a las {format(showDate, "HH:mm", { locale: es })} del {format(showDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}.
          </Text>
          
          <Text style={styles.detail}>
            <Text style={styles.bold}>Cerveza: </Text>{item.beer_name}, con una calificación promedio de {Math.round(item.beer_avg_rating * 100) / 100}/5 estrellas.
          </Text>
          
          <Text style={styles.detail}>
          <Text style={styles.bold}>Calificación de tu amigo: </Text>{item.review_rating}/5 estrellas.
          </Text>

          <Text style={styles.detail}>
            <Text style={styles.bold}>Servida en: </Text>{item.bar_name}, ubicado en {item.bar_line1}, {item.bar_line2}, {item.bar_city}, {item.bar_country}.
          </Text>
          
          <Button style={styles.button}
            title   = "Ver Bar"
            onPress = {() => {
              navigation.navigate('BarDetails', { barId: item.bar_id });
            }}
          />
        </>
      ) : (
        // Publicación de evento
        <>
          <Text style={styles.title}>
            {item.user_handle} publicó en un evento
          </Text>

          <Text style={styles.time}>
            a las {format(showDate, "HH:mm", { locale: es })} del {format(showDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}.
          </Text>
          
          <View style={styles.imageContainer}>
            {item.picture_image_url ? (
              <Image
                source = {{ uri: item.picture_image_url }}
                style  = {styles.eventImage}
              />
            ) : (
              <Text style={styles.detail}>
                No subió foto!
              </Text>
            )}
          </View>
          
          <Text style={styles.detail}>
            <Text style={styles.bold}>Etiquetados: </Text>{item.picture_description || 'Sin etiquetados.'}
          </Text>
          
          <Text style={styles.detail}>
            <Text style={styles.bold}>Evento: </Text>{item.event_name} en {item.bar_name}, {item.bar_country}.
          </Text>
          
          <Button style={styles.button}
            title   = "Ver Evento"
            onPress = {() => {
              navigation.navigate('EventDetails', { eventId: item.event_id });
            }}
          />
        </>
      )}
    </View>
    );
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>
        Mi Feed
      </Text>
      
      {/* Botones de filtro */}
      <View style={styles.buttonRow}>
        
        <Icon 
          name    = "filter-alt" 
          type    = "material" 
          color   = "black" 
          size    = {24} 
          onPress = {() => setFilterModalVisible(true)}
        />
        
        <Icon 
          name    = "cancel" 
          type    = "material" 
          color   = "black" 
          size    = {24} 
          onPress = {clearFilters}
        />
        
      </View>

      {/* Lista de publicaciones */}
      <FlatList
        data                  = {filteredItems}
        keyExtractor          = {(item) => `${item.review_id || item.picture_id}`}
        renderItem            = {renderFeedItem}
        contentContainerStyle = {styles.list}
        initialNumToRender    = {4}
        ListFooterComponent={() => (
          <View style={{ height: 100 }} />
        )}
      />

      {/* Modal para filtros */}
      <Modal
        visible       = {filterModalVisible}
        animationType = "slide"
      >
        <View style={styles.modalContainer}>
          
          <Text style={styles.modalTitle}>
            Filtrar Feed
          </Text>
          
          <Input
            placeholder  = "Amigo"
            placeholderTextColor="white"
            value        = {filterCriteria.friend}
            onChangeText = {(text) => setFilterCriteria({ ...filterCriteria, friend: text })}
          />
          <Input
            placeholder  = "Bar"
            placeholderTextColor="white"
            value        = {filterCriteria.bar}
            onChangeText = {(text) => setFilterCriteria({ ...filterCriteria, bar: text })}
          />
          
          <Input
            placeholder  = "País"
            placeholderTextColor="white"
            value        = {filterCriteria.country}
            onChangeText = {(text) => setFilterCriteria({ ...filterCriteria, country: text })}
          />
          
          <Input
            placeholder  = "Cerveza"
            placeholderTextColor="white"
            value        = {filterCriteria.beer}
            onChangeText = {(text) => setFilterCriteria({ ...filterCriteria, beer: text })}
          />
          
          <Text style={styles.modalLabel}>
            Tipo de publicación
          </Text>
          
          <Picker
            selectedValue = {filterCriteria.type}
            onValueChange = {(value) => setFilterCriteria({ ...filterCriteria, type: value })}
            style         = {styles.picker}
          >
            <Picker.Item label="Sin filtro" value="" />
            <Picker.Item label="Evento" value="event" />
            <Picker.Item label="Cerveza" value="beer" />
          </Picker>

          <View style={styles.modalButtons}>
            <Button
              title   = "Aplicar Filtros"
              onPress = {applyFilter}
            />
            <Button
              title       = "Cancelar"
              onPress     = {() => setFilterModalVisible(false)}
              buttonStyle = {styles.cancelButton}
            />
          </View>
          
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  feedItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  time: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#007bff',
    width: '70%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  modalLabel: {
    fontSize: 16,
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  picker: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButtons: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  imageContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#FF0000',
  },
});

export default Feed;
