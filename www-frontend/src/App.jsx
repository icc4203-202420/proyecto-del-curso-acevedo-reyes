import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FixedBottomNav from './components/FixedBottomNav';
import SearchTabs from './components/SearchTabs';
import BarDetails from './components/BarDetails';
import UserInfo from './components/UserInfo';

function App() {
  return (
    <>
      <FixedBottomNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchTabs />} />
        <Route path="/bars/:barId" element={<BarDetails />} />
        <Route path="/user" element={<UserInfo />} />
      </Routes>
    </>
  );
}

export default App;
