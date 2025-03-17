import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid,Button, Box } from '@mui/material';
import StudentView from './StudentView';
import ProfessorView from './ProfessorView';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      // Redirect to login if no user is logged in
      window.location.href = '/';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Container maxWidth="lg">
      {user && (
        <>
          
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>

          <Typography variant="h3" align="center" style={{ margin: '40px 0' }}>
            Welcome, {user.username}
          </Typography>

          <Grid container spacing={3}>
            {user.role === 'student' ? <StudentView /> : <ProfessorView />}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
