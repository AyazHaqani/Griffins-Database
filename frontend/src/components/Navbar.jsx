import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg glass-container">
      <div className="container">
        <Link className="navbar-brand" to="/">Griffins</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Aircraft</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manufacturers">Manufacturers</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/compare">Compare</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
