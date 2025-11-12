import React, { useState } from 'react';
import { Box, Grid, Button, Popover, Typography, Divider, LinearProgress, useTheme } from '@mui/material';
import { 
  AutoAwesome as AIIcon, 
  Timer, 
  SignalCellularAlt,
  TrendingUp,
  Warning,
  CheckCircle,
  Build
} from '@mui/icons-material';
import MetricCard from './MetricCard';
import TripFilter from './TripFilter';
import { generateAIInsights } from '../../utils/aiInsights';
import { prepareSignalQualityData } from '../../utils/chartHelpers';

const FleetMetrics = ({ fleetMetrics, selectedTrip, allTrips, onTripChange, filteredTrips }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleAIClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const aiInsights = generateAIInsights(fleetMetrics, filteredTrips);
  
  // Get signal quality data
  const signalQualityData = prepareSignalQualityData(filteredTrips);
  const totalSignalEvents = signalQualityData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top Row - AI Insights and Trip Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AIIcon />}
          onClick={handleAIClick}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
            }
          }}
        >
          AI Insights
        </Button>

        <Box sx={{ minWidth: 250 }}>
          <TripFilter
            selectedTrip={selectedTrip}
            allTrips={allTrips}
            onTripChange={onTripChange}
          />
        </Box>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total Vehicles" value={fleetMetrics.totalVehicles} color="#2196f3" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Active Trips" value={fleetMetrics.activeTrips} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total Distance (km)" value={fleetMetrics.totalDistance} color="#ff9800" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Avg Speed (km/h)" value={fleetMetrics.avgSpeed || '0'} color="#9c27b0" />
        </Grid>
      </Grid>

      {/* AI Insights Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 3, maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AIIcon color="primary" /> AI-Powered Fleet Insights
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Fleet Efficiency Score */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp /> Fleet Efficiency Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={aiInsights.efficiencyScore} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="h6" fontWeight={700} color="primary">
                {aiInsights.efficiencyScore}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Based on battery health, speed optimization, and overall performance
            </Typography>
          </Box>

          {/* Predictive Alerts */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              ⚠️ Predictive Alerts
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {aiInsights.lowBatteryCount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Warning color="warning" fontSize="small" />
                  <Typography variant="body2">
                    <strong>{aiInsights.lowBatteryCount}</strong> vehicle{aiInsights.lowBatteryCount > 1 ? 's' : ''} need charging soon
                  </Typography>
                </Box>
              )}
              {aiInsights.criticalTTE > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                  <Timer color="error" fontSize="small" />
                  <Typography variant="body2">
                    <strong>{aiInsights.criticalTTE}</strong> vehicle{aiInsights.criticalTTE > 1 ? 's' : ''} critically low on range
                  </Typography>
                </Box>
              )}
              {aiInsights.maintenanceDue > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Build color="info" fontSize="small" />
                  <Typography variant="body2">
                    <strong>{aiInsights.maintenanceDue}</strong> vehicle{aiInsights.maintenanceDue > 1 ? 's' : ''} due for maintenance
                  </Typography>
                </Box>
              )}
              {aiInsights.lowBatteryCount === 0 && aiInsights.criticalTTE === 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">All vehicles operating optimally</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Signal Quality Section */}
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: isDark ? 'rgba(33, 150, 243, 0.15)' : 'rgba(33, 150, 243, 0.1)',
            borderRadius: 1,
            border: '1px solid',
            borderColor: isDark ? '#2196f3' : '#1976d2'
          }}>
            <Typography variant="subtitle2" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: isDark ? '#90caf9' : '#1565c0',
              fontWeight: 600,
              mb: 1.5
            }}>
              <SignalCellularAlt /> Signal Quality Summary
            </Typography>
            {totalSignalEvents === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No signal quality data available
              </Typography>
            ) : (
              <Box>
                {signalQualityData.map((item, index) => {
                  const percentage = totalSignalEvents > 0 ? ((item.value / totalSignalEvents) * 100).toFixed(0) : 0;
                  return (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.primary">
                        {item.name}:
                      </Typography>
                      <Typography variant="body2" fontWeight="600" color="text.primary">
                        {item.value} ({percentage}%)
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* Time to Empty - Fleet-wide */}
          <Box sx={{ 
            mb: 2, 
            p: 2, 
            bgcolor: isDark ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 152, 0, 0.1)',
            borderRadius: 1,
            border: '1px solid',
            borderColor: isDark ? '#ff9800' : '#f57c00'
          }}>
            <Typography variant="subtitle2" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: isDark ? '#ffb74d' : '#e65100',
              fontWeight: 600,
              mb: 1
            }}>
              <Timer /> Time to Empty Forecast (Fleet Average)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              Calculated using battery level, current speed, and estimated range
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', mb: 1.5 }}>
              Battery: <strong>{aiInsights.avgBattery}%</strong> | Speed: <strong>{aiInsights.avgSpeed} km/h</strong>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)', 
                borderRadius: 1, 
                flex: 1, 
                textAlign: 'center' 
              }}>
                <Typography variant="caption" color="text.secondary">Time Remaining</Typography>
                <Typography variant="h6" sx={{ color: isDark ? '#ffb74d' : '#e65100', fontWeight: 700 }}>
                  {aiInsights.tte} hrs
                </Typography>
              </Box>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)', 
                borderRadius: 1, 
                flex: 1, 
                textAlign: 'center' 
              }}>
                <Typography variant="caption" color="text.secondary">Range</Typography>
                <Typography variant="h6" sx={{ color: isDark ? '#ffb74d' : '#e65100', fontWeight: 700 }}>
                  {aiInsights.range} km
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            🚦 AI-powered insights update in real-time based on fleet performance
          </Typography>
        </Box>
      </Popover>
    </Box>
  );
};

export default FleetMetrics;
