import React, { useState, useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4'; 
import Brightness7Icon from '@mui/icons-material/Brightness7'; 
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useTheme } from '../../context/ThemeContext';
import { sendChatMessage } from '../../services/AxiosSupport';
import { 
  TextField, 
  Button, 
  Box, 
  Typography,
  Paper,
  Zoom,
  CircularProgress
} from '@mui/material';

// This component is a floating button that toggles the theme
const FloatingButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  boxShadow: theme.shadows[4],
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
  },
  zIndex: 1300,
  width: 50,
  height: 50,
}));

// Floating button for customer support
const ChatButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 80,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  boxShadow: theme.shadows[4],
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
  },
  zIndex: 1300,
  width: 50,
  height: 50,
}));

// Floating chat container that expands from the button position
const FloatingChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 80,
  right: 20,
  width: '350px',
  height: '450px',
  borderRadius: '12px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[8],
  zIndex: 1299,
  transformOrigin: 'bottom right'
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  height: '330px',
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  flexGrow: 1
}));

const Message = styled(Paper)(({ theme, isuser }) => ({
  padding: theme.spacing(1, 2),
  maxWidth: '75%',
  borderRadius: 16,
  alignSelf: isuser === 'true' ? 'flex-end' : 'flex-start',
  backgroundColor: isuser === 'true' 
    ? theme.palette.primary.main 
    : theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
  color: isuser === 'true' 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary
}));

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Hello! I\'m BankBot, your banking assistant. How can I help you today?', isUser: false }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };
  
  const handleSendMessage = async () => {
    if (message.trim() === '' || loading) return;
    
    // Add user message to UI immediately
    const userMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    // Store message before clearing input
    const userInput = message;
    setMessage('');
    setLoading(true);
    
    try {
      // Send message to backend and get response
      const botResponse = await sendChatMessage(userInput);
      
      // Add bot response to messages
      setMessages(prev => [...prev, { 
        text: botResponse,
        isUser: false
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to my systems right now. Please try again in a moment.",
        isUser: false,
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <>
      <ChatButton 
        onClick={handleChatToggle} 
        color="inherit" 
        aria-label="customer support"
        size="large"
      >
        {chatOpen ? <CloseIcon /> : <ChatIcon />}
      </ChatButton>
      
      <FloatingButton 
        onClick={toggleTheme} 
        color="inherit" 
        aria-label="toggle theme"
        size="large"
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </FloatingButton>
      
      <Zoom in={chatOpen} style={{ transformOrigin: 'bottom right' }}>
        <FloatingChatContainer>
          <ChatHeader>
            <Typography variant="h6">Banking Assistant</Typography>
            <IconButton onClick={handleChatToggle} size="small">
              <CloseIcon />
            </IconButton>
          </ChatHeader>
          
          <MessageContainer>
            {messages.map((msg, index) => (
              <Message 
                key={index} 
                isuser={msg.isUser ? 'true' : 'false'}
                sx={msg.isError ? { bgcolor: 'error.light', color: 'error.contrastText' } : {}}
              >
                {msg.text}
              </Message>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </MessageContainer>
          
          <Box sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider', 
            display: 'flex', 
            gap: 1 
          }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
              disabled={loading}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSendMessage}
              disabled={loading || message.trim() === ''}
            >
              Send
            </Button>
          </Box>
        </FloatingChatContainer>
      </Zoom>
    </>
  );
};

export default ThemeToggle;