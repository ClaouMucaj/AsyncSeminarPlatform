import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Card, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import api from '../api';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleSignUp = async () => {
    try {
      const response = await api.post('/signup', { username, password, role });
      alert(response.data.message);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing up:', error);
      alert(error.response.data.error);
    }
  };

  const redirectToLogin = () => {
    window.location.href = '/';
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ padding: '30px', borderRadius: '15px', backgroundColor: '#1d1d1d', boxShadow: '0px 4px 15px rgba(0,0,0,0.5)' }}>
        <Box textAlign="center">
          <Typography variant="h4" style={{ marginBottom: '20px', color: '#90caf9' }}>Sign Up</Typography>
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
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel style={{ color: '#b0bec5' }}>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ backgroundColor: '#2b2b2b', color: '#ffffff', borderRadius: '5px' }}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignUp}
            style={{ marginTop: '20px', padding: '10px', fontWeight: 'bold', borderRadius: '5px' }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" style={{ marginTop: '20px', color: '#b0bec5' }}>
            Already have an account?
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={redirectToLogin}
            style={{ marginTop: '10px', padding: '10px', fontWeight: 'bold', borderRadius: '5px' }}
          >
            Back to Login
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default SignUp;
