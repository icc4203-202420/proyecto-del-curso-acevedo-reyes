import { Typography, Avatar, Button } from "@mui/material";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom'; // Para la redirección
import axios from 'axios';
import  useAxios  from 'axios-hooks';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Para el manejo de formularios
import * as Yup from 'yup'; // Para la validación de formularios
import qs from 'qs'; // Para la serialización de datos

// Configuración de axios con axios-hooks
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const validationSchema = Yup.object({
  //handle: Yup.string().required('El handle es requerido'),
  email: Yup.string().email('Email invalido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
});

const initialValues = {
  //handle: '',
  email: '',
  password: '',
};

function LogIn() {
  
  const [serverError, setServerError] = React.useState('');
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/user'); // Redirige a "/user" al hacer clic en "Volver"
  };

  // POST con axios-hooks
  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: '/api/v1/login',
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
            //handle: values.handle,
            email: values.email,
            password: values.password,
          }
        }
      });
      
      console.log(response);
      const receivedToken = response.headers['authorization'];
      //const receivedToken = response.data.status.data.token;
      //tokenHandler(receivedToken);
      const receivedUser = response.data.status.data.user.id;

      if (receivedUser) {
        localStorage.setItem('user', receivedUser);
      }

      if (receivedToken) {
        localStorage.setItem('token', receivedToken);
        console.log('token recibido!', receivedToken);
        setLoginSuccess(true);

        setTimeout(() => {
          navigate('/');
        }, 1000); // Redirige a "/" después de 1 segundo
      }
      else {
        console.log('ermmm what the figma?');
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

  return (
    <Box
      className="login-form-container"
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
        <LockOutlinedIcon />
      </Avatar>

      <Typography variant="h5" align="center" paragraph>
        Iniciar sesión
      </Typography>

      <Formik
        initialValues    = {initialValues}
        validationSchema = {validationSchema}
        onSubmit         = {handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Field
              as      = {TextField}
              //id      = "handle"
              id      = "email"
              label   = "Email"
              //label   = "Nombre de Usuario"
              variant = "outlined"
              name    = "email"
              //name    = "handle"
              fullWidth
              //error   = {touched.handle && Boolean(errors.handle)}
              //helperText = {touched.handle && errors.handle}
              error  = {touched.email && Boolean(errors.email)}
              helperText = {touched.email && errors.email}
              margin  = "normal"
            />

            <Field
              as={TextField}
              id      = "password"
              label   = "Contraseña"
              type    = "password"
              variant = "outlined"
              name    = "password"
              fullWidth
              error   = {touched.password && Boolean(errors.password)}
              helperText = {touched.password && errors.password}
              margin  = "normal"
            />
            
            <Box display="flex" justifyContent="center" width="100%">
              
              <Button
                variant = "outlined"
                sx      = {{ mr: 2, color: 'orange', borderColor: 'orange' }}
                onClick = {handleBack} // Botón para regresar a "/user"
              >
                Volver
              </Button>
              
              <Button
                variant  = "contained"
                color    = "primary"
                type     = "submit"
                fullWidth
                disabled = {isSubmitting || loading}
              >
                {loading ? 'Enviando...' : 'Iniciar sesión'}
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
    </Box>
  );
}

export default LogIn;
