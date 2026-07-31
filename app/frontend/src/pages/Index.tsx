import React, { useEffect } from 'react';

const Index: React.FC = () => {
  useEffect(() => {
    window.location.href = '/static-site/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
};

export default Index;