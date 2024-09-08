import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Rating, Button, AppBar, Toolbar } from '@mui/material';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

function ReviewBeer() {
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

  const handleSubmit = () => {
    const wordCount = reviewText.trim().split(/\s+/).length;
    if (wordCount < 15) {
      setErrorMessage("La reseña debe contener al menos 15 palabras.");
      return;
    }
    if (rating === 0) {
      setErrorMessage("Debes seleccionar una calificación (Rating).");
      return;
    }
    
    // Imprimir JSON en la consola
    const reviewData = {
      beer_id: beerId,
      rating: rating,
      review: reviewText
    };
    console.log(reviewData);

    setErrorMessage(""); // Limpiar error después del envío
  };

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

      {/* Formulario para escribir la review */}
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1, width: '100%' }, mt: 3, maxWidth: '600' }} // Width al 100% y maxWidth 600px
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Escribe tu reseña"
          variant="outlined"
          multiline
          rows={6}
          fullWidth
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </Box>

      {/* Rating y botón de Enviar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px', mt: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: 'gray', color: 'white', mb: 2 }} // Custom gray color
          onClick={handleSubmit}
        >
          Enviar Review
        </Button>

        <Rating
          name="beer-rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
      </Box>

      {/* Mensaje de error si no cumple las validaciones */}
      {errorMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
}

export default ReviewBeer;
