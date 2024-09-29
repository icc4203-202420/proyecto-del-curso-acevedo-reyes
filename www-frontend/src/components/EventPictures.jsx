import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Divider, Box, Grid, TextField, Menu, MenuItem, IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import FolderIcon from '@mui/icons-material/Folder';  // Para el ícono del botón de "Subir foto"
import axios from 'axios';
import useAxios from 'axios-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
//import camera from '../hooks/camera';
import CameraCapture from './CameraCapture';

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

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  useEffect(() => {
    axios.get(`/api/v1/events/${eventId}/event_pictures`)
      .then(response => {
        console.log('RESPUESTA EVENTOS...:',response);
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

      let base64Image;

      // Si el valor de la imagen es un archivo (por ejemplo, de un input type="file")
      if (values.image instanceof File) {
        base64Image = await convertToBase64(values.image);
      } else {
        // Si ya es una cadena base64 (imagen tomada de la cámara)
        base64Image = values.image; 
      }
      //const base64Image = await convertToBase64(values.image);

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

  

  if (loading || getloading) return <Typography>Loading...</Typography>;
  if (error || getError) return <Typography>Error al fetchear imágenes del evento!</Typography>;

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

    <Typography variant="h5" align="center" sx={{ mt: 2 }}>
      Galería de Imágenes del evento {event.name}
    </Typography>

    {/* galeria */}
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'scroll',
        height: '30vh',
        mt: 2,
        mb: 2,
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        p: 2,
        bgcolor: 'white',
      }}
    >
      {eventPictures.length > 0 ? (
        eventPictures.map((picture, index) => (
          <Box key={picture.id} sx={{ mb: 2, textAlign: 'center', width: '100%' }}>
            <Box
              component="img"
              sx={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'cover',
                borderRadius: 2,
              }}
              alt={picture.description || 'Imagen del evento'}
              src={picture.image_url}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {picture.description}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography>No hay fotos disponibles. Sé el primero!</Typography>
      )}
    </Box>
  
    <Divider />

    {/* formulario*/}
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting, errors, touched }) => (
        <Form>

          <Grid container spacing={1} sx={{ mt: 2 }}>

            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                Sube una foto del evento!
              </Typography>
            </Grid>

            <Grid item xs={1}>
            </Grid>

            {/* descripción */}
            <Grid item xs={6}>
              <Field
              name="description"
              as={TextField}
              label="Descripción"
              fullWidth
              margin="normal"
              error={touched.description && !!errors.description}
              helperText={touched.description && errors.description}
            />
            </Grid>

            <Grid item xs={4}>
              {/* Botón para subir foto */}
              <Button
                aria-controls = {open ? 'photo-menu' : undefined}
                aria-haspopup = "true"
                aria-expanded = {open ? 'true' : undefined}
                onClick       = {handleMenuClick}
                startIcon     = {<FolderIcon />}
                variant       = "contained"
                sx            = {{ mt: 2 }}
              >
                Subir Foto
              </Button>
            </Grid>

            <Grid item xs={1}>
            </Grid>

            <Grid item xs={5}>
            </Grid>

            <Grid item xs={1}> 
              <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{}}
              >
                {isSubmitting ? 'Subiendo...' : 'Enviar'}
              </Button>
            </Grid>

          </Grid>

          {/* desplegable para elegir entre subir o tomar foto */}
          <Menu
            id       = "photo-menu"
            anchorEl = {anchorEl}
            open     = {open}
            onClose  = {handleMenuClose}
          >
            <MenuItem 
              onClick = {() => {
                document.getElementById('file').click();
                handleMenuClose();
              }}
            >
              Elegir Foto
            </MenuItem>

            <MenuItem onClick={() => setCapturedImage(null)}>
              <CameraCapture onCapture={(imageBase64) => {
                setFieldValue("image", imageBase64);
                handleMenuClose();
              }} />
            </MenuItem>

          </Menu>

          <input
            id="file"
            name="image"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(event) => {
              setFieldValue("image", event.currentTarget.files[0]);
            }}
          />
          {touched.image && errors.image && <div style={{ color: 'red' }}>{errors.image}</div>}
  
        </Form>
      )}
    </Formik>

    <Toolbar />
    <Toolbar />


  </>
  );
}

export default EventPictures;
