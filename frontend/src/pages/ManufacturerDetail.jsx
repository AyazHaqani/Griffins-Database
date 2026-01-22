import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ManufacturerDetail() {
  const { id } = useParams();
  const [manufacturer, setManufacturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/manufacturer/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setManufacturer(data);
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

  if (!manufacturer) {
    return <div className="container mt-4">Manufacturer not found.</div>;
  }

  return (
    <div className="container mt-4">
      <h1>{manufacturer.name}</h1>
      <p><strong>Country:</strong> {manufacturer.country}</p>

      {manufacturer.aircraft && manufacturer.aircraft.length > 0 && (
        <div className="mt-4">
          <h2>Aircraft</h2>
          <div className="list-group">
            {manufacturer.aircraft.map(plane => (
              <Link key={plane.aircraft_id} to={`/aircraft/${plane.aircraft_id}`} className="list-group-item list-group-item-action">
                {plane.name} ({plane.type})
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManufacturerDetail;
