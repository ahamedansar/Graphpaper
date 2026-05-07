import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fading out after 2.5 seconds
    const fadeTimer = setTimeout(() => setFade(true), 2500);
    // Unmount at 3 seconds
    const completeTimer = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-container ${fade ? 'splash-fade' : ''}`}>
      <div className="splash-content">
        <svg viewBox="0 0 500 100" className="writing-svg">
           <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="writing-text">
             Graphpaper
           </text>
        </svg>
      </div>
    </div>
  );
};

export default SplashScreen;
