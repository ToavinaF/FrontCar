import { useState } from 'react'
import './App.scss'
import Home from './Component/Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {

  return (
    <Router>
    <Routes>
        <Route path="/*" element={<Home />} />
        {/* Ajoutez d'autres routes si nécessaire */}
    </Routes>
</Router>
  )
}

export default App
