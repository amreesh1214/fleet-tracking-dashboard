// components/Maps/FleetMap.jsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, Typography, Box } from '@mui/material';

// Fix for default marker icons in webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored markers for different trips
const createColoredIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });
};

const tripColors = ['#2196f3', '#f44336', '#4caf50', '#ff9800', '#9c27b0'];

// Component to fit map bounds to show all routes
function MapBoundsHandler({ routes }) {
  const map = useMap();

  useEffect(() => {
    if (routes && routes.length > 0) {
      const allPoints = routes.flatMap(route => route.coordinates);
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [routes, map]);

  return null;
}

function FleetMap({ tripEvents, height = 500 }) {  // ✅ Add height prop
  console.group('🗺️ Fleet Map Rendering');
  console.log('Trip events received:', tripEvents?.length || 0);

  if (!tripEvents || tripEvents.length === 0) {
    console.warn('⚠️ No trip events to display on map');
    console.groupEnd();
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Fleet Map - Real-Time Tracking</Typography>
          <Box 
            display="flex" 
            flexDirection="column"
            justifyContent="center" 
            alignItems="center" 
            height={height}  // ✅ Use height prop
            bgcolor="#f5f5f5"
            gap={2}
          >
            <Typography color="textSecondary" variant="h6">
              No trip data available
            </Typography>
            <Typography color="textSecondary">
              Click the "Play" button to start the simulation
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Extract routes from trip events
  const routes = tripEvents.map((trip, index) => {
    const locationEvents = trip.events.filter(e => 
      e.event_type === 'location_ping' && 
      e.location && 
      e.location.lat && 
      e.location.lng
    );

    console.log(`Trip ${index + 1} (${trip.tripName}): ${locationEvents.length} location points`);

    const coordinates = locationEvents.map(e => [e.location.lat, e.location.lng]);
    
    return {
      tripName: trip.tripName,
      coordinates: coordinates,
      color: tripColors[index % tripColors.length],
      currentPosition: coordinates[coordinates.length - 1],
      totalPoints: locationEvents.length
    };
  }).filter(route => route.coordinates.length > 0);

  console.log('Routes prepared for map:', routes.length);
  console.groupEnd();

  // Default center (US center)
  const defaultCenter = [39.8283, -98.5795];
  const mapCenter = routes.length > 0 && routes[0].coordinates.length > 0 
    ? routes[0].coordinates[0] 
    : defaultCenter;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Fleet Map - Real-Time Tracking</Typography>
        <Box sx={{ height: { xs: 400, md: 500 }, width: '100%', position: 'relative' }}>
          <MapContainer
            center={mapCenter}
            zoom={5}
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapBoundsHandler routes={routes} />

            {/* Draw routes for each trip */}
            {routes.map((route, index) => (
              <React.Fragment key={index}>
                {/* Route polyline */}
                <Polyline
                  positions={route.coordinates}
                  color={route.color}
                  weight={3}
                  opacity={0.7}
                />

                {/* Start marker */}
                {route.coordinates.length > 0 && (
                  <Marker 
                    position={route.coordinates[0]}
                    icon={createColoredIcon(route.color)}
                  >
                    <Popup>
                      <strong>{route.tripName}</strong><br />
                      Start Point<br />
                      Points tracked: {route.totalPoints}
                    </Popup>
                  </Marker>
                )}

                {/* Current position marker */}
                {route.currentPosition && (
                  <Marker 
                    position={route.currentPosition}
                    icon={L.divIcon({
                      className: 'current-position-marker',
                      html: `<div style="background-color: ${route.color}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${route.color};"></div>`,
                      iconSize: [15, 15],
                      iconAnchor: [7, 7]
                    })}
                  >
                    <Popup>
                      <strong>{route.tripName}</strong><br />
                      Current Position<br />
                      Points tracked: {route.totalPoints}
                    </Popup>
                  </Marker>
                )}
              </React.Fragment>
            ))}
          </MapContainer>
        </Box>

        {/* Map Legend */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {routes.map((route, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 20,
                  height: 4,
                  bgcolor: route.color,
                  borderRadius: 1
                }}
              />
              <Typography variant="body2">{route.tripName}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default FleetMap;
