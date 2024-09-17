import { Typography, Box } from '@mui/material'; // Añadido Box
import { useLocation } from 'react-router-dom'; // Añadido useLocation
import React, { useState, useEffect } from 'react'; // Añadido useState y useEffect
import SearchAppBar from './SearchAppBar'; // Asegúrate de tener este componente
import SearchTabs from './SearchTabs'; // Asegúrate de tener este componente
import logo from '../assets/logo.png';
import Map from './Map'; 

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
          <br />
          <Box display="flex" justifyContent="center" mb={2}>
            <img src={logo} style={{ width: '200px', height: 'auto' }} alt="Logo" />
          </Box>

          <Map />
          
        </>
      )}
    </Box>
  );
}

export default Home;

