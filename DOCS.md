
# Griffins Project Documentation

## Description

Griffins is a full-stack web application designed to catalog military aircraft. It provides a comprehensive database of aircraft and their manufacturers, allowing users to browse, search, and view detailed information. The project features a Node.js/Express backend that serves data from a MySQL database, and a modern React/Vite frontend for a responsive user experience.

A key feature of the backend is its automated database setup. On initial startup, the server checks for the existence of the `griffins_db` database and its tables. If they are not found, it automatically creates the database, defines the necessary tables, and populates them with initial data from the `Griffins.sql` file.

## Folder Structure

The project is organized into two main directories: `frontend` and `backend`.

```
Griffins/
├── backend/              # Node.js/Express backend
│   ├── index.js          # Main server file with API routes and DB initialization
│   └── package.json      # Backend dependencies and scripts
├── frontend/             # React/Vite frontend
│   ├── src/
│   │   ├── App.jsx       # Main app component with client-side routing
│   │   ├── components/   # Reusable React components
│   │   └── pages/        # Individual page components
│   └── package.json      # Frontend dependencies and scripts
├── Griffins.sql          # Database schema and seed data
└── DOCS.md               # This documentation file
```

> **Note:** The `griffins/` directory contains a deprecated create-react-app project and should be ignored. The active and updated frontend is located in the `frontend/` directory.

## Getting Started

To run this project locally, you will need to have Node.js and a MySQL server installed.

### 1. Backend Setup

The backend requires a running MySQL server. The connection is configured in `backend/index.js`.

**Default MySQL Credentials:**
- **Host:** `localhost`
- **User:** `root`
- **Password:** `password`
- **Database:** `griffins_db`

You can either update your local MySQL setup to match these credentials or modify the `dbConfig` object in `backend/index.js` to match your environment.

Once MySQL is configured, follow these steps:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend server will start on port 3001 and automatically create and seed the `griffins_db` database if it doesn't already exist.

### 2. Frontend Setup

The frontend is a React application built with Vite.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend development server will start, and you can access the application in your browser at the address provided (usually `http://localhost:5173`).

## API Endpoints

The backend provides the following API endpoints to serve aircraft and manufacturer data:

- `GET /api/aircraft`: Fetches a list of all aircraft.
- `GET /api/aircraft/:id`: Fetches details for a specific aircraft by its ID.
- `GET /api/manufacturers`: Fetches a list of all manufacturers.
- `GET /api/manufacturers/:id`: Fetches details for a specific manufacturer by its ID.
- `GET /api/countries`: Fetches a list of all unique countries of origin for manufacturers.
- `GET /api/aircraft/search?q=<query>`: Searches for aircraft matching the query.

## Key Technologies

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **mysql2**: MySQL driver for Node.js.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Modern frontend build tool.
- **React Router**: For client-side routing.

### Database
- **MySQL**: Relational database management system.

## Future Scope

- **User Authentication**: Implement user accounts to allow for personalized features.
- **Admin Dashboard**: Enhance the `/admin` page to allow for full CRUD (Create, Read, Update, Delete) operations on aircraft and manufacturers directly from the UI.
- **Advanced Search**: Add more sophisticated filtering and sorting options for the aircraft list.
- **Image Uploads**: Allow admins to upload images for aircraft and manufacturers.
- **Deployment**: Add configuration and scripts for easy deployment to a cloud platform.
- **CI/CD**: Add a CI/CD pipeline.
- **Testing**: Add a testing suite for the application.

