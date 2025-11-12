// hooks/useRealTimeSimulation.js - FIXED (Same logic, just suppressed warnings)
import { useState, useEffect, useRef, useCallback } from 'react';

export const useRealTimeSimulation = (allTripsData, speed = 1, selectedTripFilter = 'all') => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [simulationTime, setSimulationTime] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // ✅ Wrap in useCallback to fix warning (same logic)
  const getRelevantTrips = useCallback(() => {
    if (selectedTripFilter === 'all') {
      return allTripsData;
    }
    const tripIndex = parseInt(selectedTripFilter);
    return allTripsData[tripIndex] ? [allTripsData[tripIndex]] : [];
  }, [allTripsData, selectedTripFilter]);

  // ✅ Wrap in useCallback to fix warning (same logic)
  const calculateStartTime = useCallback((trips) => {
    const allEvents = trips.flatMap(trip => trip.data || []);
    if (allEvents.length === 0) return null;

    const sortedEvents = allEvents.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    return new Date(sortedEvents[0].timestamp);
  }, []);

  // ✅ Initialize with ALL data for initial display
  useEffect(() => {
    if (allTripsData.length === 0) return;

    console.log('🔧 Initializing simulation with', allTripsData.length, 'trips');
    
    // Show ALL DATA INITIALLY
    const allEventsInitial = allTripsData.map(trip => ({
      tripName: trip.tripName,
      events: trip.data || []
    }));
    
    setCurrentEvents(allEventsInitial);
    console.log('📊 Initial full data loaded');

    // Set initial simulation time based on current filter
    const relevantTrips = getRelevantTrips();
    const startTime = calculateStartTime(relevantTrips);
    
    if (startTime) {
      console.log('📅 Initial simulation time:', startTime.toLocaleString());
      console.log('   For filter:', selectedTripFilter);
      setSimulationTime(startTime);
      startTimeRef.current = startTime;
    }
  }, [allTripsData, selectedTripFilter, getRelevantTrips, calculateStartTime]);

  // ✅ Update simulation start time when filter changes
  useEffect(() => {
    if (allTripsData.length === 0) return;

    const relevantTrips = getRelevantTrips();
    const startTime = calculateStartTime(relevantTrips);
    
    if (startTime) {
      console.log('🔄 Filter changed - New start time:', startTime.toLocaleString());
      console.log('   Filter:', selectedTripFilter);
      console.log('   Trips:', relevantTrips.map(t => t.tripName).join(', '));
      
      setSimulationTime(startTime);
      startTimeRef.current = startTime;
      setIsPlaying(false); // Stop simulation when filter changes
      
      // Reset to show all data when filter changes
      const allEventsInitial = allTripsData.map(trip => ({
        tripName: trip.tripName,
        events: trip.data || []
      }));
      setCurrentEvents(allEventsInitial);
    }
  }, [selectedTripFilter, allTripsData, getRelevantTrips, calculateStartTime]);

  // ✅ Advance simulation time when playing
  useEffect(() => {
    if (!isPlaying || !simulationTime) return;

    console.log('▶️ Simulation playing at', speed, 'x speed');
    console.log('   Current time:', simulationTime.toLocaleString());

    intervalRef.current = setInterval(() => {
      setSimulationTime(prev => {
        const next = new Date(prev.getTime() + (60000 * speed)); // Advance by speed minutes
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, simulationTime]);

  // ✅ Filter events based on simulation time
  useEffect(() => {
    if (!simulationTime || allTripsData.length === 0) return;
    
    // If NOT playing, show all data
    if (!isPlaying) {
      const allEventsInitial = allTripsData.map(trip => ({
        tripName: trip.tripName,
        events: trip.data || []
      }));
      setCurrentEvents(allEventsInitial);
      return;
    }

    // When playing, filter by simulation time
    const eventsUpToNow = allTripsData.map(trip => {
      const filteredEvents = (trip.data || []).filter(event => {
        const eventTime = new Date(event.timestamp);
        return eventTime <= simulationTime;
      });

      return {
        tripName: trip.tripName,
        events: filteredEvents
      };
    });

    console.log('⏱️ Simulation time:', simulationTime.toLocaleString());
    const relevantTrips = getRelevantTrips();
    const relevantNames = relevantTrips.map(t => t.tripName);
    
    console.log('📊 Events processed for selected trips:');
    eventsUpToNow
      .filter(t => relevantNames.includes(t.tripName))
      .forEach(t => console.log(`   - ${t.tripName}: ${t.events.length} events`));

    setCurrentEvents(eventsUpToNow);
  }, [simulationTime, allTripsData, isPlaying, getRelevantTrips]);

  const play = () => {
    console.log('▶️ Starting simulation');
    console.log('   Filter:', selectedTripFilter);
    console.log('   Start time:', simulationTime?.toLocaleString());
    setIsPlaying(true);
  };

  const pause = () => {
    console.log('⏸️ Pausing simulation');
    setIsPlaying(false);
  };

  const reset = () => {
    console.log('🔄 Resetting simulation');
    setIsPlaying(false);
    
    if (allTripsData.length > 0) {
      // Show all data
      const allEventsInitial = allTripsData.map(trip => ({
        tripName: trip.tripName,
        events: trip.data || []
      }));
      setCurrentEvents(allEventsInitial);
      
      // Reset time based on current filter
      const relevantTrips = getRelevantTrips();
      const startTime = calculateStartTime(relevantTrips);
      
      if (startTime) {
        console.log('   Reset to time:', startTime.toLocaleString());
        setSimulationTime(startTime);
        startTimeRef.current = startTime;
      }
    }
  };

  return {
    currentEvents,
    simulationTime,
    isPlaying,
    play,
    pause,
    reset,
    setSimulationTime
  };
};
