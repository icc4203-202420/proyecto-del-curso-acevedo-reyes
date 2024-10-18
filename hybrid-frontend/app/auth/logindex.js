import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Avatar } from 'react-native-paper'; // Asegúrate de instalar react-native-paper
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación

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
  const navigation = useNavigation(); // Obtén el objeto de navegación
  const handleBack = () => {
    // Maneja la redirección aquí
    navigation.navigate('SignUp')
  };

  const handleSubmit = (values) => {
    console.log('PRESIONASTE LOGIN Q LISTO Q SOS:', values);
    // Aquí se manejaría el envío de datos al backend
    navigation.navigate('Home')
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
              <Button title="¿No te has registrado? ¡Registrate aquí!" onPress={handleBack} color="orange" />
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
