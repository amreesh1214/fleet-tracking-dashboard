// Example: SpeedOverTimeChart.jsx - OPTIMIZED
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const SpeedOverTimeChart = ({ data }) => {
  return (
    <Paper sx={{ 
      p: 2, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Typography variant="h6" sx={{ fontSize: '0.95rem', mb: 1, fontWeight: 600 }}>
        Speed Over Time
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              style={{ fontSize: '0.7rem' }}
              tick={{ fill: '#666' }}
            />
            <YAxis 
              stroke="#666"
              style={{ fontSize: '0.7rem' }}
              tick={{ fill: '#666' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
            <Line 
              type="monotone" 
              dataKey="speed" 
              stroke="#1976d2" 
              strokeWidth={2}
              dot={false}
              name="Speed (km/h)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SpeedOverTimeChart;
