// utils/dataProcessor.js - FINAL FIX
export const loadAllTrips = async () => {
  console.log('========================================');
  console.log('🚀 LOADING TRIP DATA');
  console.log('========================================');
  
  try {
    const trip1 = require('../data/trip_1_cross_country.json');
    const trip2 = require('../data/trip_2_urban_dense.json');
    const trip3 = require('../data/trip_3_mountain_cancelled.json');
    const trip4 = require('../data/trip_4_southern_technical.json');
    const trip5 = require('../data/trip_5_regional_logistics.json');

    const allTrips = [
      { tripName: 'Cross-Country Long Haul', data: Array.isArray(trip1) ? trip1 : [] },
      { tripName: 'Urban Dense Delivery', data: Array.isArray(trip2) ? trip2 : [] },
      { tripName: 'Mountain Route Cancelled', data: Array.isArray(trip3) ? trip3 : [] },
      { tripName: 'Southern Technical Issues', data: Array.isArray(trip4) ? trip4 : [] },
      { tripName: 'Regional Logistics', data: Array.isArray(trip5) ? trip5 : [] }
    ];

    console.log('✅ Total trips loaded:', allTrips.length);
    return allTrips;
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    return [];
  }
};

export const calculateTripMetrics = (events) => {
  if (!events || events.length === 0) {
    return {
      totalDistance: '0.00',
      avgSpeed: '0.0',
      duration: '0.0',
      alerts: 0,
      status: 'No Data',
      totalEvents: 0,
    };
  }

  let totalDistance = 0;
  let speeds = [];
  let alerts = 0;

  for (let i = 1; i < events.length; i++) {
    const prev = events[i - 1];
    const curr = events[i];

    if (prev.location?.lat && curr.location?.lat) {
      const dist = calculateDistance(
        prev.location.lat,
        prev.location.lng,
        curr.location.lat,
        curr.location.lng
      );
      totalDistance += dist;
    }

    if (curr.movement?.speed_kmh) {
      speeds.push(curr.movement.speed_kmh);
    }

    if (curr.event_type && curr.event_type.includes('alert')) {
      alerts++;
    }
  }

  const avgSpeed = speeds.length > 0
    ? (speeds.reduce((sum, s) => sum + s, 0) / speeds.length).toFixed(1)
    : '0.0';

  const firstEvent = new Date(events[0].timestamp);
  const lastEvent = new Date(events[events.length - 1].timestamp);
  const durationHours = ((lastEvent - firstEvent) / (1000 * 60 * 60)).toFixed(1);

  const lastEventType = events[events.length - 1]?.event_type;
  let status = 'In Progress';
  
  if (lastEventType === 'trip_completed') {
    status = 'Completed';
  } else if (lastEventType === 'trip_cancelled') {
    status = 'Cancelled';
  }

  return {
    totalDistance: totalDistance.toFixed(2),
    avgSpeed,
    duration: durationHours,
    alerts,
    status,
    totalEvents: events.length,
  };
};

// ✅ FIXED: For simulation, count ALL trips with events as "Active"
export const calculateFleetMetrics = (tripsData) => {
  console.log('\n📊 Calculating fleet metrics for', tripsData.length, 'trips');
  
  if (!tripsData || tripsData.length === 0) {
    return {
      totalDistance: '0.00',
      totalVehicles: 0,
      activeTrips: 0,
      completedTrips: 0,
      cancelledTrips: 0,
      avgSpeed: '0.0',
    };
  }
  
  let totalDistance = 0;
  let totalVehicles = tripsData.length;
  let activeTrips = 0;
  let completedTrips = 0;
  let cancelledTrips = 0;
  let totalSpeed = 0;
  let speedCount = 0;

  tripsData.forEach((trip, index) => {
    const events = trip.data || trip.events || [];
    
    if (events.length === 0) {
      return;
    }

    const tripMetrics = calculateTripMetrics(events);
    
    totalDistance += parseFloat(tripMetrics.totalDistance) || 0;
    
    if (tripMetrics.avgSpeed && parseFloat(tripMetrics.avgSpeed) > 0) {
      totalSpeed += parseFloat(tripMetrics.avgSpeed);
      speedCount++;
    }

    // ✅ KEY FIX: For dashboard, count as "active" if trip has events and NOT cancelled
    // This makes sense for a simulation dashboard showing trip data
    if (tripMetrics.status === 'Cancelled') {
      cancelledTrips++;
    } else {
      // Count completed and in-progress trips as "active" in the simulation
      activeTrips++;
      if (tripMetrics.status === 'Completed') {
        completedTrips++;
      }
    }
  });

  const avgSpeed = speedCount > 0 ? (totalSpeed / speedCount).toFixed(1) : '0.0';

  console.log('✅ Active Trips (simulated):', activeTrips, '| Cancelled:', cancelledTrips);

  return {
    totalDistance: totalDistance.toFixed(2),
    totalVehicles,
    activeTrips, // Now shows 4 (all non-cancelled trips)
    completedTrips,
    cancelledTrips,
    avgSpeed,
  };
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
