// utils/chartHelpers.js - COMPLETE FILE

// ✅ Speed Over Time
export const prepareSpeedData = (currentEvents) => {
  const data = [];
  currentEvents.forEach((trip) => {
    const events = trip.events || trip.data || [];
    events
      .filter((e) => e.movement?.speed_kmh)
      .slice(0, 100)
      .forEach((e) => {
        data.push({
          time: new Date(e.timestamp).toLocaleTimeString(),
          speed: e.movement.speed_kmh,
        });
      });
  });
  return data;
};

// ✅ Battery Level Over Time
export const prepareBatteryData = (currentEvents) => {
  const data = [];
  currentEvents.forEach((trip) => {
    const events = trip.events || trip.data || [];
    events
      .filter((e) => e.device?.battery_level !== undefined)
      .slice(0, 100)
      .forEach((e) => {
        data.push({
          time: new Date(e.timestamp).toLocaleTimeString(),
          battery: e.device.battery_level,
        });
      });
  });
  return data;
};

// ✅ Signal Quality
export const prepareSignalQualityData = (currentEvents) => {
  console.log('📊 Preparing signal quality data...');
  
  const qualityCounts = {
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0,
  };

  let totalEvents = 0;

  currentEvents.forEach((trip) => {
    const events = trip.events || trip.data || [];
    
    console.log(`Processing trip: ${trip.tripName || 'Unknown'} with ${events.length} events`);
    
    events.forEach((e) => {
      if (e.signal_quality) {
        totalEvents++;
        const quality = e.signal_quality.toLowerCase();
        
        if (qualityCounts[quality] !== undefined) {
          qualityCounts[quality]++;
        }
      }
    });
  });

  console.log('📊 Signal Quality Counts:', qualityCounts);
  console.log('📊 Total events with signal data:', totalEvents);

  return [
    { name: 'Excellent', value: qualityCounts.excellent },
    { name: 'Good', value: qualityCounts.good },
    { name: 'Fair', value: qualityCounts.fair },
    { name: 'Poor', value: qualityCounts.poor },
  ];
};

// ✅ Average Speed by Trip
export const prepareAverageSpeedData = (currentEvents) => {
  console.log('📊 Preparing average speed data...');
  console.log('Input events:', currentEvents);
  
  return currentEvents.map((trip) => {
    const events = trip.events || trip.data || [];
    console.log(`Processing trip: ${trip.tripName} with ${events.length} events`);
    
    const speeds = events
      .filter(e => e.movement?.speed_kmh && e.movement.speed_kmh > 0)
      .map(e => e.movement.speed_kmh);
    
    const avgSpeed = speeds.length > 0 
      ? speeds.reduce((sum, s) => sum + s, 0) / speeds.length 
      : 0;
    
    console.log(`  Trip: ${trip.tripName} | Speeds: ${speeds.length} | Avg: ${avgSpeed.toFixed(1)}`);
    
    return {
      trip: trip.tripName ? trip.tripName.split(' ').slice(0, 2).join(' ') : 'Unknown',
      avgSpeed: parseFloat(avgSpeed.toFixed(1)),
    };
  });
};

// ✅ Trip Duration by Hours
export const prepareDurationData = (currentEvents) => {
  return currentEvents.map((trip) => {
    const events = trip.events || trip.data || [];
    
    if (events.length < 2) {
      return {
        trip: trip.tripName ? trip.tripName.split(' ').slice(0, 2).join(' ') : 'Unknown',
        duration: 0,
      };
    }
    
    const firstEvent = new Date(events[0].timestamp);
    const lastEvent = new Date(events[events.length - 1].timestamp);
    const durationHours = (lastEvent - firstEvent) / (1000 * 60 * 60);
    
    return {
      trip: trip.tripName ? trip.tripName.split(' ').slice(0, 2).join(' ') : 'Unknown',
      duration: parseFloat(durationHours.toFixed(1)),
    };
  });
};

// ✅ Distance by Trip
export const prepareDistanceByTripData = (currentEvents) => {
  return currentEvents.map((trip) => {
    const events = trip.events || trip.data || [];
    
    let totalDistance = 0;
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
    }
    
    return {
      trip: trip.tripName ? trip.tripName.split(' ').slice(0, 2).join(' ') : 'Unknown',
      distance: parseFloat(totalDistance.toFixed(2))
    };
  }).filter(item => item.distance > 0);
};

// Helper function for distance calculation
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
