import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Divider, Typography, CircularProgress, Box, AppBar, Button, Toolbar, Grid, Link} from '@mui/material';
import axios from 'axios';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {Bookmark, BookmarkBorder } from '@mui/icons-material';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import LocationOn from '@mui/icons-material/LocationOn';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function BarDetails() {
  const { barId } = useParams();
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    
    axios.get(`http://127.0.0.1:3001/api/v1/bars/${barId}`)
      .then(response => {
        console.log('RESPUSETA...:',response);
        setBar(response.data.bar);
        return axios.get(`http://127.0.0.1:3001/api/v1/bars/${barId}/events`);
      })
      .then(response => {
        setEvents(response.data.events);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [barId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load bar details.</Typography>;

  return (
  <>
    <AppBar position="fixed" sx={{bgcolor: "lightgray"}}>
      
      <Typography color="black" align="left">
        <Button component={RouterLink} to="/" color="inherit">
          <NavigateBeforeIcon />
          Bares
        </Button>
      </Typography>

    </AppBar>

    <Toolbar />

    <Box>
      {bar && (
        <>
          <Typography variant="h4" align="center">
            {bar.name}
          </Typography>
          
          <Typography variant="body1" align="center">
            placeholder de la imagen del bar!
          </Typography>
          

          <br /><br /><br /><br /><br /><br />
          <br /><br /><br />

          <Typography variant="body1" align="center">
            Promedio: (placeholder rating)
          </Typography><br />
          
          <Grid container alignItems="center" justifyContent="center">
            
            <Grid item xs={1}>
            </Grid>

            <Grid item xs={1}>
              <LocationOn />
            </Grid>
            
            <Grid item xs={9}>
              <Typography variant="body1" align="center">
              {bar.address.line1}, {bar.address.line2}, 
              <br />{bar.address.city}, {bar.address.country.name}.
              </Typography>
            </Grid>

            <Grid item xs={1}>
            </Grid>  
            
          </Grid>
        </>
      )}

      <Divider sx={{my: 4, borderBottomWidth: 5}}/>

      {/* eventos */}
      <Box mt={4}>
        <Typography variant="h5"> <Bookmark fontSize="large"/> 
          Próximos Eventos
        </Typography><br />

        {events.map(event => (
        <>
          <Grid container spacing={2} key={event.id} sx={{ mb: 3 }} >
            
            <Grid item xs={1}>
            </Grid>

            <Grid item xs={1}>
              <BookmarkBorder />
            </Grid>

            <Grid item xs={2}>
            </Grid>

            <Grid item xs={8}> 
              <Typography 
                //key     = {event.id}
                fontWeight="bold" 
                variant = "body1"
                //align   = "right"
                
              >
                Evento {event.name}
              </Typography>
            </Grid>

            <Grid item xs={1}>
            </Grid>

            <Grid item xs={3}>

              <Link
                key       = {event.id}
                component = {RouterLink}
                to        = {`/events/${event.id}`}
                underline = "none"
              >

                <Typography
                  fontWeight = "bold"
                  variant    = "body2"
                >
                  <ArrowDropDownIcon /> 
                  Ver más...
                </Typography>
              </Link>
            </Grid>

            <Grid item xs={2}>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant = "body2"
                align='center'
              >
                <TodayTwoToneIcon fontSize="medium"/> 
                {formatDate(event.date)}
              </Typography>
            </Grid>

          </Grid><br />

        </>
        ))}
      </Box>
      
      <Toolbar />
      
    </Box>
  </>
  );
}

export default BarDetails;

