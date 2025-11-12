// utils/aiInsights.js - ENHANCED FUTURISTIC VERSION
export const generateAIInsights = (fleetMetrics, filteredTrips) => {
  // Calculate detailed statistics
  const trips = filteredTrips.flatMap(trip => trip.events || trip.data || []);
  
  // Battery analysis
  const batteryLevels = trips
    .filter(e => e.device?.battery_level)
    .map(e => e.device.battery_level);
  const avgBattery = batteryLevels.length > 0 
    ? (batteryLevels.reduce((sum, b) => sum + b, 0) / batteryLevels.length).toFixed(1)
    : 95.6;
  
  
  
  // Calculate TTE for ALL vehicles
  const vehicleTTE = filteredTrips.map((trip, index) => {
    const tripEvents = trip.events || trip.data || [];
    const vehicleBatteries = tripEvents
      .filter(e => e.device?.battery_level)
      .map(e => e.device.battery_level);
    const vehicleSpeeds = tripEvents
      .filter(e => e.movement?.speed_kmh)
      .map(e => e.movement.speed_kmh);
    
    const vehBattery = vehicleBatteries.length > 0
      ? vehicleBatteries[vehicleBatteries.length - 1]
      : 95.6;
    const vehSpeed = vehicleSpeeds.length > 0
      ? (vehicleSpeeds.reduce((s, v) => s + v, 0) / vehicleSpeeds.length).toFixed(1)
      : 50;
    
    // TTE calculation: Assume 1% battery = 5 km range
    const remainingRange = (vehBattery * 5);
    const tte = vehSpeed > 0 ? (remainingRange / parseFloat(vehSpeed)).toFixed(1) : 0;
    const range = remainingRange.toFixed(0);
    
    return {
      vehicle: trip.tripName || `Vehicle ${index + 1}`,
      battery: vehBattery,
      speed: vehSpeed,
      tte: parseFloat(tte),
      range: parseFloat(range)
    };
  });
  
  // Calculate fleet-wide TTE
  const fleetAvgTTE = vehicleTTE.length > 0
    ? (vehicleTTE.reduce((sum, v) => sum + v.tte, 0) / vehicleTTE.length).toFixed(1)
    : 5.8;
  const fleetAvgRange = vehicleTTE.length > 0
    ? (vehicleTTE.reduce((sum, v) => sum + v.range, 0) / vehicleTTE.length).toFixed(0)
    : 223;
  
  // Predictive insights
  const lowBatteryCount = vehicleTTE.filter(v => v.battery < 30).length;
  const highSpeedCount = vehicleTTE.filter(v => v.speed > 80).length;
  const criticalTTE = vehicleTTE.filter(v => v.tte < 2).length;
  
  // Efficiency score (0-100)
  const efficiencyScore = Math.min(100, Math.round(
    (avgBattery / 100) * 40 + 
    (1 - (highSpeedCount / vehicleTTE.length)) * 30 + 
    (1 - (lowBatteryCount / vehicleTTE.length)) * 30
  ));
  
  // Predicted maintenance needs
  const maintenanceDue = vehicleTTE.filter(v => v.range > 400 || v.battery < 20).length;
  
  return {
    totalVehicles: fleetMetrics.totalVehicles,
    activeTrips: fleetMetrics.activeTrips,
    totalDistance: fleetMetrics.totalDistance,
    avgSpeed: fleetMetrics.avgSpeed,
    avgBattery: avgBattery,
    tte: fleetAvgTTE,
    range: fleetAvgRange,
    vehicleTTE: vehicleTTE, // Individual vehicle data
    efficiencyScore: efficiencyScore,
    lowBatteryCount: lowBatteryCount,
    highSpeedCount: highSpeedCount,
    criticalTTE: criticalTTE,
    maintenanceDue: maintenanceDue
  };
};
