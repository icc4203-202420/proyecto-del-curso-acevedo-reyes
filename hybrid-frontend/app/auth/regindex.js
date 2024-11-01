/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffe5b4',
  },
  avatar: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});
*/

import React from 'react';
import { FlatList, View, ScrollView, KeyboardAvoidingView, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import useAxios from 'axios-hooks';
import { useNavigation } from '@react-navigation/native';

const fields = [
  { name: 'email', placeholder: 'Email' },
  { name: 'first_name', placeholder: 'Nombre' },
  { name: 'last_name', placeholder: 'Apellido' },
  { name: 'handle', placeholder: 'Nombre de usuario' },
  { name: 'password', placeholder: 'Contraseña', secureTextEntry: true },
  { name: 'line1', placeholder: 'Calle' },
  { name: 'line2', placeholder: 'Dpto, Piso, etc.' },
  { name: 'city', placeholder: 'Ciudad' },
  { name: 'country', placeholder: 'País' },
];

const NGROK_URL = process.env.NGROK_URL;

// Esquema de validación
const validationSchema = Yup.object({
  email: Yup.string().email('Email inválido').required('El email es requerido'),
  first_name: Yup.string().required('Tu nombre es requerido'),
  last_name: Yup.string().required('Tu apellido es requerido'),
  handle: Yup.string().required('Tu handle es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
  line1: Yup.string(),
  line2: Yup.string(),
  city: Yup.string(),
  country: Yup.string(),
});

// Valores iniciales
const initialValues = {
  email: '',
  first_name: '',
  last_name: '',
  handle: '',
  password: '',
  line1: '',
  line2: '',
  city: '',
  country: '',
};

export default function SignUp() {
  
  const navigation = useNavigation();
  const [serverError, setServerError] = React.useState('');
  const [signupSuccess, setSignupSuccess] = React.useState(false);
  
  const handleBack = () => {
    navigation.navigate('LogIn');
  };

  console.log("URL NGROK>", NGROK_URL)

  // POST con axios-hooks
  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: `${NGROK_URL}/api/v1/signup`,
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

      console.log('PRESIONASTE REGISTRAR:', values);

      const response = await executePost({
        data: {
          user: {
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            handle: values.handle,
            password: values.password,
          },
          address: {
            line1: values.line1,
            line2: values.line2,
            city: values.city,
            country: values.country,
        }
      }});
      console.log(response);
      
      setTimeout(() => {
        navigation.navigate('LogIn');
      }, 1000);

    }
    catch (error) {

      if (error.response && error.response.status === 401) {
        setServerError('Credenciales incorrectas');
      }
      else {
        setServerError('Error en el servidor xdlol..');
      }
      console.error("Error durante la funcion SignUp:", error)
    }
    finally {
      setSubmitting(false);
    }
  };
  
  const renderField = ({ item }, handleChange, handleBlur, values, errors, touched) => (
    <View>
      <TextInput
        style={styles.input}
        placeholder={item.placeholder}
        onChangeText={handleChange(item.name)}
        onBlur={handleBlur(item.name)}
        value={values[item.name]}
        secureTextEntry={item.secureTextEntry || false}
      />
      {touched[item.name] && errors[item.name] && (
        <Text style={styles.errorText}>{errors[item.name]}</Text>
      )}
    </View>
  );

  return (
  <View style={styles.container}>
    
    <View style={styles.cont2}>
      <Avatar.Icon size={120} icon="lock" style={styles.avatar} />
      <Text style={styles.title}> ¡Registrate!</Text>
    </View>


    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <FlatList
            data={fields}
            keyExtractor={(item) => item.name}
            renderItem={(item) => renderField(item, handleChange, handleBlur, values, errors, touched)}
          />
          <View style={styles.buttonContainer}>
              <Button 
                title="¿Ya estas registrado? ¡Inicia sesión!" 
                onPress={handleBack} 
                color="orange" 
              />
              
              <Button 
                title="Registrar" 
                onPress={handleSubmit} 
              />
            </View>
        </View>
      )}
    </Formik>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffe5b4',
    justifyContent: 'center',
    //alignItems: 'center',
    
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  avatar: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  cont2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe5b4',
  },
});

