// components/Charts/SignalQualityDonut.jsx - NEW FILE
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';

const SignalQualityDonut = ({ data }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Color mapping for signal quality (traffic light colors)
  const COLORS = {
    'Excellent': '#4caf50',  // Green
    'Good': '#8bc34a',       // Light Green
    'Fair': '#ff9800',       // Orange
    'Poor': '#f44336'        // Red
  };

  // Add colors to data
  const chartData = data.map(item => ({
    ...item,
    fill: COLORS[item.name] || '#9e9e9e'
  }));

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1, fontWeight: 600 }}>
        Signal Quality Distribution
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius="80%"
              innerRadius="50%"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper, 
                border: `1px solid ${isDark ? '#444' : '#ddd'}`,
                borderRadius: '8px'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: '0.85rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SignalQualityDonut;
