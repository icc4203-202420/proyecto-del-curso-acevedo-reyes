import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FixedBottomNav from './components/FixedBottomNav';
import SearchTabs from './components/SearchTabs';
import BarDetails from './components/BarDetails';
import BeerDetails from './components/BeerDetails';

function App() {
  return (
    <>
      <FixedBottomNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchTabs />} />
        <Route path="/bars/:barId" element={<BarDetails />} />
        <Route path="/beers/:beerId" element={<BeerDetails />} />
        
      </Routes>
    </>
  );
}

export default App;
