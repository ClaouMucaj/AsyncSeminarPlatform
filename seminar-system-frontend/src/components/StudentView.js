import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Container, Grid, CardMedia, Button, Box } from '@mui/material';
import api from '../api';

const StudentView = () => {
  const [seminars, setSeminars] = useState([]);
  const [user, setUser] = useState(null);
  const [purchasedSeminars, setPurchasedSeminars] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);

    const fetchSeminars = async () => {
      try {
        const response = await api.get('/seminars');
        setSeminars(response.data);
      } catch (error) {
        console.error('Error fetching seminars:', error);
      }
    };

    const fetchPurchasedSeminars = async () => {
      if (loggedInUser) {
        try {
          const response = await api.get(`/user/${loggedInUser.id}/purchases`);
          setPurchasedSeminars(response.data.map(purchase => purchase.seminar_id));
        } catch (error) {
          console.error("Error fetching purchased seminars:", error);
        }
      }
    };

    fetchSeminars();
    fetchPurchasedSeminars();
  }, []);

  const handleAddBalance = async () => {
    if (!user) return;

    try {
      const response = await api.post(`/user/${user.id}/add-balance`);
      alert("Added 1000 euros to your account!");
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Save updated user in localStorage
      setUser(updatedUser); // Update state
    } catch (error) {
      console.error("Error adding balance:", error);
    }
  };

  const handleBuy = async (id, price) => {
    if (!user) return;
    if (user.balance < price) {
      alert("Insufficient funds. Please add more money to your account.");
      return;
    }

    try {
      const response = await api.post(`/seminars/${id}/buy`, { user_id: user.id });
      alert(response.data.message);
      window.location.reload(); // Reload to refresh view
    } catch (error) {
      console.error("Error purchasing seminar:", error);
      alert(error.response.data.error);
    }
  };

  const handleView = (seminar) => {
    // Redirect to seminar details page (implementation will be needed)
  };

  const hasPurchasedSeminar = (seminar_id) => {
    return purchasedSeminars.includes(seminar_id);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Balance: {user && user.balance !== undefined ? `${user.balance} euros` : 'Loading...'}
        </Typography>
        <Button onClick={handleAddBalance} variant="contained" color="primary">
          Add 1000 euros to Account
        </Button>
      </Box>
      <Grid container spacing={3}>
        {seminars.map((seminar) => (
          <Grid item xs={12} sm={6} md={4} key={seminar.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:3000${seminar.preview_image}`}
                alt={seminar.title}
              />
              <CardContent>
                <Typography variant="h5">{seminar.title}</Typography>
                <Typography>{seminar.description}</Typography>
                <Typography>Price: {seminar.price > 0 ? `${seminar.price} euros` : "Free"}</Typography>
                {hasPurchasedSeminar(seminar.id) || seminar.price === 0 ? (
                  <Button onClick={() => handleView(seminar)} variant="contained" color="primary">
                    View
                  </Button>
                ) : (
                  <Button onClick={() => handleBuy(seminar.id, seminar.price)} variant="contained" color="secondary">
                    Buy
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudentView;
