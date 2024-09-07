import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import BarsList from './BarsList';
import BeersList from './BeersList';
import ProfilesList from './ProfilesList';

function SearchTabs({ searchKeywords, setSearchKeywords }) { // Acepta props de búsqueda
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    //setSearchKeywords(''); // Limpiar la búsqueda al cambiar de pestañas
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Bares" />
        <Tab label="Cervezas" />
        <Tab label="Personas" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {selectedTab === 0 && <BarsList searchKeywords={searchKeywords} />}
        {selectedTab === 1 && <BeersList searchKeywords={searchKeywords} />}
        {selectedTab === 2 && <ProfilesList searchKeywords={searchKeywords} />}
      </Box>
    </Box>
  );
}

export default SearchTabs;

