import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Avatar } from 'react-native-paper'; // Asegúrate de instalar react-native-paper
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import axios from 'axios';
import useAxios from 'axios-hooks';

const NGROK_URL = process.env.NGROK_URL;

// Esquema de validación
const validationSchema = Yup.object({
  email: Yup.string().email('Email inválido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
});

// Valores iniciales
const initialValues = {
  email: '',
  password: '',
};

function LogIn() {

  const [serverError, setServerError] = React.useState('');
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const navigation = useNavigation(); // Obtén el objeto de navegación
  
  const handleBack = () => {
    // Maneja la redirección aquí
    navigation.navigate('SignUp')
  };

  console.log("URL NGROK>", NGROK_URL)

  // POST con axios-hooks
  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: `${NGROK_URL}/api/v1/login`,
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

      console.log('PRESIONASTE LOGIN Q LISTO Q SOS:', values);

      const response = await executePost({ 
        data: {
          user: {
            //handle: values.handle,
            email: values.email,
            password: values.password,
          }
        }
      });
      
      console.log(response);
      //const receivedToken = response.headers['authorization'];
      //const receivedUser = response.data.status.data.user.id;

      //if (receivedUser) {
      //  localStorage.setItem('user', receivedUser);
      //}

      //if (receivedToken) {
      //  localStorage.setItem('token', receivedToken);
      //  console.log('token recibido!', receivedToken);
      //  setLoginSuccess(true);

      setTimeout(() => {
        navigation.navigate('Home');
      }, 1000); // Redirige a "/" después de 1 segundo
      //}
      //else {
      //  console.log('ermmm what the figma?');
      //}
    }
    catch (error) {
      if (error.response && error.response.status === 401) {
        setServerError('Credenciales incorrectas');
      } else {
        setServerError('Error en el servidor xdlol..');
      }
      console.error("Error en el envio del formulario:", error);
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon size={120} icon="lock" style={styles.avatar} />
      <Text style={styles.title}>Iniciar sesión</Text>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <View style={styles.buttonContainer}>
              <Button title="¡Registrate aquí!" onPress={handleBack} color="orange" />
              <Button title="Iniciar sesión" onPress={handleSubmit} />
            </View>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default LogIn;
