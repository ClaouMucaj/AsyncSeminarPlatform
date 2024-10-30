import React from 'react';
import VideoPlayer from '../components/VideoPlayer';

const ViewSeminarPage = ({ videoUrl }) => {
  return (
    <div>
      <h1>Watch Seminar Video</h1>
      <VideoPlayer videoUrl={videoUrl} />
    </div>
  );
};

export default ViewSeminarPage;
