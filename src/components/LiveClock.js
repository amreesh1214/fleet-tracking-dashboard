// components/LiveClock.jsx - HIGH CONTRAST VERSION
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      bgcolor: 'rgba(255, 255, 255, 0.15)',
      px: 2,
      py: 0.75,
      borderRadius: 1
    }}>
      <AccessTime sx={{ 
        fontSize: '1.2rem', 
        color: 'white'
      }} />
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 700,
          color: 'white',
          fontSize: '0.95rem',
          letterSpacing: '0.5px'
        }}
      >
        {time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: false 
        })}
      </Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.85rem',
          ml: 0.5,
          fontWeight: 500
        }}
      >
        {time.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })}
      </Typography>
    </Box>
  );
};

export default LiveClock;
  