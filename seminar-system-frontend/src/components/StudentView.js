// StudentView.js

import LinearProgress from '@mui/material/LinearProgress';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  CardMedia,
  Button,
  Box,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import api from '../api';

const StudentView = () => {
  const [seminars, setSeminars] = useState([]);
  const [user, setUser] = useState(null);
  const [purchasedSeminars, setPurchasedSeminars] = useState([]);
  
  // State for the seminar details modal
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [progress, setProgress] = useState('');

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }

    const fetchSeminars = async () => {
      try {
        const response = await api.get('/seminars');
        setSeminars(response.data.map(seminar => ({ ...seminar, rating: seminar.rating || 0 })));
      } catch (error) {
        console.error('Error fetching seminars:', error);
      }
    };

    const fetchUserBalance = async () => {
      if (loggedInUser) {
        try {
          const response = await api.get(`/user/${loggedInUser.id}`);
          setUser(prevUser => ({ ...prevUser, balance: response.data.balance }));
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
            rating: purchase.rating ?? 0
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
        const balanceResponse = await api.get(`/user/${user.id}`);
        setUser(prevUser => ({ ...prevUser, balance: balanceResponse.data.balance }));
      }
      setPurchasedSeminars([...purchasedSeminars, { seminar_id: id, rating: 0, exercises_done: 0 }]);
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
      // Removed unused 'response' variable assignment to fix ESLint warning.
      await api.post(`/seminars/${id}/rate`, { rating, user_id: user.id });
      alert("Thank you for rating!");
      const updatedSeminars = seminars.map(seminar =>
        seminar.id === id
          ? { ...seminar, rating: ((seminar.rating * seminar.rating_count) + rating) / (seminar.rating_count + 1), rating_count: seminar.rating_count + 1 }
          : seminar
      );
      setSeminars(updatedSeminars);
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

  // Updated handleView to auto-purchase free seminars and load saved progress.
  const handleView = async (seminar) => {
    // If seminar is free and not already purchased, auto-purchase it.
    if (seminar.price === 0 && !hasPurchasedSeminar(seminar.id)) {
      try {
        await api.post(`/seminars/${seminar.id}/buy`, { user_id: user.id });
        // Update purchasedSeminars with default progress (0).
        setPurchasedSeminars(prev => [...prev, { seminar_id: seminar.id, rating: 0, exercises_done: 0 }]);
        setProgress('0');
      } catch (error) {
        console.error("Error auto-purchasing free seminar:", error);
        alert("Error auto-purchasing free seminar.");
        return;
      }
    } else {
      // If already purchased, load saved progress if it exists.
      const purchase = purchasedSeminars.find(p => p.seminar_id === seminar.id);
      if (purchase && purchase.exercises_done !== undefined) {
         setProgress(purchase.exercises_done.toString());
      } else {
         setProgress('');
      }
    }
    setSelectedSeminar(seminar);
  };

  const handleCloseModal = () => {
    setSelectedSeminar(null);
  };

  // Save progress (number of exercises completed) by calling the backend endpoint.
  const handleSaveProgress = async () => {
    if (!user || !selectedSeminar) return;
    try {
      const response = await api.post(`/seminars/${selectedSeminar.id}/progress`, {
        user_id: user.id,
        exercises_done: progress
      });
      alert(response.data.message);
      // Update local purchase record with saved progress.
      setPurchasedSeminars(prev =>
        prev.map(p => p.seminar_id === selectedSeminar.id ? { ...p, exercises_done: Number(progress) } : p)
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating progress:", error);
      alert(error.response?.data?.error || "An error occurred while updating progress.");
    }
  };

  const hasPurchasedSeminar = (seminar_id) => {
    return purchasedSeminars.some(purchase => purchase.seminar_id === seminar_id);
  };

  const hasRatedSeminar = (seminar_id) => {
    const purchase = purchasedSeminars.find(purchase => purchase.seminar_id === seminar_id);
    return purchase && purchase.rating !== 0;
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
                <Typography>
                  Price: {seminar.price > 0 ? `${seminar.price} euros` : "Free"}
                </Typography>
                <Rating
                  value={
                    hasRatedSeminar(seminar.id)
                      ? purchasedSeminars.find(p => p.seminar_id === seminar.id).rating
                      : seminar.rating
                  } 
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

      {/* Seminar Details Modal */}
      <Dialog open={Boolean(selectedSeminar)} onClose={handleCloseModal} maxWidth="sm" fullWidth>
  {selectedSeminar && (
    <>
      <DialogTitle>{selectedSeminar.title} Details</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Description:</Typography>
        <Typography paragraph>{selectedSeminar.description}</Typography>
        <Typography variant="subtitle1">
          Difficulty: {selectedSeminar.difficulty}
        </Typography>
        <Typography variant="subtitle1">
          Exercises: {selectedSeminar.exercises}
        </Typography>
        <Typography variant="subtitle1">
          Duration: {selectedSeminar.duration} hours
        </Typography>
        {/* Progress display */}
        <Box mt={2} mb={1}>
          <Typography variant="body2" color="textSecondary">
            Progress: {progress || 0} / {selectedSeminar.exercises} exercises
          </Typography>
          <LinearProgress
            variant="determinate"
            value={selectedSeminar.exercises ? (Number(progress) / selectedSeminar.exercises) * 100 : 0}
          />
        </Box>
        <TextField
          label="Exercises Completed"
          type="number"
          fullWidth
          value={progress}
          onChange={(e) => {
            const val = e.target.value;
            // Ensure value is not greater than the total exercises
            if (Number(val) > selectedSeminar.exercises) {
              setProgress(selectedSeminar.exercises.toString());
            } else {
              setProgress(val);
            }
          }}
          margin="normal"
          inputProps={{ min: 0, max: selectedSeminar.exercises }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
        <Button
          onClick={() => {
            // Validate before saving
            if (Number(progress) > selectedSeminar.exercises) {
              alert("You cannot complete more exercises than available.");
              return;
            }
            handleSaveProgress();
          }}
          color="primary"
        >
          Save Progress
        </Button>
      </DialogActions>
    </>
  )}
</Dialog>

    </Container>
  );
};

export default StudentView;
