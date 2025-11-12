// components/Dashboard/SimulationControls.jsx - SAME COLOR FOR FAST FORWARD
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Replay,
  FastForward,
} from '@mui/icons-material';

const SimulationControls = ({
  simulationTime,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onFastForward,
  onSpeedChange,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          gap={1.5}
          flexWrap="wrap"
        >
          {/* Timestamp with Tooltip */}
          {simulationTime && (
            <Tooltip title="Current Simulation Time" arrow placement="bottom">
              <Chip
                label={simulationTime.toLocaleString()}
                size="small"
                sx={{
                  bgcolor: isDark ? 'rgba(144, 202, 249, 0.15)' : 'rgba(25, 118, 210, 0.1)',
                  color: isDark ? '#90caf9' : '#1565c0',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(144, 202, 249, 0.3)' : 'rgba(25, 118, 210, 0.2)',
                  cursor: 'default',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.15)',
                  }
                }}
              />
            </Tooltip>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Main Controls with Tooltips */}
          <ButtonGroup variant="contained" size="small">
            <Tooltip title="Start Simulation" arrow>
              <span>
                <Button onClick={onPlay} disabled={isPlaying} sx={{ minWidth: 36 }}>
                  <PlayArrow fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            
            <Tooltip title="Pause Simulation" arrow>
              <span>
                <Button onClick={onPause} disabled={!isPlaying} sx={{ minWidth: 36 }}>
                  <Pause fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            
            <Tooltip title="Reset to Beginning" arrow>
              <Button onClick={onReset} sx={{ minWidth: 36 }}>
                <Replay fontSize="small" />
              </Button>
            </Tooltip>
            
            <Tooltip title="Fast Forward 1 Hour" arrow>
              <Button 
                onClick={onFastForward}
                sx={{ minWidth: 36 }}
              >
                <FastForward fontSize="small" />
              </Button>
            </Tooltip>
          </ButtonGroup>

          {/* Speed Controls */}
          <ButtonGroup variant="outlined" size="small">
            {[1, 5, 10, 50].map((s) => (
              <Tooltip key={s} title={`${s}x Speed`} arrow>
                <Button
                  onClick={() => onSpeedChange(s)}
                  variant={speed === s ? 'contained' : 'outlined'}
                  sx={{ minWidth: 40 }}
                >
                  {s}x
                </Button>
              </Tooltip>
            ))}
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
