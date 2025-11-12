// components/Charts/FleetAnalytics.jsx - VERIFY THIS
import React from 'react';
import { Box } from '@mui/material';
import BatteryChart from './BatteryChart';
import AverageSpeedChart from './AverageSpeedChart';
import SpeedOverTimeChart from './SpeedOverTimeChart';
import SignalQualityDonut from './SignalQualityDonut';
import DistanceByTripChart from './DistanceByTripChart';
import { 
  prepareSpeedData, 
  prepareBatteryData,
  prepareAverageSpeedData,
  prepareSignalQualityData,
  prepareDistanceByTripData
} from '../../utils/chartHelpers';

const FleetAnalytics = ({ filteredTrips }) => {
  console.log('🎨 FleetAnalytics rendering with filteredTrips:', filteredTrips.length);
  
  const speedData = prepareSpeedData(filteredTrips);
  const batteryData = prepareBatteryData(filteredTrips);
  const avgSpeedData = prepareAverageSpeedData(filteredTrips);
  const signalQualityData = prepareSignalQualityData(filteredTrips);
  const distanceByTripData = prepareDistanceByTripData(filteredTrips);

  console.log('📊 Average Speed Data:', avgSpeedData);

  return (
    <Box className="analytics-charts-container">
      <Box className="analytics-chart-item">
        <SpeedOverTimeChart data={speedData} />
      </Box>
      <Box className="analytics-chart-item">
        <AverageSpeedChart data={avgSpeedData} />
      </Box>
      <Box className="analytics-chart-item">
        <SignalQualityDonut data={signalQualityData} />
      </Box>
      <Box className="analytics-chart-item">
        <BatteryChart data={batteryData} />
      </Box>
      <Box className="analytics-chart-item">
        <DistanceByTripChart data={distanceByTripData} />
      </Box>
    </Box>
  );
};

export default FleetAnalytics;
