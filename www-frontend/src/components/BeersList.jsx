import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import placeHolder from '../assets/placeholder.jpg';

function BeersList({ searchKeywords }) {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:3001/api/v1/beers')
      .then(response => {
        setBeers(response.data.beers);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchKeywords.toLowerCase())
  );

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load beers.</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      {filteredBeers.length === 0 ? (
        <Typography variant="h6" align="center">
          No beers found.
        </Typography>
      ) : (
        filteredBeers.map(beer => (
          <Grid container spacing={2} alignItems="center" key={beer.id} sx={{ mb: 3 }}>
            <Grid item>
              <Box>
                <img src={placeHolder} alt={`${beer.name} image`} style={{ width: '50px', height: 'auto' }} />
              </Box>
            </Grid>
            <Grid item xs alignItems = "center">
              <Link
                to={`/beers/${beer.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {beer.name}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        ))
      )}
    </Box>
  );
}

export default BeersList;
