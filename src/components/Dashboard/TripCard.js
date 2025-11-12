// components/Dashboard/TripCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';

const TripCard = ({ tripName, metrics, events }) => {
  if (!metrics) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'In Progress':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          flexWrap="wrap"
          gap={1}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            {tripName}
          </Typography>
          <Chip
            label={metrics.status}
            color={getStatusColor(metrics.status)}
            size="small"
          />
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Distance
            </Typography>
            <Typography variant="body1">{metrics.totalDistance} km</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Avg Speed
            </Typography>
            <Typography variant="body1">{metrics.avgSpeed} km/h</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Duration
            </Typography>
            <Typography variant="body1">{metrics.duration} hrs</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Alerts
            </Typography>
            <Typography variant="body1" color="error">
              {metrics.alerts}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Events Processed
            </Typography>
            <Typography variant="body1">
              {events.length} / {metrics.totalEvents}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TripCard;
