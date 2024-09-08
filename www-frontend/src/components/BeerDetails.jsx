import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Typography, CircularProgress, Box, AppBar, Button, Toolbar, Link } from '@mui/material';
import axios from 'axios';
import { Star, StarOutline } from '@mui/icons-material'; // ICONOS
import CreateIcon from '@mui/icons-material/Create';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import placeHolder from '../assets/placeholder.jpg';


function BeerDetails() {
  const { beerId } = useParams();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}`)
      .then(response => {
        setBeer(response.data.beer);
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
          <Button component={RouterLink} to="/" color="inherit">
            <NavigateBeforeIcon />
            Cervezas
          </Button>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Separación */}

      <Box paddingTop="64px"> {/* To account for AppBar height */}
        {beer && (
          <>
            <Typography variant="h4" align="center" gutterBottom>
              {beer.name}
            </Typography>
            
            <Box display="flex" justifyContent="center" mb={2}>
              <img src={placeHolder} alt={`${beer.name} image`} style={{ width: '200px', height: 'auto' }} />
            </Box>
            <Box display="flex" justifyContent="center" mb={2}>
              <Link component={RouterLink} to={`/review-beer/${beerId}`} sx={{ marginRight: 1 }}> 
                <CreateIcon color="primary" fontSize="small" />
              </Link>
              {Array.from({ length: 5 }, (_, index) => (
                index < rating ? (
                  <Star key={index} color="primary" fontSize="small" />
                ) : (
                  <StarOutline key={index} color="primary" fontSize="small" />
                )
              ))}
            </Box>

            <Typography variant="body2" align="center" paragraph>
              Promedio: {beer.avg_rating }
            </Typography>

            <Typography variant="body1" align="center" paragraph>
              Cerveza de estilo {beer.style}
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              Porcentaje de Alcohol: {beer.alcohol}
            </Typography>
            
            {beer.brand && (
              <Typography variant="body1" align="center" paragraph>
                Producida por {beer.brand.name}
              </Typography>
            )}
          </>
        )}
        <hr></hr>
        <Box display="flex" justifyContent="center" mb={2}>
            <Star fontSize='medium'/>
            <Typography variant="h5" align="center" paragraph>
                 Reviews de usuarios
              </Typography>
        </Box>
      </Box>
    </>
  );
}

export default BeerDetails;
