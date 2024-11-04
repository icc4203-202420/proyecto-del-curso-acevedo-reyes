import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper'; // Asegúrate de instalar react-native-paper
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import axios from 'axios';
import useAxios from 'axios-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { registerForPushNotificationsAsync } from '../../utils/Notifications';


async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log('SecureStore result for key', key, ':', result);
  } else {
    console.log('No values stored under key:', key);
  }
}

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
      
      //console.log(response);
      const receivedToken = response.headers['authorization'];
      const receivedUser = response.data.status.data.user.id.toString();

      if (receivedUser) {
        try {
          await AsyncStorage.setItem('user', receivedUser);
          console.log('user recibido!', receivedUser);
        }
        catch (error) {
          console.error("Error en el guardado del usuario:", error);
        }
      }

      if (receivedToken) {
        try {
          await SecureStore.setItemAsync('token', receivedToken);
          console.log('token recibido!', receivedToken);
          setLoginSuccess(true);

          // Register for push notifications
          const pushToken = await registerForPushNotificationsAsync();
          console.log('Push token!!!>', pushToken);

          // Save push token
          const response = await axios.post(`${NGROK_URL}/api/v1/push_tokens`, {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
              'Authorization': receivedToken,
            },
            user_id: parseInt(receivedUser),
            token: pushToken,
          });
          console.log('Push token saved!!!>!');
          

          setTimeout(() => {
            navigation.navigate('Home');
          }, 1000); // Redirige a "/" después de 1 segundo
        }
        catch (error) {
          console.error("Error en el guardado del token:", error);
        }
      }
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

  useEffect(() => {
    getValueFor('token');
    //getValueFor('user'); // user no esta guardado en asyncstorage asi q xd
  }, []);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error xdlol!</Text>;

  return (
    <View style={styles.container}>
      <Avatar.Icon size={120} icon="lock" style={styles.avatar} />
      <Text style={styles.title}>Iniciar sesión</Text>

      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

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
