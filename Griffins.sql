

CREATE TABLE Manufacturers (
    manufacturer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100)
);

CREATE TABLE Aircraft (
    aircraft_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    max_speed INT,
    first_flight DATE,
    status VARCHAR(50),
    description TEXT,
    manufacturer_id INT,
    FOREIGN KEY (manufacturer_id) REFERENCES Manufacturers(manufacturer_id)
);

CREATE TABLE Specifications (
    spec_id INT PRIMARY KEY AUTO_INCREMENT,
    aircraft_id INT UNIQUE, -- Assuming one spec sheet per aircraft
    max_range INT,
    ceiling INT,
    crew INT,
    engine_type VARCHAR(50),
    FOREIGN KEY (aircraft_id) REFERENCES Aircraft(aircraft_id)
);

CREATE TABLE Operators (
    operator_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100)
);

CREATE TABLE Aircraft_Operators (
    aircraft_id INT,
    operator_id INT,
    PRIMARY KEY (aircraft_id, operator_id),
    FOREIGN KEY (aircraft_id) REFERENCES Aircraft(aircraft_id),
    FOREIGN KEY (operator_id) REFERENCES Operators(operator_id)
);

CREATE TABLE Armaments (
    armament_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    description TEXT
);

CREATE TABLE Aircraft_Armaments (
    aircraft_id INT,
    armament_id INT,
    PRIMARY KEY (aircraft_id, armament_id),
    FOREIGN KEY (aircraft_id) REFERENCES Aircraft(aircraft_id),
    FOREIGN KEY (armament_id) REFERENCES Armaments(armament_id)
);
INSERT INTO Manufacturers (manufacturer_id, name, country) VALUES
(1, 'Lockheed Martin', 'USA'),
(2, 'Boeing', 'USA'),
(3, 'Dassault Aviation', 'France'),
(4, 'Sukhoi', 'Russia'),
(5, 'Airbus', 'Germany'),
(6, 'Mikoyan', 'Russia'),
(7, 'Northrop Grumman', 'USA'),
(8, 'Chengdu Aerospace', 'China'),
(9, 'HAL', 'India'),
(10, 'Saab AB', 'Sweden');
INSERT INTO Aircraft (aircraft_id, name, type, max_speed, first_flight, status, description, manufacturer_id) VALUES
(1, 'F-16 Fighting Falcon', 'Fighter', 2400, '1974-01-20', 'Active', 'Lightweight multirole fighter', 1),
(2, 'F-22 Raptor', 'Fighter', 2410, '1997-09-07', 'Active', 'Stealth air superiority fighter', 1),
(3, 'F-35 Lightning II', 'Fighter', 1930, '2006-12-15', 'Active', 'Stealth multirole fighter', 1),
(4, 'B-2 Spirit', 'Bomber', 1010, '1989-07-17', 'Active', 'Stealth strategic bomber', 7),
(5, 'Boeing 747', 'Transport', 988, '1969-02-09', 'Active', 'Iconic passenger aircraft', 2),
(6, 'Su-57', 'Fighter', 2600, '2010-01-29', 'Active', 'Russian stealth fighter', 4),
(7, 'Su-35', 'Fighter', 2500, '2008-02-19', 'Active', 'Russian multirole fighter', 4),
(8, 'MiG-29', 'Fighter', 2450, '1977-10-06', 'Active', 'Russian air superiority fighter', 6),
(9, 'MiG-31', 'Interceptor', 3000, '1975-09-16', 'Active', 'High-speed interceptor', 6),
(10, 'Dassault Rafale', 'Fighter', 1912, '1986-07-04', 'Active', 'French multirole fighter', 3),
(11, 'Eurofighter Typhoon', 'Fighter', 2495, '1994-03-27', 'Active', 'European multirole fighter', 5),
(12, 'J-20 Mighty Dragon', 'Fighter', 2100, '2011-01-11', 'Active', 'Chinese stealth fighter', 8),
(13, 'Tejas', 'Fighter', 1715, '2001-01-04', 'Active', 'Indian light combat aircraft', 9),
(14, 'Saab JAS 39 Gripen', 'Fighter', 2205, '1988-12-09', 'Active', 'Swedish multirole fighter', 10);
INSERT INTO Specifications (spec_id, aircraft_id, max_range, ceiling, crew, engine_type) VALUES
(1, 1, 4220, 15000, 1, 'Turbofan'),
(2, 2, 2960, 20000, 1, 'Turbofan'),
(3, 3, 2200, 18200, 1, 'Turbofan'),
(4, 4, 11100, 15200, 2, 'Turbofan'),
(5, 5, 13450, 13100, 4, 'Turbofan'),
(6, 6, 3500, 20000, 1, 'Turbofan'),
(7, 7, 3600, 18000, 1, 'Turbofan'),
(8, 8, 2100, 17500, 1, 'Turbofan'),
(9, 9, 1450, 20600, 2, 'Turbofan'),
(10, 10, 3700, 15200, 1, 'Turbofan'),
(11, 11, 2900, 19800, 1, 'Turbofan'),
(12, 12, 5500, 20000, 1, 'Turbofan'),
(13, 13, 3000, 15000, 1, 'Turbofan'),
(14, 14, 3200, 15000, 1, 'Turbofan');
INSERT INTO Operators (operator_id, name, country) VALUES
(1, 'United States Air Force', 'USA'),
(2, 'Russian Air Force', 'Russia'),
(3, 'Indian Air Force', 'India'),
(4, 'French Air Force', 'France'),
(5, 'Chinese Air Force', 'China'),
(6, 'Swedish Air Force', 'Sweden'),
(7, 'Royal Air Force', 'UK'),
(8, 'German Air Force', 'Germany');
INSERT INTO Aircraft_Operators (aircraft_id, operator_id) VALUES
(1, 1), (1, 3),
(2, 1),
(3, 1), (3, 3),
(4, 1),
(5, 7), (5, 8),
(6, 2),
(7, 2),
(8, 2), (8, 3),
(9, 2),
(10, 4),
(11, 7), (11, 8),
(12, 5),
(13, 3),
(14, 6);
INSERT INTO Armaments (armament_id, name, type, description) VALUES
(1, 'AIM-120 AMRAAM', 'Missile', 'Advanced medium-range air-to-air missile'),
(2, 'AIM-9 Sidewinder', 'Missile', 'Short-range air-to-air missile'),
(3, 'M61 Vulcan', 'Cannon', '20mm rotary cannon'),
(4, 'Kh-31', 'Missile', 'Russian anti-ship/anti-radar missile'),
(5, 'R-77', 'Missile', 'Russian medium-range missile'),
(6, 'R-73', 'Missile', 'Russian short-range missile'),
(7, 'Meteor', 'Missile', 'European beyond-visual-range missile');
INSERT INTO Aircraft_Armaments (aircraft_id, armament_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(3, 1), (3, 2),
(6, 4), (6, 5), (6, 6),
(7, 5), (7, 6),
(8, 5), (8, 6),
(9, 5),
(10, 7),
(11, 7),
(12, 1), (12, 7),
(13, 1), (13, 2),
(14, 1), (14, 7);
SELECT name, max_speed
FROM Aircraft
ORDER BY max_speed DESC
LIMIT 5;
SELECT name, first_flight
FROM Aircraft
ORDER BY first_flight ASC
LIMIT 5;
SELECT name, country
FROM Manufacturers
ORDER BY name ASC
LIMIT 3;
SELECT o.name AS operator, COUNT(ao.aircraft_id) AS total_aircraft
FROM Operators o
JOIN Aircraft_Operators ao ON o.operator_id = ao.operator_id
GROUP BY o.name
ORDER BY total_aircraft DESC
LIMIT 5;
SELECT a.name, s.max_range 

FROM Aircraft a
JOIN Specifications s ON a.aircraft_id = s.aircraft_id
ORDER BY s.max_range DESC
LIMIT 5;
-- A more detailed query joining multiple tables
SELECT
    a.name AS aircraft_name,
    a.type,
    a.max_speed,
    m.name AS manufacturer,
    m.country AS origin_country
FROM Aircraft a
JOIN Manufacturers m ON a.manufacturer_id = m.manufacturer_id
ORDER BY a.max_speed DESC;
