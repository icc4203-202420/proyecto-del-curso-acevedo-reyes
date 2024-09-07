import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import SearchAppBar from './SearchAppBar';
import SearchTabs from './SearchTabs';

function MainComponent() {
  const location = useLocation();
  const [searchKeywords, setSearchKeywords] = useState('');

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

export default MainComponent;
