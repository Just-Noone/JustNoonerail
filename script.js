const fs = require('fs'); // File system module to read data

// Assuming your stations data is stored in a file named stations.json
const stationsData = JSON.parse(fs.readFileSync('../assets/json/stations.json', 'utf8'));

// Assuming your route data is part of a larger JSON file (replace with actual file path)
const routeData = require('../assets/json/routes.json');

// Function to extract station information by ID
function getStationInfo(stationId) {
  const station = stationsData.find(station => station.id === stationId);
  return station || { id: stationId, name: 'Station information not found', connections: [] };
}

// Function to process stations on a route
function processRouteStations(route) {
  const stations = route.stations.map(stationId => {
    const id = stationId.split('_')[0]; // Extract station ID
    const stationInfo = getStationInfo(id);
    return { ...stationInfo, id }; // Combine ID and info
  });
  return stations;
}

// Get the stations on the Roshinsky prospekt temp line
const stations = processRouteStations(routeData.find(route => route.name === 'Roshinsky prospekt temp line'));

// Print station information (replace with your logic for displaying/using data)
console.log('Stations on Roshinsky prospekt temp line:');
stations.forEach(station => {
  console.log(`  - ID: ${station.id}, Name: ${station.name}, Connections: ${station.connections.join(', ')}`);
});
