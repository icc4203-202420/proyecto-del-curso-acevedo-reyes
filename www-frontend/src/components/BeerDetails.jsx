import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Rating, Typography, CircularProgress, Box, AppBar, Button, Toolbar, Link } from '@mui/material';
import axios from 'axios';
import { Star } from '@mui/icons-material'; // ICONOS
import CreateIcon from '@mui/icons-material/Create';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import placeHolder from '../assets/placeholder.jpg';

function BeerDetails() {

  if (localStorage.getItem('beer')) {
    localStorage.removeItem('beer');
  }


  const { beerId } = useParams();
  const [beer, setBeer] = useState(null);
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}`)
      .then(response => {
        setBeer(response.data.beer);
        //setReviews(response.data.reviews); // Obtener las reviews
        //setLoading(false);
        return axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}/bars`);
      })
      .then(response => {
        setBars(response.data.bars);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [beerId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load beer details.</Typography>;

  // Calculate number of full stars based on average rating
  const rating = beer?.avg_rating ? Math.floor(beer.avg_rating) : 0;

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "lightgray" }}>
        <Toolbar>
          <Button component={RouterLink} to="/" sx={{color: 'black'}}>
            <NavigateBeforeIcon />
            Cervezas
          </Button>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Separación */}

      <Box paddingTop="64px"> {/* To account for AppBar height */}
        {beer && (
          <>
            <Typography variant="h4" align="center" gutterBottom >
              {beer.name}
            </Typography>
            
            <Box display="flex" justifyContent="center" mb={2}>
              <img src={placeHolder} alt={`${beer.name} image`} style={{ width: '200px', height: 'auto' }} />
            </Box>
            
            <Box display="flex" justifyContent="center" mb={2}>
              
              <Link 
                component = {RouterLink} 
                to        = {`/review-beer/${beerId}`} 
                //state     = {{ beer }}
                sx        = {{ marginRight: 1 }}
              > 
                <CreateIcon sx={{color: 'black'}} fontSize="small" />
              </Link>
              
              <Rating value={beer.avg_rating} precision={0.1} readOnly sx={{color: 'black'}} />
            </Box>

            <Typography variant="body1" align="center" paragraph>
              Cerveza de estilo {beer.style}
            </Typography>
            
            <Typography variant="body1" align="center" paragraph>
              Porcentaje de Alcohol: {beer.alcohol}
            </Typography>
            
            {beer.brand.brewery.name && (
              <Typography variant="body1" align="center" paragraph>
                Producida por {beer.brand.brewery.name}
              </Typography>
            )}

            <Typography variant="h6" align="center" paragraph>
              Bares que sirven esta cerveza:
            </Typography>
            {bars.map(bar => (
              <Typography key={bar.id} variant="body1" align="center" paragraph>
                <Link component={RouterLink} to={`/bars/${bar.id}`}>
                  {bar.name}
                </Link>
              </Typography>
            ))}
            {!bars.length && (
              <Typography variant="body1" align="center" paragraph>
                No hay bares que sirvan esta cerveza.
              </Typography>
            )}
          </>
        )}
        <hr />

        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <Star fontSize='medium' />
          <Typography
            variant="h5"
            align="center"
            paragraph
            component={RouterLink}
            to={`/beer-review/${beerId}`}
            sx={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', marginLeft: 1 }}
          >
            <Link>
              Reviews de usuarios
            </Link>
          </Typography>
        </Box>

        <Toolbar />

      </Box>
    </>
  );
}

export default BeerDetails;
