import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Button, Image, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CameraCapture from '../../components/CameraCapture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const NGROK_URL = process.env.NGROK_URL;

const validationSchema = Yup.object({
  description: Yup.string().max(255, 'La descripción es muy larga'),
  image: Yup.mixed().required('Se requiere una imagen'),
});

function EventPictures() {
  const [event, setEvent] = useState({});
  const [eventPictures, setEventPictures] = useState([]);
  const route = useRoute();
  const { eventId } = route.params;
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (text, setFieldValue) => {
    setFieldValue('description', text);

    const searchTerm = text.split(" ").pop().toLowerCase(); // último término
    if (searchTerm.startsWith('@')) {
      const filteredUsers = users.filter(user =>
        user.handle.toLowerCase().includes(searchTerm.substring(1))
      );
      setSuggestions(filteredUsers);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (handle, values, setFieldValue) => {
    const words = values.description.split(" ");
    words.pop(); // quita la última palabra para añadir el handle
    words.push(`@${handle}`);
    setFieldValue('description', words.join(" ") + " ");
    setSuggestions([]);
  };

  // se obtiene el usuario actual desde AsyncStorage
  async function getCurrentUser() {
    try {
      const currentUser = await AsyncStorage.getItem('user');
      console.log("Obtained Current User>", Math.round(currentUser));
      setCurrentUser(Math.round(currentUser));
      setUserLoading(false);
      //return Math.round(currentUser);
    }
    catch (error) {
      console.error(error);
    }

    try {
      const token = await SecureStore.getItemAsync('token');
      console.log("Obtained Token>", token);
      setAuthToken(token);
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // fetchea el usuario y su authToken
    getCurrentUser();
  }, []);

  // obtener todos los usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/users`);
        setUsers(response.data.users);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
  }, []);

  // obtener imágenes del evento
  useEffect(() => {
    const fetchEventPictures = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/events/${eventId}/event_pictures`); 
        setEvent(response.data.event);
        setEventPictures(response.data.event_pictures);
      } catch (error) {
        Alert.alert("Error", "Error al cargar imágenes del evento");
      }
    };
    fetchEventPictures();
  }, [eventId]);

  const handleImagePick = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled) {//puede q sea cancelled
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFieldValue('image', base64Image);
    }
  };

  //const handleCameraCapture = (imageUri, setFieldValue) => {
    //setFieldValue('image', imageUri);
  const handleCameraCapture = async (setFieldValue) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
  
    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFieldValue('image', base64Image);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log("description:", values.description);
      const response = await axios.post(`${NGROK_URL}/api/v1/event_pictures`, {
        event_picture: {
          event_id: eventId,
          user_id: currentUser,
          description: values.description,
          image_base64: values.image,
        },
      }, { 
        headers: 
        { 
          'Authorization': authToken, // es como el unico q pide auth xd
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        } 
      });

      resetForm();
      Alert.alert("Éxito", "Imagen subida correctamente");
    } catch (error) {
      Alert.alert("Error", "Error al subir la imagen");
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 10 }}>
        Galería de Imágenes del evento {event.name}
      </Text>

      <Formik
        initialValues    = {{ description: '', image: '' }}
        validationSchema = {validationSchema}
        onSubmit         = {handleSubmit}
      >
        {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={{ padding: 15 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              ¡Sube una foto del evento!
              </Text>

            {/*
            <TextInput
              placeholder="Descripción"
              value={values.description}
              onChangeText={handleChange('description')}
              style={{ borderWidth: 1, borderColor: 'gray', padding: 10, borderRadius: 5, marginBottom: 10 }}
            />
            {touched.description && errors.description && (
              <Text style={{ color: 'red' }}>{errors.description}</Text>
            )}
            */}

            {/* TextInput con autocompletado */}
            <TextInput
              placeholder  = "Descripción"
              value        = {values.description}
              onChangeText = {(text) => handleInputChange(text, setFieldValue)}
              style        = {{ borderWidth: 1, borderColor: 'gray', padding: 10, borderRadius: 5, marginBottom: 10 }}
            />
            {touched.description && errors.description && (
              <Text style={{ color: 'red' }}>
                {errors.description}
              </Text>
            )}

            {/* lista de sugerencias de usuarios*/}
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.handle}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectSuggestion(item.handle, values, setFieldValue)}>
                    <Text style={{ padding: 10, backgroundColor: '#e0e0e0' }}>@{item.handle}</Text>
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 100, borderWidth: 1, borderColor: 'gray', borderRadius: 5, marginBottom: 10 }}
              />
            )}

            {/* manejo de fotos */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Elegir Foto" onPress={() => handleImagePick(setFieldValue)} />
              <Button title="Tomar Foto" onPress={() => handleCameraCapture(setFieldValue)} />
            </View>
            
            {values.image && (
              <Image source={{ uri: values.image }} style={{ width: '100%', height: 200, marginVertical: 10 }} />
            )}

            <Button title="Enviar" onPress={handleSubmit} />
          </View>
        )}
      </Formik>

      <FlatList
        data          = {eventPictures}
        keyExtractor  = {(item) => item.id.toString()}
        renderItem    = {({ item }) => (
          <View style = {{ marginBottom: 10, alignItems: 'center' }}>
            
            <Image 
              source = {{ uri: item.image_url }} 
              style  = {{ width: '100%', height: 200 }} 
            />
            
            <Text style={{ marginTop: 5 }}>
              {item.description}
            </Text>
          
          </View>
        )}
        ListEmptyComponent    = {<Text>No hay fotos disponibles. ¡Sé el primero!</Text>}
        contentContainerStyle = {{ paddingHorizontal: 15 }}
        initialNumToRender    = {3}
        onEndReachedThreshold = {0.5}
        onEndReached = {() => {
          // Fetch more data when the end of the list is reached
        }}
      />
    </View>
  );
}

export default EventPictures;
