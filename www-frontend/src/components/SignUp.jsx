import { Typography, Avatar, Button } from "@mui/material";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useNavigate } from 'react-router-dom'; // Para la redirección
import axios from 'axios';
import  useAxios  from 'axios-hooks';
import { Formik, Form, Field } from 'formik'; // Para el manejo de formularios
import * as Yup from 'yup'; // Para la validación de formularios
import Toolbar from '@mui/material/Toolbar';

// Configuración de axios con axios-hooks
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const validationSchema = Yup.object({
  email: Yup.string().email('Email invalido').required('El email es requerido'),
  first_name: Yup.string().required('Tu nombre es requerido'),
  last_name: Yup.string().required('Tu apellido es requerido'),
  handle: Yup.string().required('Tu handle es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
  //password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir'),
  //line1, line2, city, country no son requeridos
  line1: Yup.string(),
  line2: Yup.string(),
  city: Yup.string(),
  country: Yup.string(),
});

const initialValues = {
  email: '',
  first_name: '',
  last_name: '',
  handle: '',
  password: '',
  password_confirmation: '',
  line1: '',
  line2: '',
  city: '',
  country: '',
};

function SignUp() {
  
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState('');
  const [signupSuccess, setSignupSuccess] = React.useState(false);

  const handleBack = () => {
    navigate('/user'); // Redirige a "/user" al hacer clic en "Volver"
  };

  // POST con axios-hooks
  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: '/api/v1/signup',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { manual: true }
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await executePost({
        data: {
          user: {
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            handle: values.handle,
            password: values.password,
            //password_confirmation: values.password_confirmation,  
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
        navigate('/log-in');
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

  return (
    <Box
      className="user-info-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
      noValidate
      autoComplete="off"
    >
      <Avatar sx={{ mr: 1, fontSize: '120px' }}>
        <PersonOutlinedIcon />
      </Avatar>

      <Typography variant="h5" align="center" paragraph>
        ¡Regístrate!
      </Typography>

      <Formik
        initialValues    = {initialValues}
        validationSchema = {validationSchema}
        onSubmit         = {handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>

            <Field
              as         = {TextField}
              id         = "email"
              label      = "Correo Electrónico"
              variant    = "outlined"
              name       = "email"
              fullWidth
              error      = {touched.email && Boolean(errors.email)}
              helperText = {touched.email && errors.email}
              margin     = "normal"
            />

            <Field
              as         = {TextField}
              id         = "first_name"
              label      = "Nombre"
              variant    = "outlined"
              name       = "first_name"
              fullWidth
              error      = {touched.first_name && Boolean(errors.first_name)}
              helperText = {touched.first_name && errors.first_name}
              margin     = "normal"
            />
            
            <Field
              as         = {TextField}
              id         = "last_name"
              label      = "Apellido"
              variant    = "outlined"
              name       = "last_name"
              fullWidth
              error      = {touched.last_name && Boolean(errors.last_name)}
              helperText = {touched.last_name && errors.last_name}
              margin     = "normal"
            />
                  
            <Field
              as         = {TextField}
              id         = "handle"
              label      = "Nombre de Usuario"
              variant    = "outlined"
              name       = "handle"
              fullWidth
              error      = {touched.handle && Boolean(errors.handle)}
              helperText = {touched.handle && errors.handle}
              margin     = "normal"
            />
            
            <Field
              as         = {TextField}
              id         = "password"
              label      = "Contraseña"
              type       = "password"
              variant    = "outlined"
              name       = "password"
              fullWidth
              error      = {touched.password && Boolean(errors.password)}
              helperText = {touched.password && errors.password}
              margin     = "normal"
            />
            {/* PARA IMPLEMENTAR MÁS ADELANTE.....
            <Field
              as         = {TextField}
              id         = "password_confirmation"
              label      = "Confirmar Contraseña"
              type       = "password"
              variant    = "outlined"
              name       = "password_confirmation"
              fullWidth
              error      = {touched.password_confirmation && Boolean(errors.password_confirmation)}
              helperText = {touched.password_confirmation && errors.password_confirmation}
              margin     = "normal"
            />
            */}
               
            <Field
              as={TextField}
              id="line1"
              label="Calle"
              variant="outlined"
              name="line1"
              fullWidth
              error   = {touched.line1 && Boolean(errors.line1)}
              helperText = {touched.line1 && errors.line1}
              margin  = "normal"
            />

            <Field
              as={TextField}
              id="line2"
              label="Dpt, Piso, etc. "
              variant="outlined"
              name="line2"
              fullWidth
              error={touched.line2 && Boolean(errors.line2)}
              helperText={touched.line2 && errors.line2}
              margin="normal"
            />
            
            <Field
              as={TextField}
              id="city"
              label="Ciudad"
              variant="outlined"
              name="city"
              fullWidth
              error   = {touched.city && Boolean(errors.city)}
              helperText = {touched.city && errors.city}
              margin  = "normal"
            />
            
            <Field
              as={TextField}
              id="country"
              label="País"
              variant="outlined"
              name="country"
              fullWidth
              error   = {touched.country && Boolean(errors.country)}
              helperText = {touched.country && errors.country}
              margin  = "normal"
            />
            
            
            <Box display="flex" justifyContent="center" width="100%">
              <Button
                variant="outlined"
                sx={{ mr: 2, color: 'orange', borderColor: 'orange' }}
                onClick={handleBack} // Botón para regresar a "/user"
              >
                Volver
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={isSubmitting || loading}
              >
                {loading ? 'Enviando...' : 'Registrarse'}
              </Button>
            </Box>

            {serverError && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {serverError}
              </Typography>
            )}
            
          </Form>
        )}  
      </Formik>

      <Toolbar />
    
    </Box>
  );
}

export default SignUp;
