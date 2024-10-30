import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Card, Box } from '@mui/material';
import api from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { username, password });
      alert(response.data.message);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error logging in:', error);
      alert(error.response.data.error);
    }
  };

  const redirectToSignUp = () => {
    window.location.href = '/signup';
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ padding: '30px', borderRadius: '15px', backgroundColor: '#1d1d1d', boxShadow: '0px 4px 15px rgba(0,0,0,0.5)' }}>
        <Box textAlign="center">
          <Typography variant="h4" style={{ marginBottom: '20px', color: '#90caf9' }}>Login</Typography>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ backgroundColor: '#2b2b2b', borderRadius: '5px' }}
            InputProps={{ style: { color: '#ffffff' } }}
            InputLabelProps={{ style: { color: '#b0bec5' } }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ backgroundColor: '#2b2b2b', borderRadius: '5px' }}
            InputProps={{ style: { color: '#ffffff' } }}
            InputLabelProps={{ style: { color: '#b0bec5' } }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            style={{ marginTop: '20px', padding: '10px', fontWeight: 'bold', borderRadius: '5px' }}
          >
            Login
          </Button>
          <Typography variant="body2" style={{ marginTop: '20px', color: '#b0bec5' }}>
            Don't have an account?
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={redirectToSignUp}
            style={{ marginTop: '10px', padding: '10px', fontWeight: 'bold', borderRadius: '5px' }}
          >
            Sign Up
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default Login;
