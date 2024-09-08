import { Button, Typography, AppBar, Box } from '@mui/material'; // Añadido Box
import { useNavigate, useLocation } from 'react-router-dom'; // Añadido useLocation
import React, { useState, useEffect } from 'react'; // Añadido useState y useEffect
import SearchAppBar from './SearchAppBar'; // Asegúrate de tener este componente
import SearchTabs from './SearchTabs'; // Asegúrate de tener este componente

function Home() {
  const location = useLocation();
  const [searchKeywords, setSearchKeywords] = useState(''); // Añadido useState

  useEffect(() => {
    if (location.state && location.state.searchKeywords) {
      setSearchKeywords(location.state.searchKeywords);
    }
  }, [location.state]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <SearchAppBar searchKeywords={searchKeywords} setSearchKeywords={setSearchKeywords} />

      {searchKeywords ? (
        <SearchTabs searchKeywords={searchKeywords} setSearchKeywords={setSearchKeywords} />
      ) : (
        <>
          <Typography variant="h6" component="h1" align="center" gutterBottom>
            Placeholder del mapa! La idea es que se muestren los mapas más cercanos según la ubicación del usuario, pero a este punto es literalmente imposible hacer eso así que está vacío!!
          </Typography>

          <Typography variant="body1" align="center" gutterBottom>
            ¡El icono del medio lleva al root, por cierto!
          </Typography>
        </>
      )}
    </Box>
  );
}

export default Home;

