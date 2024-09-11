import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Rating, Button, AppBar, Toolbar, Card, CardContent, Divider, Avatar, Pagination } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import axios from 'axios';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

function BeerReview() {
  const { beerId } = useParams();
  const navigate = useNavigate();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [page, setPage] = useState(1);
  const reviewsPerPage = 2;

  const userId = localStorage.getItem('user');

  useEffect(() => {
    axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}`)
      .then(response => {
        const fetchedBeer = response.data.beer;
        setBeer(fetchedBeer);
        setReviews(fetchedBeer.reviews || []); // Maneja el caso en el que no haya reseñas
        setAvgRating(fetchedBeer.avg_rating || 0);
        
        setUserReview(fetchedBeer.reviews.find(review => review.user.id === parseInt(userId)));
        
        setReviews(fetchedBeer.reviews.filter(review => review.user.id !== parseInt(userId)));

        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [beerId, userId]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  
  console.log("USERREVIEW: ", userReview);

  const displayedReviews = reviews.slice((page - 1) * reviewsPerPage, page * reviewsPerPage);

  if (loading) return <CircularProgress sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>Failed to load beer reviews.</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      
      <AppBar position="static" sx={{ bgcolor: 'lightgray', mb: 2 }}>
        <Toolbar>
          <Button onClick={() => navigate(`/beers/${beerId}`)} sx={{ color: 'black' }}>
            <NavigateBeforeIcon />
            Volver
          </Button>
        </Toolbar>
      </AppBar>

      {/* Información de la cerveza */}
      <Typography variant="h4" align="center" gutterBottom>
        {beer.name}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        
        <Rating value={avgRating} precision={0.1} readOnly />
        
        <Typography sx={{ ml: 1 }}>
          {avgRating.toFixed(2)} ({beer.reviews.length} calificaciones)
        </Typography>
        
        {beer.image_url && <Avatar alt={beer.name} src={beer.image_url} sx={{ width: 60, height: 60, ml: 2 }} />}
      
      </Box>

      {/* reseña del usuario actual primero si existe */}
      {userReview && (
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <Card key={userReview.id} sx={{ mb: 2 }}>
            <CardContent>
              
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right', mb: 1 }}>

              <Rating value={parseFloat(userReview.rating)} precision={0.1} readOnly />

              <Typography variant="body1" fontWeight="bold">
                Tú (@{userReview.user.handle || 'sin-handle'}) <PersonOutlinedIcon />
              </Typography>

            </Box>
              
            <Typography variant="body1">
              {userReview.text}
            </Typography>
            
            </CardContent>
          </Card>  
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* reseñas de otros usuarios */}
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        {displayedReviews.map((review) => (
          <Card key={review.id} sx={{ mb: 2 }}>
            <CardContent>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right', mb: 1 }}>
                
                <Rating value={parseFloat(review.rating)} precision={0.1} readOnly />
                
                <Typography variant="body2" color="textSecondary">
                  @{review.user.handle || 'sin-handle'} <PersonOutlinedIcon />
                </Typography>
                
              </Box>

              <Typography variant="body1" gutterBottom>
                {review.text}
              </Typography>
            
            </CardContent>
            <Divider />
          </Card>
        ))}

        <Pagination
          count    = {Math.ceil(reviews.length / reviewsPerPage)}
          page     = {page}
          onChange = {handleChangePage}
          color    = "primary"
          sx       = {{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      </Box>
    </Box>
  );
}

export default BeerReview;
