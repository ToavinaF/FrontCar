import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Page/Dashboard/Dashboard';
import Profil from '../Profil/Profil';

const Router = () => {
  return (
    <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/addCar' element={<Profil />} />
    </Routes>
  );
}

export default Router;
