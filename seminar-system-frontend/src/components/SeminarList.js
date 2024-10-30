import React, { useEffect, useState } from 'react';
import api from '../api';

const SeminarList = () => {
  const [seminars, setSeminars] = useState([]);

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        const response = await api.get('/seminars');
        setSeminars(response.data);
      } catch (error) {
        console.error('Error fetching seminars:', error);
      }
    };

    fetchSeminars();
  }, []);

  return (
    <div>
      <h2>Available Seminars</h2>
      <ul>
        {seminars.map(seminar => (
          <li key={seminar.id}>
            <strong>{seminar.title}</strong>: {seminar.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeminarList;
