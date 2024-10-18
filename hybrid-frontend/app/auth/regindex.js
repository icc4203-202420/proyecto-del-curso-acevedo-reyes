import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

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

function SignIn() {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.navigate('LogIn');
  };

  const handleSubmit = (values) => {
    console.log('PRESIONASTE REGISTRAR:', values);
    // Aquí se manejaría el envío de datos al backend
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon size={120} icon="lock" style={styles.avatar} />
      <Text style={styles.title}> ¡Registrate!</Text>

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
              placeholder="Nombre"
              onChangeText={handleChange('first_name')}
              onBlur={handleBlur('first_name')}
              value={values.first_name}
            />
            {touched.first_name && errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Apellido"
              onChangeText={handleChange('last_name')}
              onBlur={handleBlur('last_name')}
              value={values.last_name}
            />
            {touched.last_name && errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Nombre de Usuario (Handle)"
              onChangeText={handleChange('handle')}
              onBlur={handleBlur('handle')}
              value={values.handle}
            />
            {touched.handle && errors.handle && <Text style={styles.errorText}>{errors.handle}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Calle"
              onChangeText={handleChange('line1')}
              onBlur={handleBlur('line1')}
              value={values.line1}
            />

            <TextInput
              style={styles.input}
              placeholder="Dpto, Piso, etc."
              onChangeText={handleChange('line2')}
              onBlur={handleBlur('line2')}
              value={values.line2}
            />

            <TextInput
              style={styles.input}
              placeholder="Ciudad"
              onChangeText={handleChange('city')}
              onBlur={handleBlur('city')}
              value={values.city}
            />

            <TextInput
              style={styles.input}
              placeholder="País"
              onChangeText={handleChange('country')}
              onBlur={handleBlur('country')}
              value={values.country}
            />

            <View style={styles.buttonContainer}>
              <Button title="¡Ya estas registrado? ¡Inicia sesión!" onPress={handleBack} color="orange" />
              <Button title="Registrar" onPress={handleSubmit} />
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

export default SignIn;
