import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AircraftList() {
  const [aircraft, setAircraft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (typeFilter) params.append('type', typeFilter);
    if (countryFilter) params.append('country', countryFilter);

    fetch(`http://localhost:3000/api/aircraft?${params.toString()}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setAircraft(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [searchTerm, typeFilter, countryFilter, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-4">Error: {error.message}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="home-title mb-4">Griffins Aircraft Encyclopedia</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search aircraft..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-control" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="Fighter">Fighter</option>
            <option value="Bomber">Bomber</option>
            <option value="Transport">Transport</option>
            <option value="Interceptor">Interceptor</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-control" value={countryFilter} onChange={e => setCountryFilter(e.target.value)}>
            <option value="">All Countries</option>
            <option value="USA">USA</option>
            <option value="Russia">Russia</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="China">China</option>
            <option value="India">India</option>
            <option value="Sweden">Sweden</option>
            <option value="UK">UK</option>
          </select>
        </div>
      </div>

      <div className="row">
        {aircraft.map(plane => (
          <div className="col-md-4 mb-4" key={plane.aircraft_id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{plane.name}</h5>
                <h6 className="card-subtitle mb-2 text-primary">{plane.type}</h6>
                <p className="card-text">{plane.description}</p>
                <Link to={`/aircraft/${plane.aircraft_id}`} className="btn btn-primary">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AircraftList;
