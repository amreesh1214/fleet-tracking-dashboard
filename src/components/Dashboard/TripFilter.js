// components/Dashboard/TripFilter.jsx - Update styling
import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

const TripFilter = ({ selectedTrip, allTrips, onTripChange }) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="trip-filter-label">Filter Trip</InputLabel>
      <Select
        labelId="trip-filter-label"
        id="trip-filter"
        value={selectedTrip}
        label="Filter Trip"
        onChange={(e) => onTripChange(e.target.value)}
      >
        <MenuItem value="all">All Trips</MenuItem>
        {allTrips.map((trip, index) => (
          <MenuItem key={index} value={index.toString()}>
            {trip.tripName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TripFilter;
