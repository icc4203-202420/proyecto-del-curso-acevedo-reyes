import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Divider, Box, Grid } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import axios from 'axios';
import useAxios from 'axios-hooks';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
});

const initialValues = {
};

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

function EventDetails() {

  const [event, setEvent] = useState([]);
  const [friends, setFriends] = useState([]);
  const [getError, setGetError] = useState(null);
  const [getloading, setGetLoading] = useState(true);
  const { eventId } = useParams();
  

  const user = Math.round(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    axios.get(`/api/v1/events/${eventId}`)
      .then(response => {
        console.log('RESPUSETA EVENTOS...:',response);
        setEvent(response.data.event);
        setGetLoading(false);
      })
      .catch(error => {
        setGetError(error);
        console.log("ERROR>>>>:",error);
        setGetLoading(false);
      });
  }, [eventId]);

  useEffect(() => {
    axios.get(`/api/v1/users/${user}/friendships`)
      .then(response => {
        console.log('RESPUSETA AMIGOS...:',response.data.friends);
        setFriends(response.data.friends);
        setGetLoading(false);
      })
      .catch(error => {
        setGetError(error);
        console.log("ERROR>>>>:",error);
        setGetLoading(false);
      });
  }, [user]);

  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: '/api/v1/attendances',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': token
      }
    },
    { manual: true }
  );

  const handleSubmit = async (values, {setSubmitting}) => {
    try {
      const response = await executePost({
        data: {
          attendance: {
            event_id: eventId,
            user_id: user,
            checked_in: true,
          },
        },
      });

      console.log('RESPONSE>>>>:',response);  
    } 
    catch (error) {
      console.error('ERROR>>>>:',error); 
    } 
    finally {
      setSubmitting(false);
    }
  }

  console.log("Event>>>>:",event);

  if (getloading) return <Typography>Loading...</Typography>;
  if (getError || error) return <Typography>Error al fetchear evento y/o amigos!</Typography>;
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
      Debes estar logueado para confirmar la asistencia a un evento.
    </Typography>
    </>
  );

  return (
  <> 
    <AppBar position="fixed" sx={{bgcolor: "lightgray"}}>
      
      <Typography color="black" align="left">
        <Button component={RouterLink} to={`/bars/${event.bar.id}`} color="inherit">
          <NavigateBeforeIcon />
          Bar
        </Button>
      </Typography>

    </AppBar>

    <Toolbar />

    <br /><br /><br /><br /><br /><br />
    
    <Typography variant="body2" align="center">
      <VideocamOutlinedIcon fontSize='medium' />  
      Ver Galería
    </Typography>

    <Typography variant="h5" align="center">
      ¡{event.bar.name} te invita a celebrar!
    </Typography>

    <Divider sx={{my: 4, borderBottomWidth: 5}}/>

    {/* si es que al menos una instancia de attendances es del user actual, significa que ya confirmo asistencia, por lo que no se deberia mostrar el boton*/}
    {event.attendances.some(attendance => attendance.user.id === user) && (
      <Typography variant="h6" align="center" color="primary">
      Gracias por confirmar tu asistencia.
    </Typography>
    )}

    {/* boton y handleSubmit de la asistencia del usuario */}
    {!event.attendances.some(attendance => attendance.user.id === user) && (
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
          {({ isSubmitting }) => (
            <Form>
              {data ? (
                <Typography variant="h6" color="primary">
                  Gracias por confirmar tu asistencia.
                </Typography>
              ) : (
                <Button
                  type     = "submit"
                  variant  = "contained"
                  color    = "primary"
                  disabled = {isSubmitting}
                >
                  <BookmarkAddOutlinedIcon />
                  {loading ? 'Enviando solicitud...' : 'Confirmar Asistencia'}
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    )}

    <br /><br />
    {/* lista de asistentes */}
    <Grid container spacing={1} sx={{ mb: 3 }} >
      
      <Grid item xs={1}>
      <PersonOutlinedIcon fontSize='large'/>
      </Grid>

      <Grid item xs={10}>
      <Typography variant="body2" align='center'>
        {!event.attendances.length && 'Sé el primero en confirmar asistencia!'}

        {event.attendances.length && event.attendances.map((attendance, index) => (
          <React.Fragment key={attendance.id}>
            @{attendance.user.handle}
            {index < event.attendances.length - 1 && ', '}  
          </React.Fragment>
        ))}

        {event.attendances.length && (
        <>
          <br />
          han confirmado su asistencia.
        </>
        )}
        
      </Typography>
      </Grid>

      <Grid item xs={1}>
      </Grid>

    </Grid>

    {/* lista de amigos asistentes */}
    {friends.length > 0 && (
      <Grid container spacing={1} sx={{ mb: 3 }} >
        <Grid item xs={1}>
          <EmojiPeopleIcon fontSize='large'/>
        </Grid>

        <Grid item xs={10}>
          <Typography variant="body2" align='center'>
            {event.attendances.some(attendance => friends.some(friend => friend.id === attendance.user.id)) ? (
              event.attendances.map((attendance, index) => (
                friends.some(friend => friend.id === attendance.user.id) && (
                  <React.Fragment >
                    @{attendance.user.handle}
                    {index < event.attendances.length - 1 && ', '}
                  </React.Fragment>
                )
              ))
            ) : (
              'Ninguno de tus amigos ha confirmado asistencia.'
            )}
          </Typography>
        </Grid>

        <Grid item xs={1}>
        </Grid>
      </Grid>
    )}

    { !friends.length && (
      <Grid container spacing={1} sx={{ mb: 3 }} >
        <Grid item xs={1}>
          <EmojiPeopleIcon fontSize='large'/>
        </Grid>

        <Grid item xs={10}>
          <Typography variant="body2" align='center'>
            Aún no tienes amigos.
          </Typography>
        </Grid>

        <Grid item xs={1}>
        </Grid>
      </Grid>
      
    )}

    <Typography fontWeight='bold' variant="h6" align="center">
      {event.description}
    </Typography><br />

    {/* detalles del evento */}
    <Grid container spacing={1} sx={{ mb: 3 }} >
      
      <Grid item xs={1}>
      </Grid>

      <Grid item xs={1}>
        <TodayTwoToneIcon />
      </Grid>

      <Grid item xs={3}>
        <Typography fontWeight="bold" variant="body2">
          Fecha del evento
        </Typography>
      </Grid>

      <Grid item xs={3}>
      </Grid>

      <Grid item xs={2}>
        <Typography fontWeight="bold" variant="body2" align="right">
          Duración
        </Typography>
      </Grid>

      <Grid item xs={1}>
        <ScheduleOutlinedIcon />
      </Grid>

      <Grid item xs={2}>
      </Grid>

      <Grid item xs={3}>
        <Typography variant="body2" align="center">
          {formatDate(event.date)}
        </Typography>
      </Grid>

      <Grid item xs={2}>
      </Grid>

      <Grid item xs={4}>
        <Typography variant="body2" align="right">
          desde {event.start_date ? event.start_date : 'hora indefinida'} <br />
          hasta {event.end_date ? event.end_date : 'hora indefinida'} 
        </Typography>
      </Grid>

    </Grid>

    <Toolbar />
  </>
  );
}

export default EventDetails;