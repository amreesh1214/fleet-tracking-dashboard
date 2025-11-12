// components/Dashboard/MetricCard.jsx - REMOVE LIVE BADGE
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MetricCard = ({ title, value, color }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        minHeight: 120,
        position: 'relative',
        boxShadow: 2,
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease',
        }
      }}
    >
      <CardContent sx={{ pt: 2, pb: 2 }}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          {/* Title */}
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.75rem',
              fontWeight: 500,
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>
          
          {/* Value */}
          <Typography 
            variant="h4" 
            sx={{ 
              color, 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2rem' }
            }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
