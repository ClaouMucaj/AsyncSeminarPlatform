import React, { useState } from 'react';
import api from '../api';

const CreateSeminar = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState(1); // Default user ID, replace with actual user later

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/seminars', { title, description, created_by: createdBy });
      setTitle('');
      setDescription('');
      alert('Seminar created successfully!');
    } catch (error) {
      console.error('Error creating seminar:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Seminar</h2>
      <div>
        <input
          type="text"
          placeholder="Seminar Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">Create Seminar</button>
    </form>
  );
};

export default CreateSeminar;
