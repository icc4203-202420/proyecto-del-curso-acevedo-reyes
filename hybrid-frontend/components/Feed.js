import React, { useEffect, useState } from "react";
import { subscribeToFeed } from "./SubscribeToFeed";
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity } from "react-native";
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    friend: '',
    bar: '',
    country: '',
    beer: '',
    type: '',
  });
  const navigation = useNavigation();

  // Obtener usuario actual
  useEffect(() => {
    async function getCurrentUserId() {
      try {
        const currentUserId = await AsyncStorage.getItem('user');
        setCurrentUserId(Math.round(currentUserId));
      } catch (error) {
        console.error(error);
      }
    }

    getCurrentUserId();
  }, []);

  // Suscribirse al feed
  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = subscribeToFeed(currentUserId, (message) => {
      console.log("Received message from FeedChannel>", message);
      setFeedItems((prevItems) => [message, ...prevItems]);
      setFilteredItems((prevItems) => [message, ...prevItems]);
    });

    return unsubscribe;
  }, [currentUserId]);

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
            Cerveza: {item.beer_name}, con una calificación promedio de {Math.round(item.beer_avg_rating * 100) / 100}/5 estrellas.
          </Text>
          
          <Text style={styles.detail}>
            Calificación de tu amigo: {item.review_rating}/5 estrellas.
          </Text>

          <Text style={styles.detail}>
            Servida en: {item.bar_name}, ubicado en {item.bar_line1}, {item.bar_line2}, {item.bar_city}, {item.bar_country}.
          </Text>
          
          <Button
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
            Etiquetados: {item.picture_description || '(Lucas ponlo acá! - Handles faltantes)'}.
          </Text>
          
          <Text style={styles.detail}>
            Evento: {item.event_name} en {item.bar_name}, {item.bar_country}.
          </Text>
          
          <Button
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
        <Button
          title       = "Filtrar Publicaciones"
          onPress     = {() => setFilterModalVisible(true)}
          buttonStyle = {styles.filterButton}
        />
        <Button
          title       = "X"
          onPress     = {clearFilters}
          buttonStyle = {styles.clearButton}
        />
      </View>

      {/* Lista de publicaciones */}
      <FlatList
        data                  = {filteredItems}
        keyExtractor          = {(item) => `${item.review_id || item.event_picture_id}`}
        renderItem            = {renderFeedItem}
        contentContainerStyle = {styles.list}
      />

      {/* Modal para filtros */}
      <Modal
        visible       = {filterModalVisible}
        animationType = "slide"
        transparent   = {true}
      >
        <View style={styles.modalContainer}>
          
          <Text style={styles.modalTitle}>
            Filtrar Feed
          </Text>
          
          <Input
            placeholder  = "Amigo"
            value        = {filterCriteria.friend}
            onChangeText = {(text) => setFilterCriteria({ ...filterCriteria, friend: text })}
          />
          <Input
            placeholder  = "Bar"
            value        = {filterCriteria.bar}
            onChangeText = {(text) => setFilterCriteria({ ...filterCriteria, bar: text })}
          />
          
          <Input
            placeholder  = "País"
            value={filterCriteria.country}
            onChangeText={(text) => setFilterCriteria({ ...filterCriteria, country: text })}
          />
          
          <Input
            placeholder="Cerveza"
            value={filterCriteria.beer}
            onChangeText={(text) => setFilterCriteria({ ...filterCriteria, beer: text })}
          />
          
          <Text style={styles.modalLabel}>Tipo de publicación</Text>
          
          <Picker
            selectedValue={filterCriteria.type}
            onValueChange={(value) => setFilterCriteria({ ...filterCriteria, type: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un tipo" value="" />
            <Picker.Item label="Evento" value="event" />
            <Picker.Item label="Cerveza" value="beer" />
          </Picker>

          <View style={styles.modalButtons}>
            <Button
              title="Aplicar Filtros"
              onPress={applyFilter}
            />
            <Button
              title="Cancelar"
              onPress={() => setFilterModalVisible(false)}
              buttonStyle={styles.cancelButton}
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
  clearButton: {
    backgroundColor: '#ff4d4d',
    width: '25%',
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
  cancelButton: {
    backgroundColor: '#ff4d4d',
  },
});

export default Feed;
