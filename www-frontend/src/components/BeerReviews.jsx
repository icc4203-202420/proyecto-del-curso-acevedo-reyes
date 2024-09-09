import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Rating, Button, AppBar, Toolbar } from '@mui/material';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

function BeerReview() {
  const { beerId } = useParams();
  const navigate = useNavigate();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}`)
      .then(response => {
        const fetchedBeer = response.data.beer;
        setBeer(fetchedBeer);
        setRating(fetchedBeer.avg_rating || 0);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [beerId]);
  

  if (loading) return <CircularProgress sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>Failed to load beer details.</Typography>;

  return (


    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Barra superior con opción de volver */}
        <AppBar position="static" sx={{ bgcolor: 'lightgray' }}>
            <Toolbar>
            <Button onClick={() => navigate(`/beers/${beerId}`)} sx={{ color: 'black' }}>
            <NavigateBeforeIcon />
                Volver
            </Button>
            </Toolbar>
        </AppBar>
        HOLA!!
        <br></br>
        Estimado ayudante:
        <br></br>
        Lo intentamos pero nos costó y no se pudo, pero al menos dejamos la vista y esperamos poder tener esto arreglado para la próxima entrega. Un saludo, Lucas y Vicente.
        <br></br>
        <Typography variant="h4" align="center" gutterBottom>
              {beer.name}
            </Typography>
        </Box>
    
  );
}

export default BeerReview;