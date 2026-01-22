import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Manufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/manufacturers')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setManufacturers(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-4">Error: {error.message}</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Manufacturers</h1>
      <div className="list-group">
        {manufacturers.map(man => (
          <Link key={man.manufacturer_id} to={`/manufacturer/${man.manufacturer_id}`} className="list-group-item list-group-item-action">
            {man.name} ({man.country})
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Manufacturers;
