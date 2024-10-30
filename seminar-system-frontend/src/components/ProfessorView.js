import React, { useState } from 'react';
import { TextField, Button, Container, Typography, FormControl, InputLabel, Select, MenuItem, Input } from '@mui/material';
import api from '../api';

const ProfessorView = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState(0);
  const [duration, setDuration] = useState(1);
  const [difficulty, setDifficulty] = useState('beginner');
  const [previewImage, setPreviewImage] = useState(null);
  const [price, setPrice] = useState(0); // Added state for price

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('created_by', 1); // Example, replace with the actual user ID
    formData.append('exercises', exercises);
    formData.append('duration', duration);
    formData.append('difficulty', difficulty);
    formData.append('price', price); // Include the price in the request
    if (previewImage) formData.append('preview_image', previewImage);

    try {
      await api.post('/seminars', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Seminar created successfully!");
      setTitle('');
      setDescription('');
      setExercises(0);
      setDuration(1);
      setDifficulty('beginner');
      setPrice(0); // Reset price
      setPreviewImage(null);
    } catch (error) {
      console.error("Error uploading seminar", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" style={{ margin: '20px 0' }}>Create a Seminar</Typography>
      <TextField fullWidth label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField fullWidth label="Description" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} style={{ marginTop: '10px' }} />
      <TextField fullWidth label="Number of Exercises" variant="outlined" type="number" value={exercises} onChange={(e) => setExercises(e.target.value)} style={{ marginTop: '10px' }} />
      <TextField fullWidth label="Duration (hours)" variant="outlined" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ marginTop: '10px' }} />
      
      <FormControl fullWidth variant="outlined" style={{ marginTop: '10px' }}>
        <InputLabel>Difficulty</InputLabel>
        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <MenuItem value="beginner">Beginner</MenuItem>
          <MenuItem value="intermediate">Intermediate</MenuItem>
          <MenuItem value="expert">Expert</MenuItem>
        </Select>
      </FormControl>

      {/* Add Price Input */}
      <TextField
        fullWidth
        label="Price (euros)"
        variant="outlined"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ marginTop: '10px' }}
      />
      
      <Input type="file" onChange={(e) => setPreviewImage(e.target.files[0])} style={{ marginTop: '10px' }} />
      
      <Button variant="contained" color="primary" fullWidth onClick={handleUpload} style={{ marginTop: '20px' }}>
        Upload Seminar
      </Button>
    </Container>
  );
};

export default ProfessorView;
