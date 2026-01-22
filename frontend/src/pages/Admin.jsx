// pages/Admin.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aircraft: {
      name: '',
      type: '',
      max_speed: '',
      first_flight: '',
      status: 'Active',
      description: '',
      manufacturer_id: '',
    },
    specifications: {
      max_range: '',
      ceiling: '',
      crew: '',
      engine_type: '',
    },
  });
  const [manufacturers, setManufacturers] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost:3000/api/manufacturers')
      .then(response => response.json())
      .then(data => setManufacturers(data))
      .catch(error => console.error('Error fetching manufacturers:', error));

    // Cleanup function
    return () => {
      // This will clear the timer if the component unmounts
      clearTimeout();
    };
  }, []);

  const handleChange = (e, section) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [e.target.name]: e.target.value,
      },
    });
  };

  const validate = () => {
    const newErrors = {};
    const { aircraft, specifications } = formData;

    // Aircraft validation
    if (!aircraft.name) newErrors.name = 'Aircraft name is required.';
    if (!aircraft.type) newErrors.type = 'Aircraft type is required.';
    if (!aircraft.manufacturer_id) newErrors.manufacturer_id = 'Manufacturer is required.';
    if (aircraft.max_speed && parseInt(aircraft.max_speed, 10) <= 0) {
      newErrors.max_speed = 'Max speed must be a positive number.';
    }

    // Specifications validation
    if (!specifications.max_range) {
      newErrors.max_range = 'Max range is required.';
    } else if (parseInt(specifications.max_range, 10) <= 0) {
      newErrors.max_range = 'Max range must be a positive number.';
    }

    if (specifications.ceiling && parseInt(specifications.ceiling, 10) <= 0) {
      newErrors.ceiling = 'Ceiling must be a positive number.';
    }

    if (specifications.crew && parseInt(specifications.crew, 10) < 0) {
      newErrors.crew = 'Crew cannot be a negative number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    if (!validate()) {
      return; // Stop submission if validation fails
    }
    try {
      const response = await fetch('http://localhost:3000/api/aircraft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // On success
      setFormData({
        aircraft: { name: '', type: '', max_speed: '', first_flight: '', status: 'Active', description: '', manufacturer_id: '' },
        specifications: { max_range: '', ceiling: '', crew: '', engine_type: '' },
      });
      setMessage('Aircraft added successfully! Redirecting to aircraft list...');
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000); // Wait 2 seconds before redirecting to show the message

    } catch (error) {
        setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Add New Aircraft</h1>
      <form onSubmit={handleSubmit}>
        <h2>Aircraft Details</h2>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" name="name" value={formData.aircraft.name} onChange={e => handleChange(e, 'aircraft')} required />
          {errors.name && <small className="form-text text-danger">{errors.name}</small>}
        </div>
        <div className="form-group">
          <label>Type</label>
          <select className="form-control" name="type" value={formData.aircraft.type} onChange={e => handleChange(e, 'aircraft')} required>
            <option value="">Select Type</option>
            <option value="Fighter">Fighter</option>
            <option value="Bomber">Bomber</option>
            <option value="Transport">Transport</option>
            <option value="Interceptor">Interceptor</option>
          </select>
          {errors.type && <small className="form-text text-danger">{errors.type}</small>}
        </div>
        <div className="form-group">
          <label>Max Speed (km/h)</label>
          <input type="number" className="form-control" name="max_speed" value={formData.aircraft.max_speed} onChange={e => handleChange(e, 'aircraft')} />
          {errors.max_speed && <small className="form-text text-danger">{errors.max_speed}</small>}
        </div>
        <div className="form-group">
          <label>First Flight (YYYY-MM-DD)</label>
          <input type="date" className="form-control" name="first_flight" value={formData.aircraft.first_flight} onChange={e => handleChange(e, 'aircraft')} />
          {errors.first_flight && <small className="form-text text-danger">{errors.first_flight}</small>}
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="form-control" name="status" value={formData.aircraft.status} onChange={e => handleChange(e, 'aircraft')} required>
            <option value="Active">Active</option>
            <option value="Retired">Retired</option>
            <option value="Prototype">Prototype</option>
          </select>
          {errors.status && <small className="form-text text-danger">{errors.status}</small>}
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control" name="description" value={formData.aircraft.description} onChange={e => handleChange(e, 'aircraft')} />
          {errors.description && <small className="form-text text-danger">{errors.description}</small>}
        </div>
        <div className="form-group">
          <label>Manufacturer</label>
          <select className="form-control" name="manufacturer_id" value={formData.aircraft.manufacturer_id} onChange={e => handleChange(e, 'aircraft')} required>
            <option value="">Select Manufacturer</option>
            {manufacturers.map(manufacturer => (
              <option key={manufacturer.manufacturer_id} value={manufacturer.manufacturer_id}>
                {manufacturer.name}
              </option>
            ))}
          </select>
          {errors.manufacturer_id && <small className="form-text text-danger">{errors.manufacturer_id}</small>}
        </div>
        <h2>Specifications</h2>
        <div className="form-group">
          <label>Max Range (km)</label>
          <input type="number" className="form-control" name="max_range" value={formData.specifications.max_range} onChange={e => handleChange(e, 'specifications')} required />
          {errors.max_range && <small className="form-text text-danger">{errors.max_range}</small>}
        </div>
        <div className="form-group">
          <label>Ceiling (m)</label>
          <input type="number" className="form-control" name="ceiling" value={formData.specifications.ceiling} onChange={e => handleChange(e, 'specifications')} />
          {errors.ceiling && <small className="form-text text-danger">{errors.ceiling}</small>}
        </div>
        <div className="form-group">
          <label>Crew</label>
          <input type="number" className="form-control" name="crew" value={formData.specifications.crew} onChange={e => handleChange(e, 'specifications')} />
          {errors.crew && <small className="form-text text-danger">{errors.crew}</small>}
        </div>
        <div className="form-group">
          <label>Engine Type</label>
          <select className="form-control" name="engine_type" value={formData.specifications.engine_type} onChange={e => handleChange(e, 'specifications')}>
            <option value="">Select Engine Type</option>
            <option value="Turbofan">Turbofan</option>
            <option value="Turbojet">Turbojet</option>
            <option value="Turboprop">Turboprop</option>
            <option value="Piston">Piston</option>
          </select>
          {errors.engine_type && <small className="form-text text-danger">{errors.engine_type}</small>}
        </div>
        <button type="submit" className="btn btn-primary mt-3">Add Aircraft</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default Admin;