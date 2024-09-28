import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Divider, Box, Grid, TextField } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import axios from 'axios';
import useAxios from 'axios-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  description: Yup.string().max(255, 'La descripción es muy larga'),
  image: Yup.mixed().required('Se requiere una imagen'),
});

const initialValues = {
  description: '',
  image: null,
};

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Función para convertir la imagen a base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function EventPictures() {

  const [event, setEvent] = useState([]);
  const [eventPictures, setEventPictures] = useState([]);
  const [getError, setGetError] = useState(null);
  const [getloading, setGetLoading] = useState(true);
  const { eventId } = useParams();

  const user = Math.round(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`/api/v1/events/${eventId}/event_pictures`)
      .then(response => {
        console.log('RESPUSETA EVENTOS...:',response);
        setEvent(response.data.event);
        setEventPictures(response.data.event_pictures);
        setGetLoading(false);
      })
      .catch(error => {
        setGetError(error);
        console.log("ERROR>>>>:",error);
        setGetLoading(false);
      });
  }, [eventId]);

  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: '/api/v1/event_pictures',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': token
      }
    },
    { manual: true }
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {

      const base64Image = await convertToBase64(values.image);

      const response = await executePost({
        data: {
          event_picture: {
            event_id: eventId,
            user_id: user,
            description: values.description,
            image_base64: base64Image,
          },
        },
      });

      console.log('RESPONSE>>>>:',response);  
      resetForm(); //// Aquí podrías recargar las imágenes o actualizar el estado directamente con la nueva imagen.
    } 
    catch (error) {
      console.error('ERROR>>>>:',error); 
    } 
    finally {
      setSubmitting(false);
    }
  }

  if (getloading) return <Typography>Loading...</Typography>;
  if (getError) return <Typography>Error al fetchear imágenes del evento!</Typography>;

    
  return (
  <>
    <AppBar position="fixed" sx={{bgcolor: "lightgray"}}>
      <Typography color="black" align="left">
        
        <Button component={RouterLink} to={`/events/${eventId}`} color="inherit">
          <NavigateBeforeIcon />
          Evento
        </Button>

      </Typography>
    </AppBar>

    <Toolbar />

    {/* galeria */}
    <Box sx={{ flexGrow: 1, p: 2 }}>
        
      <Typography variant="h4" align="center">
        Fotos del evento
      </Typography>

      {/* Mostrar la galería de imágenes */}
      { !eventPictures && (
        <Typography variant="body1" align="center">
          No hay fotos para mostrar
        </Typography>
      )}

      { eventPictures && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {eventPictures.map((picture) => (
            <Grid item xs={12} sm={6} md={4} key={picture.id}>
              
              <Box
                component="img"
                sx={{
                  height: 300,
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
                alt={picture.description || 'Imagen del evento'}
                src={picture.image_url} // Suponiendo que el backend devuelve la URL de la imagen
              />

              <Typography variant="body2" align="center">
                {picture.description}
              </Typography>
            
            </Grid>
          ))}
        </Grid>
      )}
    </Box>

    <Divider />

    {/* Añadir el formulario para subir una imagen */}
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting, errors, touched }) => (
        <Form>
          <Field
            name="description"
            as={TextField}
            label="Descripción"
            fullWidth
            margin="normal"
            error={touched.description && !!errors.description}
            helperText={touched.description && errors.description}
          />

          <input
            id="file"
            name="image"
            type="file"
            accept="image/*"
            onChange={(event) => {
              setFieldValue("image", event.currentTarget.files[0]);
            }}
          />
          {touched.image && errors.image && <div style={{ color: 'red' }}>{errors.image}</div>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Subiendo...' : 'Subir Foto'}
          </Button>

        </Form>
      )}
    </Formik>

  </>
  );
}

export default EventPictures;