import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../public/lottie/Loading.json';

const LoadingScreen = ({ text = "Loading..." }) => {
  return (
    <div className="loading-screen-overlay">
      <div className="loading-screen-content">
        <div className="loading-animation">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            autoplay={true}
            style={{ width: 120, height: 120 }}
          />
        </div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;