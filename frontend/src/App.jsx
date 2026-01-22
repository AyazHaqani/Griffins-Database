import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AircraftList from './components/AircraftList';
import AircraftDetail from './pages/AircraftDetail';
import Manufacturers from './pages/Manufacturers';
import ManufacturerDetail from './pages/ManufacturerDetail';
import Comparison from './pages/Comparison';
import Admin from './pages/Admin';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<AircraftList />} />
        <Route path="/aircraft/:id" element={<AircraftDetail />} />
        <Route path="/manufacturers" element={<Manufacturers />} />
        <Route path="/manufacturer/:id" element={<ManufacturerDetail />} />
        <Route path="/compare" element={<Comparison />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
