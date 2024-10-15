// components/Loading.tsx
import React from 'react';


const Loading: React.FC = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
