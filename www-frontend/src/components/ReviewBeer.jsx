import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Rating, Button, AppBar, Toolbar } from '@mui/material';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import useAxios from 'axios-hooks';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

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
  rating: 1,
};

function ReviewBeer() {
  const { beerId } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  
  // hook para mandar la review
  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: '/api/v1/reviews',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { manual: true }
  );

  const user = Math.round(localStorage.getItem('user'));

  const handleSubmit = async (values, {setSubmitting}) => {
    try {
      
      if ( user === null) {
        setServerError('Debes estar logueado para hacer una review');
        console.log('No hay usuario logueado');
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

      console.log(response);
    }
    catch (error) {
      //if (error.response) {
        setServerError('Hubo un error al enviar la reseña')
      //}

      console.error(error);
    }
    finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>Failed to load review-beer.</Typography>;
  if (!user) return (
    <>
    <AppBar position="static" sx={{ bgcolor: 'lightgray' }}>
      <Toolbar>
        <Button onClick={() => navigate(`/beers/${beerId}`)} sx={{ color: 'black' }}>
        <NavigateBeforeIcon />
          Volver
        </Button>
      </Toolbar>
    </AppBar>

    <Typography color="error" sx={{ textAlign: 'center' }}>
      Debes estar logueado para hacer una reseña.
    </Typography>
    </>
  );

  return (
  <>
    <AppBar position="static" sx={{ bgcolor: 'lightgray' }}>
      <Toolbar>
        <Button onClick={() => navigate(`/beers/${beerId}`)} sx={{ color: 'black' }}>
        <NavigateBeforeIcon />
          Volver
        </Button>
      </Toolbar>
    </AppBar>
    
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
      noValidate
      autoComplete="off"
    >

      <Formik
        initialValues    = {initialValues}
        validationSchema = {validationSchema}
        onSubmit         = {handleSubmit}
      >

      {({ isSubmitting, errors, touched, setFieldValue }) => (
        <Form>

          <Field
            as         = {TextField}
            id         = "text"
            label      = "Escribe tu reseña"
            variant    = "outlined"
            name       = "text"
            fullWidth
            multiline
            rows       = {6}
            error      = {touched.text && Boolean(errors.text)}
            helperText = {touched.text && errors.text}
            margin     = "normal"
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Califica la cerveza:
            </Typography>
            <Field
              as       = {Rating}
              name     = "rating"
              precision= {0.1}
              defaultValue = {1}
              size     = "large"
              onChange = {(event, value) => setFieldValue('rating', value)}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px', mt: 2 }}>
            
            <Button
              variant  = "contained"
              sx       = {{ backgroundColor: 'gray', color: 'white', mb: 2 }}
              type     = "submit"
              fullWidth
              disabled = {isSubmitting || loading}
            >
              {loading ? 'Enviando...' : 'Enviar Reseña'}
            </Button>

          </Box>

          {serverError && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {serverError}
            </Typography>
          )}

        </Form>
      )} {/* Cierre de isSubmitting, loading y error */ }
  
      </Formik>
    </Box>
  </>
  );
}

export default ReviewBeer;
