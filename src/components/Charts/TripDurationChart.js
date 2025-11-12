// components/Charts/TripDurationChart.jsx - FIXED
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';

const TripDurationChart = ({ data }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1, fontWeight: 600 }}>
        Trip Duration (Hours)
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#e0e0e0'} />
            <XAxis 
              dataKey="trip" 
              stroke={theme.palette.text.secondary}
              style={{ fontSize: '0.7rem' }}
              tick={{ fill: theme.palette.text.secondary }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              style={{ fontSize: '0.75rem' }}
              tick={{ fill: theme.palette.text.secondary }}
              label={{ 
                value: 'Hours', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: theme.palette.text.secondary, fontSize: '0.8rem' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper, 
                border: `1px solid ${isDark ? '#444' : '#ddd'}`,
                borderRadius: '8px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
            <Bar 
              dataKey="duration" 
              fill={theme.palette.info.main}
              radius={[8, 8, 0, 0]}
              name="Duration (hrs)"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TripDurationChart;
    