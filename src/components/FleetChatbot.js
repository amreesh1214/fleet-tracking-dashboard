// components/FleetChatbot.jsx - FIXED RESPONSES
import React, { useState } from 'react';
import { 
  Box, 
  Fab, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Badge,
  Tooltip,
  useTheme,
  keyframes
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Send as SendIcon,
  SmartToy as RobotIcon
} from '@mui/icons-material';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
`;

// Enhanced smart response
function getEnhancedResponse(question, allTrips, fleetMetrics) {
  const q = question.toLowerCase()
    .replace(/[?!.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Calculate stats
  const trips = allTrips.flatMap(trip => trip.data || trip.events || []);
  const batteryLevels = trips
    .filter(e => e.device?.battery_level)
    .map(e => e.device.battery_level);
  const avgBattery = batteryLevels.length > 0 
    ? (batteryLevels.reduce((sum, b) => sum + b, 0) / batteryLevels.length).toFixed(1)
    : 'N/A';
  const minBattery = batteryLevels.length > 0 ? Math.min(...batteryLevels).toFixed(1) : 'N/A';
  const maxBattery = batteryLevels.length > 0 ? Math.max(...batteryLevels).toFixed(1) : 'N/A';
  
  const signalQuality = {};
  trips.forEach(e => {
    if (e.signal_quality) signalQuality[e.signal_quality] = (signalQuality[e.signal_quality] || 0) + 1;
  });
  
  // Check for keywords
  const has = (words) => words.some(w => q.includes(w));
  
  // Vehicle count questions
  if (has(['vehicle', 'car', 'truck', 'fleet']) && has(['how many', 'count', 'number', 'total'])) {
    if (has(['active', 'running', 'moving', 'working'])) {
      return `🚗 **${fleetMetrics.activeTrips} out of ${fleetMetrics.totalVehicles} vehicles** are currently active.\n\n✅ That's **${((fleetMetrics.activeTrips / fleetMetrics.totalVehicles) * 100).toFixed(0)}%** of your fleet on the move!`;
    }
    return `🚗 **Total Vehicles: ${fleetMetrics.totalVehicles}**\n✅ Active: ${fleetMetrics.activeTrips}\n📦 Available: ${fleetMetrics.totalVehicles - fleetMetrics.activeTrips}`;
  }
  
  // Distance questions - FIXED
  if (has(['distance', 'km', 'kilometer', 'far', 'travel', 'cover', 'driven'])) {
    const perVehicle = (parseFloat(fleetMetrics.totalDistance) / fleetMetrics.totalVehicles).toFixed(2);
    return `📏 **Total Distance Covered**\n\n🚀 Fleet Total: **${fleetMetrics.totalDistance} km**\n📊 Average per Vehicle: **${perVehicle} km**\n\nYour fleet has traveled a combined distance of ${fleetMetrics.totalDistance} kilometers!`;
  }
  
  // Speed questions
  if (has(['speed', 'fast', 'velocity', 'pace'])) {
    return `⚡ **Fleet Speed Statistics**\n\n📊 Average Speed: **${fleetMetrics.avgSpeed} km/h**\n\nYour fleet is maintaining an average speed of ${fleetMetrics.avgSpeed} km/h across all active trips.`;
  }
  
  // Battery questions
  if (has(['battery', 'charge', 'power', 'energy'])) {
    const lowBattery = batteryLevels.filter(b => b < 30).length;
    return `🔋 **Battery Health Report**\n\n• Average: **${avgBattery}%**\n• Highest: **${maxBattery}%**\n• Lowest: **${minBattery}%**\n• Total Readings: ${batteryLevels.length}\n• ⚠️ Low Battery (<30%): ${lowBattery} vehicle${lowBattery !== 1 ? 's' : ''}\n\n${lowBattery > 0 ? '🔌 Some vehicles need charging soon!' : '✅ All batteries are healthy!'}`;
  }
  
  // Signal questions
  if (has(['signal', 'connection', 'network', 'connectivity'])) {
    const total = Object.values(signalQuality).reduce((sum, val) => sum + val, 0);
    const excellent = ((signalQuality.excellent || 0) / total * 100).toFixed(1);
    return `📡 **Network Signal Quality**\n\n${Object.entries(signalQuality)
      .map(([quality, count]) => `• ${quality.charAt(0).toUpperCase() + quality.slice(1)}: ${count} events (${(count/total*100).toFixed(1)}%)`)
      .join('\n')}\n\n${parseFloat(excellent) > 50 ? '✅ Excellent network coverage!' : '⚠️ Consider optimizing signal coverage.'}`;
  }
  
  // Trip names
  if (has(['trip', 'name', 'list']) || (has(['show', 'tell', 'what']) && has(['trip']))) {
    return `📋 **Available Trips**\n\n${allTrips.map((t, i) => `${i + 1}. ${t.tripName}`).join('\n')}\n\n📊 Total: **${allTrips.length} trips**`;
  }
  
  // Status/Overview - FIXED
  if (has(['status', 'overview', 'summary', 'report', 'dashboard', 'all'])) {
    return `📊 **Complete Fleet Overview**\n\n🚗 Total Vehicles: **${fleetMetrics.totalVehicles}**\n✅ Active Trips: **${fleetMetrics.activeTrips}**\n📏 Total Distance: **${fleetMetrics.totalDistance} km**\n⚡ Avg Speed: **${fleetMetrics.avgSpeed} km/h**\n🔋 Avg Battery: **${avgBattery}%**\n📡 Network: **${Object.keys(signalQuality).length > 0 ? 'Connected' : 'Unknown'}**\n\n✨ Your fleet is operating smoothly!`;
  }
  
  // Greetings
  if (has(['hi', 'hello', 'hey', 'greet', 'hola', 'start'])) {
    return `👋 Hello! I'm your **Fleet AI Assistant**.\n\nI can help you with:\n✅ Vehicle counts & status\n✅ Distance covered & analytics\n✅ Battery health monitoring\n✅ Speed statistics\n✅ Signal quality reports\n\nJust ask me in plain English! Try:\n• "How many vehicles are active?"\n• "What's the total distance?"\n• "Show me fleet overview"`;
  }
  
  // Help/default
  return `🤖 **I can help you with:**\n\n✅ Vehicle status & counts\n✅ Distance & trip analytics\n✅ Battery monitoring\n✅ Speed statistics\n✅ Signal quality\n✅ Fleet overview\n\n💡 Try asking:\n• "total distance covered"\n• "fleet overview"\n• "battery status"\n• "how many active vehicles"`;
}

const FleetChatbot = ({ allTrips, fleetMetrics }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 **Hi! I\'m your Fleet AI Assistant.**\n\nI\'m here to help you monitor and analyze your fleet in real-time.\n\n💡 You can ask me:\n• "How many vehicles are active?"\n• "What\'s the total distance?"\n• "Show me fleet overview"\n• "Battery status"\n\nGo ahead, ask me anything!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const suggestedQuestions = [
    "How many vehicles are active?",
    "What's the total distance?",
    "Show me fleet overview",
    "Battery status",
    "Signal quality"
  ];

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const botReply = getEnhancedResponse(userMessage, allTrips, fleetMetrics);
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
      setLoading(false);
    }, 400);
  };

  return (
    <>
      <Tooltip title="🤖 Ask Fleet AI" placement="left" arrow>
        <Badge badgeContent="AI" color="success" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', fontWeight: 700 } }}>
          <Fab
            onClick={() => setOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              animation: `${pulse} 2s infinite`,
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                transform: 'scale(1.1)',
                animation: 'none'
              }
            }}
          >
            <RobotIcon sx={{ fontSize: 30, color: 'white' }} />
          </Fab>
        </Badge>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { height: '600px', display: 'flex', flexDirection: 'column', borderRadius: 2 } }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RobotIcon />
            <Typography variant="h6" fontWeight={600}>Fleet AI Assistant</Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ flex: 1, overflow: 'auto', pt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>💡 Quick Questions:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {suggestedQuestions.map((q, i) => (
                <Chip key={i} label={q} size="small" onClick={() => setInput(q)} sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.main', color: 'white' } }} />
              ))}
            </Box>
          </Box>

          {messages.map((msg, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 1.5 }}>
              <Paper elevation={1} sx={{ p: 1.5, maxWidth: '85%', bgcolor: msg.role === 'user' ? 'primary.main' : theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', color: msg.role === 'user' ? 'white' : theme.palette.text.primary, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
              </Paper>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="caption" color="text.secondary">AI is analyzing...</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <TextField fullWidth variant="outlined" placeholder="Ask about your fleet..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} disabled={loading} size="small" sx={{ mr: 1 }} />
          <Button variant="contained" onClick={sendMessage} disabled={loading || !input.trim()} endIcon={<SendIcon />} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minWidth: 100 }}>Send</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FleetChatbot;
