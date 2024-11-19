import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Rating, Button } from 'react-native-elements';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import useAxios from 'axios-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object({
  text: Yup.string()
    .required('La reseña es requerida')
    .test('wordCount', 'La reseña debe contener al menos 15 palabras.', (value) => {
      if (value) {
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount >= 15;
      }
      return false;
    }),
  rating: Yup.number().min(1, 'La calificación debe ser al menos 1').max(5, 'La calificación no puede ser mayor a 5').required('La calificación es requerida'),
});

const initialValues = {
  text: '',
  rating: 1.1,
};

const NGROK_URL = process.env.NGROK_URL;

const ReviewBeer = ({ route }) => {
  const { beerId } = route.params;
  const [user, setUser] = useState(null);
  const [serverError, setServerError] = useState("");
  
  const navigation = useNavigation();

  //fetchear el usuario (todavia no guardamos el token si jejejej)
  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('user');
        setUser(Math.round(currentUser));
      }
      catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, []);

  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: `${NGROK_URL}/api/v1/reviews`,
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
    },
    { manual: true }
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (user === null) {
        setServerError('Debes estar logueado para hacer una review');
        return;
      }

      const response = await executePost({
        data: {
          review: {
            text: values.text,
            rating: values.rating,
            beer_id: Math.round(beerId),
          },
          user: {
            id: user,
          }
        }
      });

      //console.log("RESPUESTA>", response);
      Alert.alert("Éxito", "Reseña enviada correctamente");
    
      navigation.goBack();
        
    } catch (error) {
      setServerError('Hubo un error al enviar la reseña');
      Alert.alert("Error", "Hubo un error al enviar la reseña");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error al cargar el formulario de la reseña</Text>;

  return (
    <View style={styles.container}>
      <Text>Haz una reseña de la cerveza!!!</Text>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, errors, touched, setFieldValue }) => (
          <>
            <TextInput
              style         = {styles.textInput}
              onChangeText  = {handleChange('text')}
              onBlur        = {handleBlur('text')}
              value         = {values.text}
              placeholder   = "Escribe tu reseña"
              multiline
              numberOfLines = {6}
            />
            {touched.text && errors.text && <Text style={styles.errorText}>{errors.text}</Text>}
            
            <Text>Califica la cerveza:</Text>
            <Rating
              name           = "rating"
              //defaultValue   = {1.1}
              //value          = {values.rating}
              size           = {30}
              tintColor      = "#f2f2f2"
              showRating
              fractions      = {1}
              startingValue  = {1.1}
              onFinishRating = {(value) => setFieldValue('rating', value)}
              style          = {{ paddingVertical: 10 }}
            />

            <Button
              title    = {loading ? ' Enviando...' : ' Enviar Reseña'}
              onPress  = {handleSubmit}
              disabled = {isSubmitting || loading}
              icon     = {
                <Icon 
                  name="send" 
                  type="feather" 
                  size={20} 
                  color="white"
                />
              }

            />

            {serverError && <Text style={styles.errorText}>{serverError}</Text>}
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  },
});

export default ReviewBeer;
