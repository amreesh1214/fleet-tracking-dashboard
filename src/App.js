// App.js - CORRECTED VERSION
import React, { useState, useEffect } from 'react';
import './App.css';
import {
  AppBar,
  Toolbar,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Button,
  ButtonGroup,
  Tooltip,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Map as MapIcon,
  BarChart as AnalyticsIcon,
} from '@mui/icons-material';

// Theme
import { getTheme } from './theme';

// Components
import LiveClock from './components/LiveClock';
import SimulationControls from './components/Dashboard/SimulationControls';
import FleetMetrics from './components/Dashboard/FleetMetrics';
import TripCard from './components/Dashboard/TripCard';
import FleetMap from './components/Maps/FleetMap';
import FleetAnalytics from './components/Charts/FleetAnalytics';
import FleetChatbot from './components/FleetChatbot';


// Utils & Hooks
import {
  loadAllTrips,
  calculateTripMetrics,
  calculateFleetMetrics,
} from './utils/dataProcessor';
import { useRealTimeSimulation } from './hooks/useRealTimeSimulation';

function App() {
  // State
  const [allTrips, setAllTrips] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState("all");
// App.js - Change initial theme
const [themeMode, setThemeMode] = useState("light"); // ✅ Changed from "dark" to "light"
  const [viewMode, setViewMode] = useState("map");

  const theme = getTheme(themeMode);

  const {
    currentEvents,
    simulationTime,
    isPlaying,
    play,
    pause,
    reset,
    setSimulationTime,
  } = useRealTimeSimulation(allTrips, speed, selectedTrip);

  // Load trip data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Starting to load trip data...");
        const trips = await loadAllTrips();
        console.log("Trips loaded:", trips);

        if (trips.length === 0) {
          setError("No trip data loaded. Please check your JSON files.");
        } else {
          setAllTrips(trips);
          console.log("All trips set in state:", trips.length);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(`Failed to load trip data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Fast Forward Function
  const fastForward = () => {
    if (simulationTime && allTrips.length > 0 && setSimulationTime) {
      const newTime = new Date(simulationTime.getTime() + 3600000);
      console.log("⏩ Fast forwarding to:", newTime.toLocaleString());
      setSimulationTime(newTime);
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Toggle View
  const toggleView = (mode) => {
    setViewMode(mode);
  };

  // Loading State
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="loading-container">
          <CircularProgress size={60} />
          <Typography variant="h5" style={{ marginTop: "16px" }}>
            Loading Fleet Data...
          </Typography>
        </div>
      </ThemeProvider>
    );
  }

  // Error State
  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="error-container">
          <Alert severity="error" style={{ maxWidth: 600 }}>
            <Typography variant="h6">Error Loading Data</Typography>
            <Typography>{error}</Typography>
          </Alert>
        </div>
      </ThemeProvider>
    );
  }

  // Filter trips
  const filteredTrips =
    selectedTrip === "all"
      ? currentEvents
      : currentEvents.filter((_, index) => index === parseInt(selectedTrip));

  // ✅ FIX: Convert filteredTrips format correctly for calculateFleetMetrics
  const tripsForMetrics = filteredTrips.map((trip) => ({
    tripName: trip.tripName,
    data: trip.events || [] // Use 'data' property, get from 'events'
  }));

  console.log('🔧 Trips for metrics:', tripsForMetrics.length);
  tripsForMetrics.forEach((trip, i) => {
    console.log(`  Trip ${i + 1}: ${trip.tripName} - ${trip.data.length} events`);
  });

  const fleetMetrics = calculateFleetMetrics(tripsForMetrics);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        {/* App Bar */}
        <AppBar position="sticky" className="app-bar">
          <Toolbar>
            <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
              Fleet Tracking Dashboard
            </Typography>

            {/* View Mode Toggle */}
            <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
              <Button
                startIcon={<MapIcon />}
                onClick={() => toggleView("map")}
                sx={{
                  bgcolor: viewMode === "map" ? "primary.main" : "transparent",
                  color: viewMode === "map" ? "primary.contrastText" : "text.primary",
                  borderColor: viewMode === "map" ? "primary.main" : "divider",
                  "&:hover": {
                    bgcolor: viewMode === "map" ? "primary.dark" : "action.hover",
                  },
                }}
              >
                Live Tracking
              </Button>
              <Button
                startIcon={<AnalyticsIcon />}
                onClick={() => toggleView("analytics")}
                sx={{
                  bgcolor: viewMode === "analytics" ? "primary.main" : "transparent",
                  color: viewMode === "analytics" ? "primary.contrastText" : "text.primary",
                  borderColor: viewMode === "analytics" ? "primary.main" : "divider",
                  "&:hover": {
                    bgcolor: viewMode === "analytics" ? "primary.dark" : "action.hover",
                  },
                }}
              >
                Analytics
              </Button>
            </ButtonGroup>

            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}>
              <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 2 }}>
                {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <LiveClock />
          </Toolbar>
        </AppBar>

        <div className="main-content">
          {/* Fleet Metrics - Always visible */}
          <FleetMetrics
            fleetMetrics={fleetMetrics}
            selectedTrip={selectedTrip}
            allTrips={allTrips}
            onTripChange={setSelectedTrip}
            filteredTrips={filteredTrips}
          />

          {/* Conditional View Rendering */}
          {viewMode === "map" ? (
            /* MAP VIEW */
            <div className="map-view-container">
              <div className="section controls-section">
                <SimulationControls
                  simulationTime={simulationTime}
                  isPlaying={isPlaying}
                  speed={speed}
                  onPlay={play}
                  onPause={pause}
                  onReset={reset}
                  onFastForward={fastForward}
                  onSpeedChange={setSpeed}
                />
              </div>

              <div className="section map-section">
                <FleetMap tripEvents={filteredTrips} height={600} />
              </div>

              <div className="section trips-section">
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  Individual Trip Status
                </Typography>
                {filteredTrips.length === 0 ? (
                  <Alert severity="warning">
                    No trip data available. Click Play to start simulation.
                  </Alert>
                ) : (
                  <div className="trips-grid">
                    {filteredTrips.map((trip, index) => {
                      const metrics = calculateTripMetrics(trip.events);
                      return (
                        <div key={index} className="trip-card-wrapper">
                          <TripCard
                            tripName={trip.tripName}
                            metrics={metrics}
                            events={trip.events}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ANALYTICS VIEW */
            <div className="analytics-view-container">
              <FleetAnalytics filteredTrips={filteredTrips} />
            </div>
          )}
        </div>
        <FleetChatbot
  allTrips={allTrips}
  fleetMetrics={fleetMetrics}
/>
      </div>
    </ThemeProvider>
  );
}

export default App;
