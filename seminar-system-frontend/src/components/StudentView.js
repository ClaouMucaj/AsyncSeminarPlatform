import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Container, Grid, CardMedia, Button, Box, Rating } from '@mui/material';
import api from '../api';

const StudentView = () => {
  const [seminars, setSeminars] = useState([]);
  const [user, setUser] = useState(null);
  const [purchasedSeminars, setPurchasedSeminars] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }

    const fetchSeminars = async () => {
      try {
        const response = await api.get('/seminars');
        setSeminars(response.data.map(seminar => ({ ...seminar, rating: seminar.rating || 0 }))); // Default to 0 if no rating
      } catch (error) {
        console.error('Error fetching seminars:', error);
      }
    };

    const fetchUserBalance = async () => {
      if (loggedInUser) {
        try {
          const response = await api.get(`/user/${loggedInUser.id}`);
          // const updatedUser = { ...loggedInUser, balance: response.data.balance };
          // console.log(updatedUser.balance);
          // localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(prevUser => ({ ...prevUser, balance: response.data.balance }));
          // console.log(response.data.balance)
          // setUser(updatedUser);
        } catch (error) {
          console.error("Error fetching user balance:", error);
        }
      }
    };

    const fetchPurchasedSeminars = async () => {
      if (loggedInUser) {
        try {
          const response = await api.get(`/user/${loggedInUser.id}/purchases`);
          setPurchasedSeminars(response.data.map(purchase => ({
            ...purchase,
            rating: purchase.rating ?? 0  // Default rating to 0 if not rated
          })));
        } catch (error) {
          console.error("Error fetching purchased seminars:", error);
        }
      }
    };

    fetchSeminars();
    fetchUserBalance();
    fetchPurchasedSeminars();
  }, []);

  const handleAddBalance = async () => {
    if (!user) return;

    try {
      const response = await api.post(`/user/${user.id}/add-balance`);
      alert("Added 1000 euros to your account!");
      setUser(prevUser => ({ ...prevUser, balance: response.data.balance }));
      // const updatedUser = response.data;
      // localStorage.setItem('user', JSON.stringify(updatedUser));
      // setUser(updatedUser);
    } catch (error) {
      console.error("Error adding balance:", error);
    }
  };

  const handleBuy = async (id, price) => {
    if (!user) return;
    if (price > 0 && user.balance < price) {
      alert("Insufficient funds. Please add more money to your account.");
      return;
    }

    try {
      const response = await api.post(`/seminars/${id}/buy`, { user_id: user.id });
      alert(response.data.message);
      if (price > 0) {
        // ✅ Update balance from DB instead of localStorage
        const balanceResponse = await api.get(`/user/${user.id}`);
        setUser(prevUser => ({ ...prevUser, balance: balanceResponse.data.balance }));
      }
      // if (price > 0) {
      //   const updatedUser = { ...user, balance: user.balance - price };

      //   localStorage.setItem('user', JSON.stringify(updatedUser));
      //   setUser(updatedUser);
      // }
      setPurchasedSeminars([...purchasedSeminars, { seminar_id: id, rating: 0 }]); // Add with default rating 0
    } catch (error) {
      console.error("Error purchasing seminar:", error);
      alert(error.response?.data?.error || "An error occurred while purchasing the seminar.");
    }
  };

  const handleRate = async (id, rating) => {
    if (!user || !hasPurchasedSeminar(id)) {
      alert("You must purchase this seminar before rating it.");
      return;
    }
  
    if (rating === null || rating === undefined) {
      alert("Please select a rating before submitting.");
      return;
    }
  
    try {
      // Ensure rating and user_id are passed in the body
      const response = await api.post(`/seminars/${id}/rate`, { rating, user_id: user.id });
      alert("Thank you for rating!");
  
      // Update seminar's rating in state
      const updatedSeminars = seminars.map(seminar =>
        seminar.id === id
          ? { ...seminar, rating: ((seminar.rating * seminar.rating_count) + rating) / (seminar.rating_count + 1), rating_count: seminar.rating_count + 1 }
          : seminar
      );
      setSeminars(updatedSeminars);
  
      // Update purchasedSeminars with the new rating status
      setPurchasedSeminars(
        purchasedSeminars.map(purchase =>
          purchase.seminar_id === id ? { ...purchase, rating } : purchase
        )
      );
    } catch (error) {
      console.error("Error rating seminar:", error);
      alert(error.response?.data?.error || "An error occurred while rating the seminar.");
    }
  };

  const handleView = (seminar) => {
    // Redirect to seminar details page (implementation needed)
  };

  const hasPurchasedSeminar = (seminar_id) => {
    return purchasedSeminars.some(purchase => purchase.seminar_id === seminar_id);
  };

  const hasRatedSeminar = (seminar_id) => {
    const purchase = purchasedSeminars.find(purchase => purchase.seminar_id === seminar_id);
    return purchase && purchase.rating !== 0; // Check if rating is non-zero
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
                <Rating
                  value={hasRatedSeminar(seminar.id) ? purchasedSeminars.find(p => p.seminar_id === seminar.id).rating : seminar.rating} 
                  precision={0.5}
                  onChange={(event, newValue) => handleRate(seminar.id, newValue)}
                  disabled={hasRatedSeminar(seminar.id)}
                />
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
