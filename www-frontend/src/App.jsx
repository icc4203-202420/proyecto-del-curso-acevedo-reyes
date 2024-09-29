import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FixedBottomNav from './components/FixedBottomNav';
import SearchTabs from './components/SearchTabs';
import BarDetails from './components/BarDetails';
import BeerDetails from './components/BeerDetails';
import ReviewBeer from './components/ReviewBeer';
import BeerReviews from './components/BeerReviews';
import UserInfo from './components/UserInfo';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import EventDetails from './components/EventDetails';
import UserDetails from './components/UserDetails';
import EventPictures from './components/EventPictures';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchTabs />} />
        <Route path="/bars/:barId" element={<BarDetails />} />
        <Route path="/beers/:beerId" element={<BeerDetails />} />
        <Route path="/review-beer/:beerId" element={<ReviewBeer />} />
        <Route path="/beer-review/:beerId" element={<BeerReviews />} />
        <Route path="/user" element={<UserInfo />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/users/:userId" element={<UserDetails />} />  {/* Nueva ruta para el detalle de un usuario */}
        <Route path="/events/:eventId/pictures" element={<EventPictures />} />

      </Routes>

      <FixedBottomNav />
    </>
  );
}

export default App;
