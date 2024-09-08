import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FixedBottomNav from './components/FixedBottomNav';
import SearchTabs from './components/SearchTabs';
import BarDetails from './components/BarDetails';
import BeerDetails from './components/BeerDetails';
import ReviewBeer from './components/ReviewBeer';
import UserInfo from './components/UserInfo';
import SignIn from './components/SignIn';
import LogIn from './components/LogIn';

function App() {
  return (
    <>
      <FixedBottomNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchTabs />} />
        <Route path="/bars/:barId" element={<BarDetails />} />
        <Route path="/beers/:beerId" element={<BeerDetails />} />
        <Route path="/review-beer/:beerId" element={<ReviewBeer />} />
        <Route path="/user" element={<UserInfo />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/log-in" element={<LogIn />} />


      </Routes>
    </>
  );
}

export default App;
