import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function AircraftDetail() {
  const { id } = useParams();
  const [aircraft, setAircraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/aircraft/${id}/details`)
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
  }, [id]);

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-4">Error: {error.message}</div>;
  }

  if (!aircraft) {
    return <div className="container mt-4">Aircraft not found.</div>;
  }

  return (
    <div className="container mt-4">
      <h1>{aircraft.name}</h1>
      <p><strong>Type:</strong> {aircraft.type}</p>
      <p><strong>Max Speed:</strong> {aircraft.max_speed} km/h</p>
      <p><strong>First Flight:</strong> {new Date(aircraft.first_flight).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {aircraft.status}</p>
      <p><strong>Description:</strong> {aircraft.description}</p>

      {aircraft.specifications && (
        <div className="mt-4">
          <h2>Specifications</h2>
          <ul className="list-group">
            <li className="list-group-item"><strong>Max Range:</strong> {aircraft.specifications.max_range} km</li>
            <li className="list-group-item"><strong>Ceiling:</strong> {aircraft.specifications.ceiling} m</li>
            <li className="list-group-item"><strong>Crew:</strong> {aircraft.specifications.crew}</li>
            <li className="list-group-item"><strong>Engine Type:</strong> {aircraft.specifications.engine_type}</li>
          </ul>
        </div>
      )}

      {aircraft.operators && aircraft.operators.length > 0 && (
        <div className="mt-4">
          <h2>Operators</h2>
          <ul className="list-group">
            {aircraft.operators.map(op => (
              <li key={op.name} className="list-group-item">{op.name} ({op.country})</li>
            ))}
          </ul>
        </div>
      )}

      {aircraft.armaments && aircraft.armaments.length > 0 && (
        <div className="mt-4">
          <h2>Armaments</h2>
          <ul className="list-group">
            {aircraft.armaments.map(arm => (
              <li key={arm.name} className="list-group-item">
                <strong>{arm.name}</strong> ({arm.type}): {arm.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AircraftDetail;
