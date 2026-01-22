import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';

function Comparison() {
  const [aircraftOptions, setAircraftOptions] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/aircraft')
      .then(response => response.json())
      .then(data => {
        const options = data.map(plane => ({
          value: plane.aircraft_id,
          label: plane.name,
        }));
        setAircraftOptions(options);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedAircraft.length > 0) {
      Promise.all(
        selectedAircraft.map(option =>
          fetch(`http://localhost:3000/api/aircraft/${option.value}/details`).then(res => res.json())
        )
      ).then(data => {
        setComparisonData(data);
      });
    } else {
      setComparisonData([]);
    }
  }, [selectedAircraft]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="main-container container">
      <h1>Aircraft Comparison</h1>
      <Select
        isMulti
        options={aircraftOptions}
        onChange={setSelectedAircraft}
        placeholder="Select aircraft to compare..."
      />

      {comparisonData.length > 0 && (
        <div className="table-container glass-container mt-4">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Specification</th>
                {comparisonData.map(plane => (
                  <th key={plane.aircraft_id}>{plane.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Max Speed (km/h)</td>
                {comparisonData.map(plane => (
                  <td key={plane.aircraft_id}>{plane.max_speed}</td>
                ))}
              </tr>
              <tr>
                <td>Max Range (km)</td>
                {comparisonData.map(plane => (
                  <td key={plane.aircraft_id}>{plane.specifications?.max_range}</td>
                ))}
              </tr>
              <tr>
                <td>Ceiling (m)</td>
                {comparisonData.map(plane => (
                  <td key={plane.aircraft_id}>{plane.specifications?.ceiling}</td>
                ))}
              </tr>
              <tr>
                <td>Crew</td>
                {comparisonData.map(plane => (
                  <td key={plane.aircraft_id}>{plane.specifications?.crew}</td>
                ))}
              </tr>
              <tr>
                <td>Engine Type</td>
                {comparisonData.map(plane => (
                  <td key={plane.aircraft_id}>{plane.specifications?.engine_type}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Comparison;
